import React, { useCallback, useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useConversations } from "../context/ConversationsProvider";
import { useContacts } from "../context/ContactsProvider";
import "../index.css";

const Conversations = () => {
  const { createSelectedConversation, conversations } = useConversations();
  const { contacts } = useContacts();
  const handleOpenConversation = (conversation, index) => {
    createSelectedConversation(conversation, index);
  };

  useEffect(() => {
    if (!conversations) return;
    getSelectedConversation();
  }, []);

  const getSelectedConversation = () => {
    const selectedConversation = conversations.find((x) => x.selected);
    if (!selectedConversation) return;
    const Index = conversations.findIndex(
      (x) => x.selected === selectedConversation.selected
    );
    createSelectedConversation(selectedConversation, Index);
  };
  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, index) => (
        <ListGroup.Item
          action
          active={conversation.selected}
          data-unread={conversation.unRead}
          className={`ItemList ${conversation.unRead > 0 ? "UnRead" : ""}`}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
          // style={{ background: "rgb(249, 248, 113)", color: "black" }}
          onClick={() => handleOpenConversation(conversation, index)}
        >
          {conversation.recepients
            .map((contact) => {
              if (!Boolean(contacts.length)) return contact.id;
              const isExisting = contacts.find((c) => c.id === contact.id);
              if (isExisting) return isExisting.name;
              return contact.id;
            })
            .join(",")}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Conversations;
