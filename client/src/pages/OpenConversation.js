import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { useContacts } from "../context/ContactsProvider";
import { useConversations } from "../context/ConversationsProvider";
import { ReactComponent as DoubleCheck } from "../assests/check-double-solid.svg";
import { ReactComponent as SingleCheck } from "../assests/check-solid.svg";
import "../index.css";

const OpenConversation = ({
  id,
  refreshConversationTab,
  setRefreshConversationTab,
  forceUpdate,
}) => {
  const {
    selectedConversation,
    sendMessage,
    emitTyping,
    updateConversationWithRead,
    updatedUnreadToRead,
    selectedConversationIndex,
  } = useConversations();
  console.log(refreshConversationTab);
  const { contacts } = useContacts();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  // const [refresh, setRefresh] = useState(refreshConversationTab);

  const lastTextRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  if (refreshConversationTab) {
    updateConversationWithRead(selectedConversation);
    setRefreshConversationTab(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(text, selectedConversation.recepients);
    setText("");
    setTyping(false);
    updateConversationWithRead(selectedConversation);
  };

  const getContact = (message) => {
    if (!Boolean(contacts.length)) return message.id;
    const foundName = contacts.find((x) => x.id === message.id);
    if (foundName) return foundName.name;
    return message.id;
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value && e.keyCode !== 13) {
      setTyping(true);
      return;
    }
    setTyping(false);
  };

  useEffect(() => {
    if (typing) {
      emitTyping(true, selectedConversation.recepients);
    }
    return () => {
      emitTyping(false, selectedConversation.recepients);
    };
  }, [typing]);

  const getTypingStatus = () => {
    return (
      <div
        className="border"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {selectedConversation.recepients.map((contact) => {
          const isExisting = contacts.find((c) => c.id === contact.id);
          if (!Boolean(contact.status)) return "";
          if (Boolean(contact.status === "typing" && contact.id !== id))
            return (
              <span style={{ displa: "block" }}>
                {isExisting?.name || contact.id} is{" "}
                <span
                  style={{ color: "rgb(39 151 39 / 97%)", fontWeight: "bold" }}
                >
                  typing...
                </span>
              </span>
            );
          return "";
        })}
      </div>
    );
  };

  const getReadStatus = (message) => {
    if (id !== message.id) return;
    const isRead = selectedConversation.recepients.every((x) =>
      message?.readBy?.includes(x.id)
    );
    if (isRead)
      return (
        <span>
          <DoubleCheck width="12px" />
        </span>
      );
    return (
      <span>
        <SingleCheck width="12px" />
      </span>
    );
  };

  useEffect(() => {
    updateConversationWithRead(selectedConversation);
    updatedUnreadToRead(selectedConversationIndex);
  }, []);

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div
        className="d-flex align-items-center p-2"
        style={{
          borderBottom: "1px solid rgb(222, 226, 230)",
          background: "rgb(249, 248, 113)",
          color: "black",
        }}
      >
        {selectedConversation.recepients
          .map((contact) => {
            if (!Boolean(contacts.length)) return contact.id;
            const isExisting = contacts.find((c) => c.id === contact.id);
            if (isExisting) return isExisting.name;
            return contact.id;
          })
          .join(",")}
      </div>
      <div
        className="overflow-auto p-2 d-flex flex-column flex-grow-1"
        style={{ gap: "10px" }}
      >
        {selectedConversation.messages.map((message, i, arr) => {
          const lastMessage = i === arr.length - 1;
          return (
            <span
              ref={lastMessage ? lastTextRef : null}
              className={`d-flex flex-column ${
                message.id === id ? "align-items-end" : "align-items-start"
              }`}
            >
              <span
                className={`rounded px-2 py-1 ${
                  message.id === id ? "you" : "border them"
                }`}
              >
                {message.text} {getReadStatus(message)}
              </span>
              <span className={`to text-muted`} style={{ marginLeft: "4px" }}>
                {message.id === id ? "You" : getContact(message)}
              </span>
            </span>
          );
        })}
      </div>
      {getTypingStatus()}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <InputGroup>
            <Form.Control
              type="text-area"
              required
              value={text}
              className="rounded-0"
              onChange={(e) => handleChange(e)}
              style={{ height: "80px", resize: "none" }}
              // onKeyDown={handleKeyDown}
            />
            <Button type="submit" className="rounded-0 sendButton">
              Send
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
};

export default OpenConversation;
