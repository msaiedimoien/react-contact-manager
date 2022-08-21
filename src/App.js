import './App.css';
import React, {useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import _ from 'lodash';
import {useImmer} from "use-immer";
import {ToastContainer, toast} from "react-toastify";

import {AddContact, EditContact, Contacts, Navbar, ViewContact} from "./components";
import {createContact, getAllContacts, getAllGroups, deleteContact} from './services/contactService';
import {ContactContext} from "./context/contactContext";
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";
import button from "bootstrap/js/src/button";

const App = () => {

    const [loading, setLoading] = useImmer(false);
    const [contacts, setContacts] = useImmer([]);
    const [filteredContacts, setFilteredContacts] = useImmer([]);
    const [groups, setGroups] = useImmer([]);
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

    const createContactForm = async (values) => {
        try {
            setLoading(true);
            const {status, data} = await createContact(values);

            if (status === 201) {
                toast.success("مخاطب با موفقیت ساخته شد");
                setContacts(draft => {
                    draft.push(data);
                });
                setFilteredContacts(draft => {
                    draft.push(data);
                });

                setLoading(false);
                navigate("/contacts");
            }
        } catch (err) {
            console.log(err.message);
            setLoading(false);
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
        const contactsBackup = [...contacts];
        try {
            setLoading(true);
            setContacts(draft => draft.filter(c => c.id !== contactId));
            setFilteredContacts(draft => draft.filter(c => c.id !== contactId));

            const {status} = await deleteContact(contactId);
            toast.success("مخاطب با موفقیت حذف شد");

            setLoading(false);
            if (status !== 200) {
                setContacts(contactsBackup);
                setFilteredContacts(contactsBackup);
            }
        } catch (err) {
            setContacts(contactsBackup);
            setFilteredContacts(contactsBackup);
            setLoading(false);
            console.log(err.message);
        }
    }

    const contactSearch = _.debounce((query) => {
        if (!query) return setFilteredContacts([...contacts]);

        setFilteredContacts(draft => draft.filter(c => c.fullname.toLowerCase().includes(query.toLowerCase())))
    }, 1000);

    return (
        <ContactContext.Provider value={{
            loading, setLoading,
            contacts, setContacts,
            filteredContacts, setFilteredContacts,
            groups,
            deleteContact: confirmDelete,
            createContact: createContactForm,
            contactSearch,
        }}>
            <div className="App">
                <ToastContainer rtl={true} position={"top-right"} theme={"colored"}/>
                <Navbar/>
                <Routes>
                    <Route path='/' element={<Navigate to='/contacts'/>}/>
                    <Route path='/contacts' element={<Contacts/>}/>
                    <Route path='/contacts/add' element={<AddContact/>}/>
                    <Route path='/contacts/:contactId' element={<ViewContact/>}/>
                    <Route path='/contacts/edit/:contactId' element={<EditContact/>}/>
                </Routes>
            </div>
        </ContactContext.Provider>
    );
}

export default App;