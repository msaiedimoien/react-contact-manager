import React, {useState, useEffect} from 'react';
import './App.css';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import {AddContact, EditContact, Contacts, Navbar, ViewContact} from "./components";
import {createContact, getAllContacts, getAllGroups} from './services/contactService';

const App = () => {

    const [loading, setLoading] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [contact, setContact] = useState({
        fullname: "",
        photo: "",
        mobile: "",
        email: "",
        job: "",
        group: ""
    });
    const navigate = useNavigate();

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
    }, []);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                setLoading(true);

                const {data: contactsData} = await getAllContacts();
                setContacts(contactsData);
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

            if(status === 201){
                setContact({});
                setForceRender(!forceRender);
                navigate("/contacts");
            }
        }catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className="App">
            <Navbar/>
            <Routes>
                <Route path='/' element={<Navigate to='/contacts'/>}/>
                <Route
                    path='/contacts'
                    element={<Contacts contacts={contacts} loading={loading}/>}
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
                <Route path='/contacts/edit/:contactId' element={<EditContact/>}/>
            </Routes>
        </div>
    );
}

export default App;