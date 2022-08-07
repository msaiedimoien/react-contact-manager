import './App.css';
import Navbar from "./components/Navbar";
import Contacts from "./components/contact/Contacts";

const App = () => {
    return (
        <div className="App">
            <Navbar/>
            <Contacts/>
        </div>
    );
}

export default App;
