import React, {useState} from 'react';
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import {AddContact, EditContact , Contact, Contacts, Navbar} from "./components";

const App = () => {

    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);

    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route path='/' element={<Navigate to='/contacts'/>}/>
                <Route path='/contacts' element={<Contacts contacts={contacts} loading={loading}/>}/>
                <Route path='/contacts/add' element={<AddContact/>}/>
                <Route path='/contacts/:contactId' element={<Contact/>}/>
                <Route path='/contacts/edit/:contactId' element={<EditContact/>}/>
            </Routes>
        </div>
    );
}

export default App;