import {createContext} from "react";

export const ContactContext = createContext({
    loading: false,
    setLoading: () => {},
    contact: {},
    setContact: () => {},
    contacts: [],
    setContacts: () => {},
    filteredContacts: [],
    setFilteredContacts: () => {},
    contactQuery: {},
    groups: [],
    onContactChange: () => {},
    deleteContact: () => {},
    updateContact: () => {},
    createContact: () => {},
    contactSearch: () => {},
});