import React, {useState, useEffect} from 'react';
import './App.css';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import {AddContact, EditContact, Contacts, Navbar, ViewContact} from "./components";
import {createContact, getAllContacts, getAllGroups, deleteContact} from './services/contactService';
import { confirmAlert } from 'react-confirm-alert';
import {ContactContext} from "./context/contactContext";
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";
import button from "bootstrap/js/src/button";

const App = () => {

    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [contact, setContact] = useState({});
    const [contactQuery, setContactQuery] =useState({text: ""});
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

    const createContactForm = async (event) => {
        event.preventDefault();
        try {
            const {status} = await createContact(contact);

            if (status === 201) {
                setContact({});
                navigate("/contacts");
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    const confirmDelete =(contactId, contactFullname)=> {
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
        try{
            setLoading(true);
            const response = await deleteContact(contactId);

            if(response){
                const {data: contactsData} = await getAllContacts();
                setContacts(contactsData);
                setLoading(false);
            }
        }catch (err) {
            setLoading(false);
            console.log(err.message);
        }
    }

    const contactSearch = (event) => {
        setContactQuery({...contactQuery, text: event.target.value});
        const allContacts = contacts.filter((contact) => {
            return contact.fullname
                .toLowerCase()
                .includes(event.target.value.toLowerCase());
        })
        setFilteredContacts(allContacts);
    }

    return (
        <ContactContext.Provider value={{
            loading, setLoading,
            contact, setContact, contactQuery,
            contacts, filteredContacts,
            groups,
            onContactChange,
            deleteContact: confirmDelete,
            createContact: createContactForm,
            contactSearch,
        }}>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path='/' element={<Navigate to='/contacts'/>}/>
                    <Route
                        path='/contacts'
                        element={<Contacts contacts={filteredContacts} loading={loading} confirmDelete={confirmDelete}/>}
                    />
                    <Route
                        path='/contacts/add'
                        element={<AddContact
                            loading={loading}
                            contact={contact}
                            groups={groups}
                            createContactForm={createContactForm}
                            setContactInfo={onContactChange}
                        />}/>
                    <Route path='/contacts/:contactId' element={<ViewContact/>}/>
                    <Route
                        path='/contacts/edit/:contactId'
                        element={<EditContact/>}
                    />
                </Routes>
            </div>
        </ContactContext.Provider>
    );
}

export default App;