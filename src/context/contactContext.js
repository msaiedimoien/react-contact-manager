import {createContext} from "react";

export const ContactContext = createContext({
    loading: false,
    setLoading: () => {},
    contact: {},
    contactQuery: {},
    contacts: [],
    setContacts: () => {},
    filteredContacts: [],
    setFilteredContacts: () => {},
    groups: [],
    onContactChange: () => {},
    deleteContact: () => {},
    createContact: () => {},
    contactSearch: () => {},
});