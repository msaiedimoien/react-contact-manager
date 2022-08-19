import './App.css';
import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import _ from 'lodash';

import {AddContact, EditContact, Contacts, Navbar, ViewContact} from "./components";
import {createContact, getAllContacts, getAllGroups, deleteContact} from './services/contactService';
import {ContactContext} from "./context/contactContext";
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";
import button from "bootstrap/js/src/button";

const App = () => {

    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [contact, setContact] = useState({});
    // const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const {data: contactsData} = await getAllContacts();
                const {data: groupsData} = await getAllGroups();

                setContacts(contactsData);
                setFilteredContacts(contactsData);
                setGroups(groupsData);

                setLoading(false);
            } catch (err) {
                console.log(err.message);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const onContactChange = (event) => {
        setContact({
            ...contact,
            [event.target.name]: event.target.value,
        });
    };

    const createContactForm = async (values) => {
        try {
            //loading(true);
            // await contactSchema.validate(contact, {abortEarly: false});

            const {status, data} = await createContact(values);

            if (status === 201) {
                const allContacts = [...contacts, data];
                setContacts(allContacts);
                setFilteredContacts(allContacts);

                // setContact({});
                // setErrors([]);
                //loading((prevLoading) => !prevLoading);
                navigate("/contacts");
            }
        } catch (err) {
            console.log(err.message);
            // setErrors(err.inner);
            //loading(false);
        }
    }

    const confirmDelete = (contactId, contactFullname) => {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div dir="rtl" style={{
                        backgroundColor: CURRENTLINE,
                        border: `1px solid ${PURPLE}`,
                        borderRadius: "1rem",
                    }}
                         className="p-4"
                    >
                        <h4 style={{color: YELLOW}}>پاک کردن مخاطب</h4>
                        <br/>
                        <p style={{color: FOREGROUND}}>
                            مطمینی که میخوای مخاطب {contactFullname} رو پاک کنی؟
                        </p>
                        <div className='d-flex flex-row-reverse'>
                            <button
                                onClick={onClose}
                                className="btn"
                                style={{backgroundColor: COMMENT}}
                            >
                                انصراف
                            </button>

                            <button
                                onClick={() => {
                                    removeContact(contactId);
                                    onClose();
                                }}
                                className="btn mx-2"
                                style={{backgroundColor: PURPLE}}
                            >
                                مطمین هستم
                            </button>
                        </div>
                    </div>
                )
            }
        })
    }

    const removeContact = async (contactId) => {
        /*
         * NOTE
         * 1- forceRender -> setForceRender
         * 2- Server Request
         * 3- Delete Local State
         * 4- Delete State Before Server Request
         */

        // Contacts Copy
        const allContacts = [...contacts];
        try {
            setLoading(true);

            const updatedContacts = contacts.filter(c => c.id !== contactId);
            setContacts(updatedContacts);
            setFilteredContacts(updatedContacts);

            // Sending delete request to server
            const {status} = await deleteContact(contactId);

            setLoading(false);
            if (status !== 200) {
                setContacts(allContacts);
                setFilteredContacts(allContacts);
            }
        } catch (err) {
            setContacts(allContacts);
            setFilteredContacts(allContacts);
            setLoading(false);
            console.log(err.message);
        }
    }

    const contactSearch = _.debounce( (query) => {
        if (!query) return setFilteredContacts(contacts);

        setFilteredContacts(
            contacts.filter((contact) => {
                return contact.fullname
                    .toLowerCase()
                    .includes(query.toLowerCase());
            })
        );
    }, 1000);

    return (
        <ContactContext.Provider value={{
            loading, setLoading,
            contact, setContact,
            // contactQuery,
            contacts, setContacts,
            filteredContacts, setFilteredContacts,
            groups,
            onContactChange,
            deleteContact: confirmDelete,
            createContact: createContactForm,
            contactSearch,
        }}>
            <div className="App">
                <Navbar/>
                <Routes>
                    <Route path='/' element={<Navigate to='/contacts'/>} />
                    <Route path='/contacts' element={<Contacts/>} />
                    <Route path='/contacts/add' element={<AddContact/>} />
                    <Route path='/contacts/:contactId' element={<ViewContact/>} />
                    <Route path='/contacts/edit/:contactId' element={<EditContact/>} />
                </Routes>
            </div>
        </ContactContext.Provider>
    );
}

export default App;