import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getContactById } from "../api/ContactService";
import { toastError, toastSuccess } from "../api/ToastService";

const ContactDetail = ({ updateContact, updateImage, deleteContact }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const inputRef = useRef();
  const [contact, setContact] = useState({
    id: "",
    name: "",
    email: "",
    title: "",
    phone: "",
    address: "",
    status: "",
    photoUrl: "",
  });
  const { id } = useParams();
  console.log("contact id :" + id);

  const handleDelete = () => {
    setIsDeleted(true);
    //setTimeout(() => setIsDeleted(false), 3000); // Hide message after 3 seconds
    deleteContact(id);
    toastSuccess("Contact Deleted");
  };

  const getContact = async (id) => {
    try {
      const { data } = await getContactById(id);
      console.log(data);
      const contactData = data.contacts[0];
      console.log(contactData.id);
      setContact(contactData);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const selectImage = () => {
    inputRef.current.click();
  };

  const onChange = (event) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };

  const onUpdateContact = async (event) => {
    event.preventDefault();
    await updateContact(contact);
    toastSuccess("Contact Updated");
    getContact(id);
  };

  const updatePhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", id);
      await updateImage(formData);

      setContact((prev) => ({
        ...prev,
        photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`,
      }));
      setTimeout(() => getContact(id), 500);
      toastSuccess("Photo Updated");
      console.log(contact.photoUrl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContact(id);
  }, []);
  useEffect(() => {
    console.log(contact);
  }, [contact]);

  return (
    <>
      <Link to={"/contacts"} className="link">
        <i className="bi bi-arrow-left"></i>Back To List
      </Link>
      <div className="profile">
        <div className="profile__details">
          <img
            src={contact.photoUrl}
            alt={`Profile photo of ${contact.name}`}
          />
          <div className="profile__metadata">
            <p className="profile__name">{contact.name}</p>
            <p className="profile__muted">JPG, GIF OR PNG, MAX SIZE 10MB</p>
            <button className="btn" onClick={selectImage}>
              <i className="bi bi-cloud-upload"></i>Change Photo
            </button>
          </div>
        </div>
        <div className="profile__settings">
          <div>
            <form onSubmit={onUpdateContact} className="form">
              <div className="user-details">
                <input
                  type="hidden"
                  defaultValue={contact.id}
                  name="id"
                  required
                />
                <div className="input-box">
                  <span className="details">Name</span>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={onChange}
                    name="name"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Email</span>
                  <input
                    type="text"
                    value={contact.email}
                    onChange={onChange}
                    name="email"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Phone</span>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={onChange}
                    name="phone"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Address</span>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={onChange}
                    name="address"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Title</span>
                  <input
                    type="text"
                    value={contact.title}
                    onChange={onChange}
                    name="title"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Status</span>
                  <input
                    type="text"
                    value={contact.status}
                    onChange={onChange}
                    name="status"
                    required
                  />
                </div>
              </div>
              {!isDeleted ? (
                <div className="form_footer">
                  <button type="submit" className="btn">
                    Save Contact
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: "10px" }}
                    onClick={handleDelete}
                  >
                    Delete Contact
                  </button>
                </div>
              ) : (
                <p className="success-message">✅ Delete Successful!</p>
              )}
            </form>
          </div>
        </div>
      </div>
      <form style={{ display: "none" }}>
        <input
          type="file"
          ref={inputRef}
          onChange={(event) => updatePhoto(event.target.files[0])}
          name="file"
          accept="image/*"
        />
      </form>
    </>
  );
};

export default ContactDetail;
