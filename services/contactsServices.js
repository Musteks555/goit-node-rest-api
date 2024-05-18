import Contact from "../models/contact.js";

async function listContacts() {
    const data = await Contact.find();

    return data;
}

async function getContactById(contactId) {
    try {
        const contact = await Contact.findById(contactId);

        if (!contact) {
            return null;
        }

        return contact;
    } catch (error) {
        return null;
    }
}

async function removeContact(contactId) {
    try {
        const removedContact = await Contact.findByIdAndDelete(contactId);

        if (!removedContact) {
            return null;
        }

        return removedContact;
    } catch (error) {
        return null;
    }
}

async function addContact({ name, email, phone, favorite }) {
    const newContact = await Contact.create({ name, email, phone, favorite });

    return newContact;
}

async function updateContact(contactId, contact) {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, contact, { new: true });

        return updatedContact;
    } catch (error) {
        return null;
    }
}

async function updateStatusContact(contactId, body) {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(contactId, body, { new: true });

        return updatedContact;
    } catch (error) {
        return null;
    }
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
};
