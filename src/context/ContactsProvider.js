import React, { useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const Contacts = React.createContext();

export function useContacts() {
  return useContext(Contacts);
}

export function ContactsProvider({ children }) {
  const [contacts, setContacts] = useLocalStorage("contacts", []);

  const createContact = (contact) => {
    if (!Boolean(contact)) return;
    const contactExits = contacts.filter((c) => c.id === contact.id);
    if (Boolean(contactExits.length)) return;
    setContacts((prevContacts) => {
      return [...prevContacts, contact];
    });
  };
  return (
    <Contacts.Provider value={{ contacts, createContact }}>
      {children}
    </Contacts.Provider>
  );
}
