import Contact from "../models/contact.js";

async function listContacts(userId) {
    const data = await Contact.find({ owner: userId });

    return data;
}

async function getContactById(contactId, userId) {
    try {
        const contact = await Contact.findOne({ _id: contactId, owner: userId });

        if (!contact) {
            return null;
        }

        return contact;
    } catch (error) {
        return null;
    }
}

async function removeContact(contactId, userId) {
    try {
        const removedContact = await Contact.findOneAndDelete({ _id: contactId, owner: userId });

        if (!removedContact) {
            return null;
        }

        return removedContact;
    } catch (error) {
        return null;
    }
}

async function addContact({ name, email, phone, favorite, owner }) {
    const newContact = await Contact.create({ name, email, phone, favorite, owner });

    return newContact;
}

async function updateContact(contactId, userId, contact) {
    try {
        const updatedContact = await Contact.findOneAndUpdate({ _id: contactId, owner: userId }, contact, { new: true });

        return updatedContact;
    } catch (error) {
        return null;
    }
}

async function updateStatusContact(contactId, body) {
    try {
        const updatedContact = await Contact.findOneAndUpdate(contactId, body, { new: true });

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
