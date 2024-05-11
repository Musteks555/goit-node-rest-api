import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
    contactsService
        .listContacts()
        .then((contacts) => res.status(200).json(contacts))
        .catch((err) => res.status(500).json({ message: err.message }));
};

export const getOneContact = (req, res) => {
    const { id } = req.params;

    contactsService
        .getContactById(id)
        .then((contact) => res.status(200).json(contact))
        .catch((err) => res.status(404).json({ message: "Not found" }));
};

export const deleteContact = (req, res) => {
    const { id } = req.params;

    contactsService
        .removeContact(id)
        .then((contact) => res.status(200).json(contact))
        .catch((err) => res.status(404).json({ message: "Not found" }));
};

export const createContact = (req, res) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    };

    const { error, value } = createContactSchema.validate(contact, { abortEarly: false });

    if (typeof error !== "undefined") {
        return res.status(400).send(error.details.map((error) => error.message).join(", "));
    }

    contactsService
        .addContact({
            name: value.name,
            email: value.email,
            phone: value.phone,
        })
        .then((contact) => res.status(201).json(contact))
        .catch((err) => res.status(400).json({ message: err.message }));
};

export const updateContact = (req, res) => {
    const { id } = req.params;

    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    };

    const { error, value } = updateContactSchema.validate(contact, { abortEarly: false });

    if (typeof error !== "undefined") {
        return res.status(400).send(error.details.map((error) => error.message).join(", "));
    }

    const updatedContact = {};

    for (let key in value) {
        if (contact[key] !== undefined) {
            updatedContact[key] = contact[key];
        }
    }

    contactsService
        .updateContact(id, updatedContact)
        .then((contact) => res.status(201).json(contact))
        .catch((err) => res.status(404).json({ message: "Not found" }));
};
