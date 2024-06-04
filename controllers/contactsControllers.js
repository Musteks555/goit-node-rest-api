import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
    const userId = req.user.id;

    contactsService
        .listContacts(userId)
        .then((contacts) => res.status(200).json(contacts))
        .catch((err) => res.status(500).json({ message: err.message }));
};

export const getOneContact = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    contactsService
        .getContactById(id, userId)
        .then((contact) => {
            if (contact) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch((err) => res.status(500).json({ message: err.message }));
};

export const deleteContact = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    contactsService
        .removeContact(id, userId)
        .then((contact) => {
            if (contact) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch((err) => res.status(500).json({ message: err.message }));
};

export const createContact = (req, res) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: req.body.favorite,
    };

    const { error, value } = createContactSchema.validate(contact, { abortEarly: false });

    if (typeof error !== "undefined") {
        return res.status(400).json({ message: error.message });
    }

    contactsService
        .addContact({
            name: value.name,
            email: value.email,
            phone: value.phone,
            favorite: value.favorite,
            owner: req.user.id,
        })
        .then((contact) => res.status(201).json(contact))
        .catch((err) => res.status(500).json({ message: err.message }));
};

export const updateContact = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!Object.keys(req.body).length) {
        return res.status(404).json({ message: "Body must have at least one field" });
    }

    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    };

    const { error, value } = updateContactSchema.validate(contact, { abortEarly: false });

    if (typeof error !== "undefined") {
        return res.status(400).json({ message: error.message });
    }

    const updatedContact = {};

    for (let key in value) {
        if (contact[key] !== undefined) {
            updatedContact[key] = contact[key];
        }
    }

    contactsService
        .updateContact(id, userId, updatedContact)
        .then((contact) => {
            if (contact) {
                res.status(201).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch((err) => res.status(500).json({ message: err.message }));
};

export const updateStatusContact = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!Object.keys(req.body).length) {
        return res.status(404).json({ message: "Body must have at least one field" });
    }

    const contact = {
        favorite: req.body.favorite,
    };

    const { error, value } = updateContactSchema.validate(contact, { abortEarly: false });

    if (typeof error !== "undefined") {
        return res.status(400).json({ message: error.message });
    }

    const updatedContact = {};

    for (let key in value) {
        if (contact[key] !== undefined) {
            updatedContact[key] = contact[key];
        }
    }

    contactsService
        .updateContact(id, userId, updatedContact)
        .then((contact) => {
            if (contact) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch((err) => res.status(500).json({ message: err.message }));
};
