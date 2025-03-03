import axios from "axios";

const API_URL = "http://localhost:8080/contacts";

export async function saveContact(contact) {
  return await axios.post(API_URL, contact);
}

export async function getContacts() {
  return await axios.get(API_URL);
}

export async function getContactById(id) {
  return await axios.get(`${API_URL}/${id}`);
}

export async function updateContactById(id, contact) {
  return await axios.put(`${API_URL}/${id}`, contact);
}

export async function uploadPhoto(formData) {
  return await axios.put(`${API_URL}/photo`, formData);
}

export async function deleteContactById(id) {
  return await axios.delete(`${API_URL}/${id}`);
}
