import React, { useState, useEffect } from "react";
import Contact from "./Contact";

const ContactList = ({ data }) => {
  const ITEMS_PER_PAGE = 4;
  console.log(data);
  const [currentPage, setCurrentPage] = useState(0);
  const [contacts, setContacts] = useState([]);

  // Watch for data changes and update contacts when available
  useEffect(() => {
    if (data?.contacts) {
      setContacts(data.contacts);
    }
  }, [data]); // Runs whenever data changes

  const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedContacts = contacts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <main className="main">
        {contacts.length === 0 && <div>No Contacts</div>}

        <ul className="contact__list">
          {paginatedContacts.length > 0 &&
            paginatedContacts.map((contact) => (
              <Contact contact={contact} key={contact.id} />
            ))}
        </ul>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <a
              className={0 === currentPage ? "disabled" : ""}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &laquo;
            </a>
            {/* <span>
              Page {currentPage} of {totalPages}
            </span> */}
            {data &&
              [...Array(totalPages).keys()].map((page, index) => (
                <a
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "active" : ""}
                  key={page}
                >
                  {page + 1}
                </a>
              ))}
            <a
              className={totalPages === currentPage + 1 ? "disabled" : ""}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              &raquo;
            </a>
          </div>
        )}
      </main>
    </>
  );
};

export default ContactList;
