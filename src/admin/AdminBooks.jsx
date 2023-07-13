import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { useInventory } from '../context/InventoryContext';
import FilterBooks from './books/FilteredBooks';
import { useEffect } from 'react';

const AdminBooks = () => {

  const { booksList, deleteBook,updatedBook } = useCustomer();
  const { increaseInventoryQuantity } = useInventory()
  const [filters, setFilters] = useState({status:'pending'});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [openSMS,setOpenSMS] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [item,setItem] = useState({});

  const paginate = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > pageNumbers.length) pageNumber = pageNumbers.length;
    setCurrentPage(pageNumber);
  };

  const handleSendEmail = (email, subject, text) => {
    fetch('https://polyester-super-panda.glitch.me/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,  // The email address to send to
        subject: subject,  // The email subject
        text: text,  // The email body
      }),
    })
    .then(response => console.log(response.json()))
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  const handleDelete = (book) => {
    increaseInventoryQuantity(book.orders)
    deleteBook(book);
    const email = book.id.split('-')[0];  // Extract email from the book id
    // Send an email to the customer that their order has been declined
    handleSendEmail(
      email,  // The customer's email address
      'Your Order Has Been Declined',  // The subject of the email
      `We're sorry, but your book order made on ${book.date} has been declined.`  // The body of the email
    );
  }
  
  const handleAddDone = (book) => {
    setItem(book)
    updatedBook(book.id,'success')
    setOpenSMS(!openSMS)
    const email = book.id.split('-')[0];  // Extract email from the book id

    // Send an email to the customer that their order has been approved
    handleSendEmail(
      email,  // The customer's email address
      'Your Order Has Been Approved',  // The subject of the email
      `Congratulations! Your book order made on ${book.date} has been approved.`  // The body of the email
    );
  }
  
  
  const handleFilterChange = (filterName, filterValue) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: filterValue }));
  }

  useEffect(() => {
    const filteredBooksList = booksList.filter(book => {
      for (let filterName in filters) {
        if (book[filterName].toLowerCase().includes(filters[filterName].toLowerCase()) === false) {
          return false;
        }
      }
      return true;
    });

    const sortedBooksList = filteredBooksList.sort((a, b) => {
      if(a.createdAt && b.createdAt) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (a.createdAt) {
        return -1;
      } else if (b.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });

    setListItems(sortedBooksList);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const items = sortedBooksList.slice(indexOfFirstItem, indexOfLastItem);
    
    setCurrentItems(items);

    const totalItems = sortedBooksList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    setPageNumbers(numbers);
  }, [currentPage, itemsPerPage, booksList, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  const handleSMSNotif = () => {
    setOpenSMS(!openSMS)
  }

  return (
    <div className='books-component'>
      <h1>
        Booking Management Report
      </h1>
      {openSMS && 
        <div className="openSMS">
          <div className="sms_component">
            <h1>
              This will send to {item.emailAcc} of the book 
            </h1>
            <button className="btn btn-success" onClick={handleSMSNotif}>
              Send to Email 
            </button>
          </div>
        </div>
      }
      <div className="filter-containers">
        <FilterBooks onFilterChange={handleFilterChange} />
        <div className="books-orders">
          <h4>
            Book Orders in {filters?.date ? filters?.date : "Date"}
          </h4>
          {filters?.date ? <>
          <p>
           {listItems.length} orders
          </p>
          </> : ''}
        </div>
      </div>
      <div className='show-nav'>
        <section>
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => paginate(currentPage - 1)}>Prev</button>
            )}
            {pageNumbers.map((pageNumber, index) => {
              if (
                (currentPage <= 3 && index < 3) ||
                (currentPage > 3 && index >= currentPage - 2 && index <= currentPage)
              ) {
                return (
                    <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={pageNumber === currentPage ? 'active' : ''}
                    >
                        {pageNumber}
                    </button>
                );
              } else {
                return null;
              }
            })}

            {currentPage < pageNumbers.length && (
              <button onClick={() => paginate(currentPage + 1)}>Next</button>
            )}
          </div>
        </section>
      </div>
      <table className="table table-responsive table-dark table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Date Books</th>
                <th scope="col">Book Orders/Info</th>
                <th scope="col">Phone No.</th>
                <th scope="col">Book Approval </th>
            </tr>
        </thead>
        <tbody>
          {currentItems.map((book,idx) => {
              return (
                <tr key={book.id}>
                  <td>{book.name}</td>
                  <td>{book.date}</td>
                  <td>
                    <div className="order-container">
                      {book.orders.map((order, idx) => (
                        <div className="order" key={idx}>
                          <img src={order.image} alt={order.itemname} />
                          <div className="items_grid">
                            <p>Item: {order.itemname}</p>
                            <p>Price: {order.price}</p>
                            <p>Quantity: {order.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                      <p>
                        {book.phoneno}
                      </p>
                  </td>
                  <td>
                    <div className="button_labels">
                      {book.status === 'success' ?
                      <>
                        <div className="labels">
                          <button className='approved'>
                            Approved
                          </button>
                        </div>
                      </>
                      : <>
                        <div className="labels">
                          <button className='btn btn-success' onClick={() => handleAddDone(book)}> Approve </button>
                        </div>
                        <div className="labels">
                          <button className='btn btn-danger' onClick={() => handleDelete(book)}> Decline </button>
                        </div>
                      </>}
                    </div>
                  </td>
                </tr>
              )
          })}
        </tbody>
      </table>
      <div className='show-nav'>
        <section>
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => paginate(currentPage - 1)}>Prev</button>
            )}
            {pageNumbers.map((pageNumber, index) => {
              if (
                (currentPage <= 3 && index < 3) ||
                (currentPage > 3 && index >= currentPage - 2 && index <= currentPage)
              ) {
                return (
                    <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={pageNumber === currentPage ? 'active' : ''}
                    >
                        {pageNumber}
                    </button>
                );
              } else {
                return null;
              }
            })}

            {currentPage < pageNumbers.length && (
              <button onClick={() => paginate(currentPage + 1)}>Next</button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminBooks;
