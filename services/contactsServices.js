import Contact from "../models/contact.js";

async function listContacts() {
    const data = await Contact.find();

    return data;
}

async function getContactById(contactId) {
    const contact = await Contact.findById(contactId);

    if (!contact) {
        return null;
    }

    return contact;
}

async function removeContact(contactId) {
    const removedContact = await Contact.findByIdAndDelete(contactId);

    if (!removedContact) {
        return null;
    }

    return removedContact;
}

async function addContact({ name, email, phone, favorite }) {
    const newContact = await Contact.create({ name, email, phone, favorite });

    return newContact;
}

async function updateContact(contactId, contact) {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, contact, { new: true });

    return updatedContact;
}

async function updateStatusContact(contactId, body) {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, { new: true });

    return updatedContact;
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
};
