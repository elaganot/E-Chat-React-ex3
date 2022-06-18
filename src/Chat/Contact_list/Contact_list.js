import React, { useState, useEffect } from 'react'
import Contact_item from '../Contact_item/Contact_item';
import './Contact_list.css'
import AddContact from '../AddContact/AddContact'



function Contact_list({ contacts, setContacts, setChatBox, userName, name }){

  //const [contactsInit, setContactsInit] = useState(false);
  const [foundContact, setFoundContact] = useState(
    contacts.find((contact) => contact.name == name)
  );
  console.log(contacts);

  console.log(foundContact);
  //console.log(foundContact.);

  const [newContact, setNewContact] = useState(null)

  const [foundContactContacts, setFoundContactContacts] = useState(null)


  useEffect(async () => {
    const response = await fetch('http://localhost:7213/api/contacts/' + userName, {
      method: 'GET'
    })
    const data = await response.json();
    setFoundContactContacts(data);
  }, [])

  useEffect(() => {
    async function fetchData() {
      if(newContact != null) {

        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ "id": newContact.id, "name": newContact.name, "server": newContact.server })
        };
        await fetch('http://localhost:7213/api/contacts/' + userName, requestOptions)
        console.log(newContact.id);

        const requestOptions2 = {
          method: 'POST',
          mode: 'cors',
          headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ "from": userName, "to": newContact.id, "server": "localhost:7213" })
        };
        await fetch('http://' + newContact.server + '/api/invitations', requestOptions2)

      }
    }
    fetchData();

  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [newContact]);

  const [contactList, setContactList] = useState(null); 
  useEffect(() => {
    if(foundContact && foundContactContacts) {
      setContactList(foundContactContacts.map((contact, key) => 
        <Contact_item  {...contact} setChatBox={setChatBox} userName={userName} key={key} />
      ))
    }
  }, [foundContactContacts])

  return (
    <div className='contact-list'>
      {contactList}
      <AddContact userName={userName} userContacts = {foundContactContacts} contacts={contacts} alertFunction={(newFriend) => {
        setNewContact(newFriend);
        setFoundContactContacts([...foundContactContacts, newFriend]);
      }} />
    </div>
  )
}


export default Contact_list;