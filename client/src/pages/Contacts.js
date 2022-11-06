import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useContacts } from '../context/ContactsProvider'

const Contacts = () => {
    const {contacts} =useContacts()
  return (
  <ListGroup variant='flush'>
    {contacts.map(({id,name}) => (
        <ListGroup.Item>{name}</ListGroup.Item>
    ))}
  </ListGroup>
  )
}

export default Contacts