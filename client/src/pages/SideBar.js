import React, { useRef, useState } from "react";
import { Alert, Button, Modal, Nav, Stack, Tab } from "react-bootstrap";
import Contacts from "./Contacts";
import Conversations from "./Conversations";
import "../index.css";
import NewConversation from "./NewConversation";
import NewContact from "./NewContact";
import { useContacts } from "../context/ContactsProvider";
import { useConversations } from "../context/ConversationsProvider";

const CONVERSATIONS = "conversations";
const CONTACTS = "contacts";
const SideBar = ({ id, setShowAlert }) => {
  const [activeKey, setActiveKey] = useState(CONVERSATIONS);
  const [modal, setModal] = useState(false);
  const contactRefs = useRef();
  const conversationRefs = useRef();
  const { createContact, contacts } = useContacts();
  const { createConversation, setConversations, setSelectedConversationIndex } =
    useConversations();

  const createNew = () => {
    if (activeKey === CONVERSATIONS) {
      const selectedContactIds =
        conversationRefs.current.getSelectedContactIDs();
      const selectedContacts = selectedContactIds.map((x) =>
        contacts.find((y) => y.id === x)
      );
      createConversation(selectedContacts);
    } else {
      if (!contactRefs.current.getIdRef() && !contactRefs.current.getNameRef())
        return;
      createContact({
        id: contactRefs.current.getIdRef(),
        name: contactRefs.current.getNameRef(),
      });
    }
    setModal(false);
  };

  const hideSelectedConversation = () => {
    setSelectedConversationIndex(null);
    setConversations((prevConversations) => {
      return prevConversations.map((conversation) => {
        return {
          ...conversation,
          selected: false,
        };
      });
    });
  };

  const validateNew = () => {
    if (activeKey === CONVERSATIONS) {
      if (!Boolean(contacts.length)) {
        setShowAlert(true);
        return;
      }
      setShowAlert(false);
    }
    setModal(true);
  };

  return (
    <>
      <div
        className="d-flex flex-column"
        style={{ background: "linear-gradient(to right, black, #43302e)" }}
      >
        <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
          <Nav variant="tabs" className="d-flex justify-content-around">
            <Nav.Item
              className={`flex-item ${
                activeKey === CONVERSATIONS ? "focussed" : ""
              }`}
            >
              <Nav.Link className={`rounded-0`} eventKey={CONVERSATIONS}>
                Conversations
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className={`flex-item ${
                activeKey === CONTACTS ? "focussed" : ""
              }`}
            >
              <Nav.Link
                eventKey={CONTACTS}
                className={`rounded-0`}
                onClick={hideSelectedConversation}
                style={{
                  borderBottom:
                    activeKey === CONTACTS
                      ? "5px solid rgb(255 253 9 / 92%) !important"
                      : "",
                }}
              >
                Contacts
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content
            className="border-right overflow-auto flex-grow-1"
            style={{ borderRight: "1px solid #dee2e6", padding: "8px 0px" }}
          >
            <Tab.Pane eventKey={CONVERSATIONS}>
              <Conversations />
            </Tab.Pane>
            <Tab.Pane eventKey={CONTACTS}>
              <Contacts />
            </Tab.Pane>
          </Tab.Content>
          <div
            className="p-2 border-top border-right small"
            style={{ borderRight: "1px solid #dee2e6", color: "whitesmoke" }}
          >
            Your Id{" "}
            <span className="" style={{ color: "rgb(255 253 9 / 92%)" }}>
              {id}
            </span>
          </div>
          <Button
            className="rounded-0 mb-2 newButton"
            onClick={() => validateNew()}
          >
            New {activeKey === CONVERSATIONS ? "Conversation" : "Contact"}
          </Button>

          <Modal show={modal} className="rounded-0">
            <Modal.Header>
              <Modal.Title className="p-12">
                {activeKey === CONVERSATIONS
                  ? "Select Contacts"
                  : "Add Contact"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {activeKey === CONVERSATIONS ? (
                <NewConversation ref={conversationRefs} />
              ) : (
                <NewContact ref={contactRefs} />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Stack gap={3} direction="horizontal">
                <Button onClick={createNew} className="primary">
                  {" "}
                  {activeKey === CONVERSATIONS ? "Start Conversation" : "Save"}
                </Button>
                <Button onClick={() => setModal(false)} className="secondary">
                  Cancel
                </Button>
              </Stack>
            </Modal.Footer>
          </Modal>
        </Tab.Container>
      </div>
    </>
  );
};

export default SideBar;
