import React, {useState, useEffect} from 'react';
import './App.css';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import {AddContact, EditContact, Contacts, Navbar, ViewContact} from "./components";
import {createContact, getAllContacts, getAllGroups, deleteContact, getContact} from './services/contactService';
import { confirmAlert } from 'react-confirm-alert';
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";
import button from "bootstrap/js/src/button";

const App = () => {

    const [loading, setLoading] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [contactsFiltered, setContactsFiltered] = useState([]);
    const [groups, setGroups] = useState([]);
    const [contact, setContact] = useState({
        fullname: "",
        photo: "",
        mobile: "",
        email: "",
        job: "",
        group: ""
    });
    const [query, setQuery] =useState({text: ""});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const {data: contactsData} = await getAllContacts();
                const {data: groupsData} = await getAllGroups();

                setContacts(contactsData);
                setContactsFiltered(contactsData);
                setGroups(groupsData);

                setLoading(false);
            } catch (err) {
                console.log(err.message);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const {data: contactsData} = await getAllContacts();
                setContacts(contactsData);
                setContactsFiltered(contactsData);
                setLoading(false);
            } catch (err) {
                console.log(err.message);
                setLoading(false);
            }
        }

        fetchData();
    }, [forceRender]);

    const setContactInfo = (event) => {
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
                setForceRender(!forceRender);
                navigate("/contacts");
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    const confirm =(contactId, contactFullname)=> {
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
        setQuery({...query, text: event.target.value});
        const allContacts = contacts.filter((c) => {
            const allContacts = c.fullname
                .toLowerCase()
                .includes(event.target.value.toLowerCase());
        })
        setContactsFiltered(allContacts);
    }

    return (
        <div className="App">
            <Navbar query={query} search={contactSearch}/>
            <Routes>
                <Route path='/' element={<Navigate to='/contacts'/>}/>
                <Route
                    path='/contacts'
                    element={<Contacts contacts={contactsFiltered} loading={loading} confirmDelete={confirm}/>}
                />
                <Route
                    path='/contacts/add'
                    element={<AddContact
                        loading={loading}
                        contact={contact}
                        groups={groups}
                        createContactForm={createContactForm}
                        setContactInfo={setContactInfo}
                    />}/>
                <Route path='/contacts/:contactId' element={<ViewContact/>}/>
                <Route
                    path='/contacts/edit/:contactId'
                    element={<EditContact
                        forceRender={forceRender}
                        setForceRender={setForceRender}/>}
                />
            </Routes>
        </div>
    );
}

export default App;