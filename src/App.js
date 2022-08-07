import React, {useState} from 'react';
import './App.css';
import {AddContact, EditContact, ViewContact, Contact, Contacts, Navbar} from "./components";

const App = () => {

    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);

    return (
        <div className="App">
            <Navbar/>
            <Contacts contacts={contacts} loading={loading}/>
        </div>
    );
}

export default App;
