import { useState } from "react";
import { ContactsProvider } from "./context/ContactsProvider";
import { ConversationsProvider } from "./context/ConversationsProvider";
import { SocketProvider } from "./context/SocketProvider";
import useLocalStorage from "./hooks/useLocalStorage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const [id, setId] = useLocalStorage("id", "");
  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  );
  return (
    <div style={{ height: "100vh" }}>
      {id ? dashboard : <Login onIdSubmit={setId} />}
    </div>
  );
}

export default App;
