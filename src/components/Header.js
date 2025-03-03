import React, { useState, useEffect } from "react";

const Header = ({ toggleModal, data }) => {
  const [nbOfContacts, setNbOfContacts] = useState(0);
  useEffect(() => {
    if (data?.contacts) {
      setNbOfContacts(data.contacts.length);
    }
  }, [data]);
  return (
    <header className="header">
      <div className="container">
        <h3>Contact List ({nbOfContacts})</h3>
        <button onClick={() => toggleModal(true)} className="btn">
          <i className="bi bi-plus-square"></i>Add New Contact
        </button>
      </div>
    </header>
  );
};

export default Header;
