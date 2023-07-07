const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { error } = require("node:console");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try{
  const date = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(date);
  } catch(e){
    console.error("Couldn't read file", e);
  }
}

async function writeFile(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
  } catch(e) {
    console.error(e);
  }
}

async function getContactById(id) {
  try{
    const contacts = await listContacts();
    const contact = contacts.find(contact => contact.id === id) || null;
    return contact;
  } catch(e){
    console.error("Couldn't find id", e);
}
}

async function addContact(contact) {
  try{
    const contacts = await listContacts();
    contacts.push({ ...contact, id: crypto.randomUUID() });
    await writeFile(contacts);
    return contact;
  } catch(e) {
    console.error("No contact added", e);
  }
}

async function updateContact(id, contact) {
  try{
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    const newContact = [...contacts.splise(0, index), { ...contact, id}, ...contacts.splise(index + 1)];
    await writeFile(newContact);
    return {...contact, id};
  } catch(e) {
     console.error(e);
  }
}

async function removeContact(id) {
  try{
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);

    if (index === -1) {
      return null;
    }
    
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return result;
  } catch(e) {
    console.error("Cannot be deleted", e);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};