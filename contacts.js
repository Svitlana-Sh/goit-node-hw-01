const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  const date = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(date);
}

async function writeFile(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
}

async function getContactById(id) {
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === id) || null;
    return contact;
}

async function addContact(contact) {
    const contacts = await listContacts();
    contacts.push({ ...contact, id: crypto.randomUUID() });
    await writeFile(contacts);
    return contact;
}

async function updateContact(id, contact) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    const newContact = [...contacts.splise(0, index), { ...contact, id}, ...contacts.splise(index + 1)];
    await writeFile(newContact);
    return {...contact, id};
}

async function removeContact(id) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);

    if (index === -1) {
      return null;
    }
    
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return result;
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};