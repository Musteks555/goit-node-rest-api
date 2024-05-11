import * as fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });

    return JSON.parse(data);
}

async function getContactById(contactId) {
    const contacts = await listContacts();

    const contact = contacts.find((contact) => contact.id === contactId);

    if (!contact) {
        return null;
    }

    return contact;
}

async function removeContact(contactId) {
    const contacts = await listContacts();

    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index === -1) {
        return null;
    }

    const removedContact = contacts[index];

    contacts.splice(index, 1);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));

    return removedContact;
}

async function addContact({ name, email, phone }) {
    const contacts = await listContacts();

    const newContact = { name, email, phone, id: nanoid() };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));

    return newContact;
}

async function updateContact(contactId, contact) {
    const contacts = await listContacts();
    const oldContact = await getContactById(contactId);

    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index === -1) {
        return null;
    }

    const updatedContact = { ...oldContact, ...contact };

    contacts[index] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));

    return updatedContact;
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
