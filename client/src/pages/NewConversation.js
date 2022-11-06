import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Form } from "react-bootstrap";
import { useContacts } from "../context/ContactsProvider";

const NewConversation = forwardRef((props, ref) => {
  const { contacts } = useContacts();
  const [selectContactIds, setSelectedContactIds] = useState([]);
  const checkboxRef = useRef();
  useImperativeHandle(
    ref,
    () => {
      return {
        getSelectedContactIDs: () => selectContactIds,
      };
    },
    [selectContactIds]
  );
  const handleChange = (contactId) => {
    setSelectedContactIds((prevContacts) => {
      if (prevContacts.includes(contactId)) {
        return prevContacts.filter((x) => x !== contactId);
      }
      return [...prevContacts, contactId];
    });
  };
  return (
    <Form>
      {contacts.map(({ id, name }) => (
        <Form.Check
          type="checkbox"
          id={name}
          label={name}
          ref={checkboxRef}
          value={selectContactIds.includes(id)}
          onChange={(e) => handleChange(id)}
        />
      ))}
    </Form>
  );
});

export default NewConversation;
