import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Container, Form } from "react-bootstrap";
import { useContacts } from "../context/ContactsProvider";

const NewContact = forwardRef((props, ref) => {
  const idRef = useRef();
  const nameRef = useRef();

  useImperativeHandle(
    ref,
    () => {
      return {
        getIdRef: () => idRef.current.value,
        getNameRef: () => nameRef.current.value,
      };
    },
    []
  );
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Control placeholder="Name" type="text" ref={nameRef} required />
      </Form.Group>
      <Form.Group>
        <Form.Control placeholder="Id" type="text" ref={idRef} required />
      </Form.Group>
    </Form>
  );
});

export default NewContact;
