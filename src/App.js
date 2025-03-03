import { useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteContactById,
  getContacts,
  saveContact,
  updateContactById,
  uploadPhoto,
} from "./api/ContactService";
import Header from "./components/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import ContactList from "./components/ContactList";
import ContactDetail from "./components/ContactDetail";
import { toastError } from "./api/ToastService";
import { ToastContainer } from "react-toastify";

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [modalReady, setModalReady] = useState(false);
  const [data, setData] = useState({});
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: "",
    email: "",
    title: "",
    phone: "",
    address: "",
    status: "",
  });

  const getAllContacts = async () => {
    try {
      const { data } = await getContacts();
      setData(data);
      console.log("contact data list length " + data.contacts.length);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const toggleModal = (show) => {
    if (modalReady && modalRef.current) {
      show ? modalRef.current.showModal() : modalRef.current.close();
    }
  };

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleNewContact = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveContact(values);
      console.log(data);
      const contactData = data.contacts[0];
      console.log(contactData.id);
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", data.contacts[0].id);
      const { contactData: photoUrl } = await uploadPhoto(formData);
      console.log(photoUrl);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: "",
        email: "",
        title: "",
        phone: "",
        address: "",
        status: "",
      });
      getAllContacts();
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateContact = async (contact) => {
    try {
      const { data } = await updateContactById(contact.id, contact);
      console.log(data);
      const contactData = data.contacts[0];
      console.log(contactData.id);
      getAllContacts();
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateImage = async (formData) => {
    try {
      const { data: photoUrl } = await uploadPhoto(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await deleteContactById(id);
      getAllContacts();
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  useEffect(() => {
    getAllContacts();
    setModalReady(true);
  }, []);

  // useEffect(() => {
  //   console.log(values);
  // }, [values]);

  return (
    <>
      <Header toggleModal={toggleModal} data={data} />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route path="/contacts" element={<ContactList data={data} />} />
            <Route
              path="/contacts/:id"
              element={
                <ContactDetail
                  updateContact={updateContact}
                  updateImage={updateImage}
                  deleteContact={deleteContact}
                />
              }
            />
          </Routes>
        </div>
      </main>
      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="text"
                  name="email"
                  value={values.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  name="phone"
                  value={values.phone}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input
                  type="text"
                  name="status"
                  value={values.status}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  name="photo"
                  onChange={(event) => {
                    setFile(event.target.files[0]);
                    console.log(event.target.files[0]);
                  }}
                  ref={fileRef}
                  required
                />
              </div>
            </div>
            <div className="form_footer">
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
