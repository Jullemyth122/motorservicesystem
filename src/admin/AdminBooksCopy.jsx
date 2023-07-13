import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { useInventory } from '../context/InventoryContext';
import FilterBooks from './books/FilteredBooks';

const AdminHeader = () => {


  return (
    <div className="books_container">
      <div className="books-header d-flex align-items-center justify-content-center gap-3">
        <div className="books-t_head">
          <h4> Name </h4>
        </div>
        <div className="books-t_head">
          <h4> Date </h4>
        </div>
        <div className="books-t_head">
          <h4> BOOK INFO. </h4>
        </div>
        <div className="books-t_head">
          <h4> Phone No. </h4>
        </div> 
        <div className="books-t_head">
          <h4> Deletion </h4>
        </div> 
        <div className="books-t_head">
          <h4> Book Approval </h4>
        </div> 
      </div>
    </div>
  )
}

const AdminBooks = () => {

  const { booksList, deleteBook,updatedBook } = useCustomer();
  const { increaseInventoryQuantity } = useInventory()
  const [filters, setFilters] = useState({});


  const handleDelete = (book) => {
    increaseInventoryQuantity(book.orders)
    deleteBook(book);
  }
  
  const handleAddDone = (book) => {
    updatedBook(book.id,'success')
  }
  
  const handleFilterChange = (filterName, filterValue) => {
    setFilters(prevFilters => ({ ...prevFilters, [filterName]: filterValue }));
  }

  const filteredBooks = booksList.filter(book => {
    for (let filterName in filters) {
      if (book[filterName].toLowerCase().includes(filters[filterName].toLowerCase()) === false) {
        return false;
      }
    }
    return true;
  })


  return (
    <div className='books-component'>
      <h1>
        Booking Reports
      </h1>
      <FilterBooks onFilterChange={handleFilterChange} />
      <AdminHeader/>
      <div className="showListBooks"> 
        <div className="pagination">
          
        </div>
        <div className="show_grid_list_books">
          {filteredBooks.filter((el) => el.pending != 'success').sort((a, b) => new Date(a.date) - new Date(b.date)).map((book, index) => (
            <div key={index} className="booksItem">
              <div className="email_label labels">
                <h4>{book.name}</h4>
              </div>
              <div className="order_label labels">
                <h4>{book.date} </h4>
              </div>
              <ul className="items_label labels">
                {book.orders.map((order, idx) => (
                  <li key={idx}>
                    <img src={order.image} alt={order.itemname} />
                    <div className="items_grid">
                      <p>Item: {order.itemname}</p>
                      <p>Price: {order.price}</p>
                      <p>Quantity: {order.qty}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="status_label labels">
                <p>{book.phoneno}</p>
              </div>
              <div className="labels">
                <button onClick={() => handleDelete(book)}>Delete</button>
              </div>
              <div className="labels">
                <button onClick={() => handleAddDone(book)}>Done</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminBooks;
