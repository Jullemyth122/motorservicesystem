import React from 'react';

const FilterBooks = ({ onFilterChange }) => {
    const handleFilterChange = (e) => {
        onFilterChange(e.target.name, e.target.value)
    }

    return (
        <div className="filter-container">
            <div className="form-group">
                <label htmlFor=""> Name </label>
                <input 
                    className='form-control'
                    type="text" name="name" onChange={handleFilterChange} />
            </div>
            <div className="form-group">
                <label htmlFor=""> Date Books </label>
                <input 
                    className='form-control'
                    type="date" name="date" onChange={handleFilterChange} />
            </div>
            <div className="form-group">
                <label htmlFor=""> Phone No. </label>
                <input 
                    className='form-control'
                    type="text" name="phoneno" onChange={handleFilterChange} />
            </div>
            <div className="form-group">
                <label htmlFor=""> Book Status </label>
                <div className="form-control">
                    <select name="status" id="" onChange={handleFilterChange}>
                        <option value="pending"> Pending </option>
                        <option value="success"> Approved </option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default FilterBooks;
