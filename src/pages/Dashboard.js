import React, { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { useContacts } from "../context/ContactsProvider";
import { useConversations } from "../context/ConversationsProvider";
import OpenConversation from "./OpenConversation";
import SideBar from "./SideBar";
import "../index.css";

const Dashboard = ({ id }) => {
  const {
    selectedConversation,
    setConversations,
    refreshConversationTab,
    setRefreshConversationTab,
  } = useConversations();
  const [showAlert, setShowAlert] = useState(false);
  const { contacts } = useContacts();
  const [stateNew, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    if (!Boolean(contacts.length)) return;
    setConversations((prevConvo) => {
      const updatedConvos = prevConvo.map((convo) => {
        const newReceipeints = convo.recepients.map((recepient) => {
          let contactExist = false;
          contacts.forEach((c) => {
            if (c.id === recepient.id) contactExist = true;
            else contactExist = false;
          });
          if (contactExist) {
            const savedContact = contacts.find((c) => c.id === recepient.id);
            return {
              ...recepient,
              name: savedContact.name,
            };
          } else return recepient;
        });
        return {
          ...convo,
          recepients: newReceipeints,
        };
      });
      return updatedConvos;
    });
  }, [contacts]);
  return (
    <>
      {showAlert && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            width: "100%",
          }}
        >
          <Alert
            key={"warning"}
            variant={"warning"}
            className="center"
            transition="fade"
            dismissible
            onClose={() => setShowAlert(false)}
          >
            Please add contacts to start a conversation.
          </Alert>
        </div>
      )}
      <div className="dashborad" style={{ height: "100vh" }}>
        <SideBar id={id} setShowAlert={setShowAlert} />
        {selectedConversation && (
          <OpenConversation
            id={id}
            refreshConversationTab={refreshConversationTab}
            forceUpdate={forceUpdate}
            stateNew={stateNew}
            setRefreshConversationTab={setRefreshConversationTab}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
