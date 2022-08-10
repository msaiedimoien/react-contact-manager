import React, {useState, useEffect} from 'react';
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import axios from "axios";
import {AddContact, EditContact , Contact, Contacts, Navbar} from "./components";
import {getAllContacts, getAllGroups} from './services/contactService';

const App = () => {

    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const {data: contactsData} = await getAllContacts();
                const {data: groupsData} = await getAllGroups();

                setContacts(contactsData);
                setGroups(groupsData);

                setLoading(false);
            } catch (err) {
                console.log(err.message);
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route path='/' element={<Navigate to='/contacts'/>}/>
                <Route
                    path='/contacts'
                    element={<Contacts contacts={contacts} loading={loading}/>}
                />
                <Route path='/contacts/add' element={<AddContact/>}/>
                <Route path='/contacts/:contactId' element={<Contact/>}/>
                <Route path='/contacts/edit/:contactId' element={<EditContact/>}/>
            </Routes>
        </div>
    );
}

export default App;