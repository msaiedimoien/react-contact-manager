import {useState} from 'react';
import './App.css';
import Navbar from "./components/Navbar";
import Contacts from "./components/contact/Contacts";

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
