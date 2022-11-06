import React, { useRef } from "react";
import { Button, Container, Form, Stack } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const Login = ({ onIdSubmit }) => {
  const idRef = useRef();
  function handleSubmit(e) {
    e.preventDefault();
    onIdSubmit(idRef.current.value);
  }
  return (
    <Container
      className="d-flex column align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Form className="w-100">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter your Id"
            ref={idRef}
          ></Form.Control>
        </Form.Group>
        <Stack direction="horizontal" gap={2}>
          <Button variant="primary" onClick={handleSubmit}>
            Login
          </Button>
          <Button variant="secondary" onClick={() => {onIdSubmit(uuidv4())}}>
            Create an Id
          </Button>
        </Stack>
      </Form>
    </Container>
  );
};

export default Login;
