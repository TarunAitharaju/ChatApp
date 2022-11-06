import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";
import _ from "lodash";

const Conversations = React.createContext();

export function useConversations() {
  return useContext(Conversations);
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );
  const socket = useSocket();
  const [selectedConversationIndex, setSelectedConversationIndex] = useState();
  const [refreshConversationTab, setRefreshConversationTab] = useState(false);
  const { contacts } = useContacts();

  const conversationAlreadyExist = (recepients) => {
    if (!Boolean(formattedConversations.length)) return false;
    let AlreadyThere = false;
    conversations.forEach((conversation) => {
      if (arrayEqual(conversation.recepients, recepients)) {
        AlreadyThere = true;
      }
    });
    return AlreadyThere;
  };

  const createConversation = (selectedContacts) => {
    if (!Boolean(selectedContacts.length)) return;
    if (conversationAlreadyExist(selectedContacts)) return;
    setConversations((prevConversations) => {
      return [
        ...prevConversations,
        {
          recepients: selectedContacts,
          messages: [],
        },
      ];
    });
  };
  const formattedConversations = conversations.map(
    (conversation) => conversation.recepients
  );
  const createSelectedConversation = (conversation, index) => {
    setSelectedConversationIndex(index);
    setConversations((prevConvs) => {
      return prevConvs.map((conv) => {
        if (arrayEqual(conv.recepients, conversation.recepients)) {
          return {
            ...conv,
            selected: true,
          };
        } else return { ...conv, selected: false };
      });
    });
  };

  const updatedUnreadToRead = (selecteIndex) => {
    setConversations((prevCon) => {
      return prevCon.map((c, i) => {
        if (c.selected) {
          return {
            ...c,
            unRead: 0,
          };
        } else return c;
      });
    });
  };

  const addMessageToConversation = useCallback(
    ({ message, recepients, sender, reloadNow }) => {
      setConversations((conversation) => {
        let madeChange = false;
        const newConversations = conversation.map((c) => {
          //  debugger;
          if (arrayEqual(c.recepients, recepients)) {
            // debugger;
            madeChange = true;
            let unReadCount = 0;
            if (id !== sender) {
              if (!c?.selected) {
                // debugger;
                unReadCount = c.unRead ? c.unRead + 1 : unReadCount + 1;
              }
            }
            return {
              ...c,
              messages: [...c.messages, { id: sender, text: message }],
              unRead: unReadCount,
            };
          } else return c;
        });
        if (madeChange) {
          return newConversations;
        } else {
          return [
            ...conversation,
            {
              recepients,
              messages: [{ id: sender, text: message }],
            },
          ];
        }
      });
      reloadNow && reloadNow();
    },
    [setConversations]
  );
  const updateTypingstatus = useCallback(
    ({ recepients, sender, typing }) => {
      console.log(recepients, sender);
      setConversations((prevConversations) => {
        return prevConversations.map((conversation) => {
          if (arrayEqual(conversation.recepients, recepients)) {
            // const newReceps = recepients;
            return {
              ...conversation,
              recepients: conversation.recepients.map((r) =>
                r.id === sender ? { ...r, status: typing } : r
              ),
            };
          } else {
            return conversation;
          }
        });
      });
    },
    [setConversations]
  );

  const UpdateInStateConversation = useCallback(
    ({ recepients, sender }) => {
      console.log(recepients, sender);
      if (id === sender) return;
      setConversations((prevCon) => {
        return prevCon.map((con) => {
          if (arrayEqual(con.recepients, recepients)) {
            const myMessages = con.messages.filter((x) => x.id === id);
            const myLastMesages = myMessages.map((x) => x.id);
            const myLastId = myLastMesages.lastIndexOf(id);
            const OtherMessages = con.messages.filter((x) => x.id !== id);
            const myLastMessage = myMessages[myMessages.length - 1];

            if (!Boolean(OtherMessages.length)) {
              return {
                ...con,
                messages: con.messages.map((m, i) => {
                  if (myLastId === i) {
                    const noData = m.hasOwnProperty("readBy") ? false : true;
                    const newReadBy = noData ? [sender] : [...m.readBy, sender];
                    const updatedMessages = _.uniq(newReadBy);
                    return {
                      ...m,
                      readBy: updatedMessages,
                    };
                  } else return m;
                }),
              };
            }
            // debugger;
            console.log(_.uniqBy(OtherMessages, "id"));
            if (arrayEqual(_.uniqBy(OtherMessages, "id"), recepients)) {
              const MyLastIndex = con.messages.map((x) => x.id).lastIndexOf(id);
              return {
                ...con,
                messages: con.messages.map((m, i) => {
                  if (m.id !== id) return m;
                  if (MyLastIndex === i) {
                    const noData = m.hasOwnProperty("readBy") ? false : true;
                    const newReadBy = noData ? [sender] : [...m.readBy, sender];
                    const updatedMessages = _.uniq(newReadBy);
                    return {
                      ...m,
                      readBy: updatedMessages,
                    };
                  } else return m;
                }),
              };
            } else {
              const MyLastIndex = con.messages.map((x) => x.id).lastIndexOf(id);
              return {
                ...con,
                messages: con.messages.map((m, i) => {
                  if (m.id !== id) return m;
                  if (MyLastIndex === i) {
                    const noData = m.hasOwnProperty("readBy") ? false : true;
                    const newReadBy = noData ? [sender] : [...m.readBy, sender];
                    const updatedMessages = _.uniq(newReadBy);
                    return {
                      ...m,
                      readBy: updatedMessages,
                    };
                  } else return m;
                }),
              };
            }
          } else {
            return con;
          }
        });
      });
    },
    [setConversations]
  );

  useEffect(() => {
    if (socket == null) return;

    socket.on("receive-message", ({ message, recepients, sender }) =>
      addMessageToConversation({ message, recepients, sender, reloadNow })
    );
    function reloadNow() {
      setRefreshConversationTab(true);
    }
    return () => {
      socket.off("receive-message");
    };
  }, [socket, addMessageToConversation]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("receive-typing", updateTypingstatus);
    return () => {
      socket.off("receive-typing");
    };
  }, [socket, updateTypingstatus]);

  useEffect(() => {
    if (socket == null) return;
    socket.on("receive-read", UpdateInStateConversation);
    return () => {
      socket.off("receive-read");
    };
  }, [socket, UpdateInStateConversation]);

  const emitTyping = (typing, recepients) => {
    const text = typing ? "typing" : "not";
    socket.emit("typing", {
      typing: text,
      recepients,
    });
  };

  const updateConversationWithRead = (selectedConversation) => {
    const recepients = selectedConversation.recepients;
    const sender = id;
    if (!Boolean(selectedConversation.messages.length)) return;
    socket.emit("read", {
      recepients,
      sender,
    });
  };

  const sendMessage = (message, recepients) => {
    console.log(recepients, "before emit send");
    socket.emit("send-message", { recepients, message, id });
    addMessageToConversation({ message, recepients, sender: id });
  };
  function arrayEqual(recepients, selectedContacts) {
    if (recepients.length !== selectedContacts.length) return false;
    let newRecep = _.sortBy(recepients, "id");
    let newContacts = _.sortBy(selectedContacts, "id");
    return newRecep.every((e, i) => newContacts[i].id === e.id);
  }

  return (
    <Conversations.Provider
      value={{
        conversations,
        createConversation,
        createSelectedConversation,
        selectedConversation: conversations[selectedConversationIndex],
        setSelectedConversationIndex,
        sendMessage,
        emitTyping,
        refreshConversationTab,
        setRefreshConversationTab,
        updateConversationWithRead,
        updatedUnreadToRead,
        setConversations: setConversations,
      }}
    >
      {children}
    </Conversations.Provider>
  );
}
