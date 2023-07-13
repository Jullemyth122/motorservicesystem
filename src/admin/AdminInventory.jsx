import React, { useEffect, useRef, useState } from 'react'
import { useAccount } from '../context/AccountContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useInventory } from '../context/InventoryContext';
import { useBrands } from '../context/BrandsContext';

const InventoryForm = () => {

    const { addInventory } = useInventory()
    const { brandsList } = useBrands()
    const { generateRandomString } = useAccount()
    const [price,setPrice] = useState("")
    const [itemName,setItemName] = useState("")
    const [quantity,setQuantity] = useState("")
    const [brandValue,setBrandValue] = useState("ALL")

    const [fileByte, setFileByte] = useState(null)

    const fileInput = useRef(null)
    
    const handleFiles = e => {
        fileInput.current.click()
    }

    const handleAdditionalUpload = e => {
      console.log(fileByte)
      const tempArr = [];
      [...e.target.files].forEach(file => {
          tempArr.push({
              data: file,
              url: URL.createObjectURL(file),
              dataType:file.name.split('.')[1],
              name:file.name
          })
      })
      setFileByte(...tempArr)
    }

    const handleAddBrands = () => {
        if (fileByte != null) {
            const uploadFile = () => {
                const allStorageRef = ref(storage,`all-inventory/${generateRandomString(30)}`)
                let uploadUserStorageTask = uploadBytesResumable(allStorageRef,fileByte?.data)
                uploadUserStorageTask.on("state_changed",(snap) => {
                    switch(snap.state) {
                    case "paused":
                        break;
                    case "running":
                        break;
                    default:
                        break;
                    }
                },(err) => {
                    console.log(err)
                },() => {
                    getDownloadURL(uploadUserStorageTask.snapshot.ref)
                    .then(async(downloadURL) => {
                        addInventory(itemName,downloadURL,price,quantity,brandValue)
                    })
                })
            }
            uploadFile()
        }
        setFileByte(null)
    }

    return (
        <div className="brand_container">
            <div className="brand_whole_form">
                <div className="brand-form">
                    <div className="brand-input">
                      <input 
                          type="number" 
                          className="input-text" 
                          id="price" 
                          placeholder="Enter Price" 
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="brand-input">
                      <input 
                          type="text" 
                          className="input-text" 
                          id="itemName" 
                          placeholder="Enter Item Name" 
                          value={itemName}
                          onChange={e => setItemName(e.target.value)}
                      />
                    </div>
                    <div className="brand-input">
                      <div className="icons">
                        <div className="post__pictures">
                          <div className="post_pic"
                            ref={fileInput}
                            onClick={handleFiles}
                            onChange={handleAdditionalUpload}
                          >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 18C1.45 18 0.979002 17.804 0.587002 17.412C0.195002 17.02 -0.000664969 16.5493 1.69779e-06 16V2C1.69779e-06 1.45 0.196002 0.979002 0.588002 0.587002C0.980002 0.195002 1.45067 -0.000664969 2 1.69779e-06H16C16.55 1.69779e-06 17.021 0.196002 17.413 0.588002C17.805 0.980002 18.0007 1.45067 18 2V16C18 16.55 17.804 17.021 17.412 17.413C17.02 17.805 16.5493 18.0007 16 18H2ZM4 14H14C14.2 14 14.35 13.9083 14.45 13.725C14.55 13.5417 14.5333 13.3667 14.4 13.2L11.65 9.525C11.55 9.39167 11.4167 9.325 11.25 9.325C11.0833 9.325 10.95 9.39167 10.85 9.525L8.25 13L6.4 10.525C6.3 10.3917 6.16667 10.325 6 10.325C5.83334 10.325 5.7 10.3917 5.6 10.525L3.6 13.2C3.46667 13.3667 3.45 13.5417 3.55 13.725C3.65 13.9083 3.8 14 4 14Z" fill="black"/>
                            </svg>
                            <div className="text_inside">
                              <p>
                                  {fileByte != null ? fileByte?.data.name : 'IMAGE'}
                              </p>
                            </div>
                          </div>
                          <input 
                            type="file" 
                            multiple={false} 
                            ref={fileInput}
                            onChange={handleAdditionalUpload}
                            accept="image/*"
                            style={{display:"none"}}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="brand-input">
                      <input 
                        type="number" 
                        className="input-text" 
                        id="itemName" 
                        placeholder="Enter Quantity" 
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="brand-input">
                      <select name="brand" value={brandValue} onChange={e => setBrandValue(e.target.value)}>
                        <option value="ALL">
                            All Brand
                        </option>
                        {brandsList.map((brand, idx) => (
                        <option key={idx} value={brand.brandname}>
                            {brand?.brandname}
                        </option>
                        ))}
                      </select>
                    </div>
                </div>
                <div className="button_form d-flex align-items-center justify-content-end">
                    <button onClick={handleAddBrands} >Add + </button>
                </div>
            </div>
        </div>
    );
};

const AdminInventory = () => {
  
  const [inventoryName,setInventoryName] = useState("")
  const [price,setPrice] = useState("")
  const { inventoriesList,deleteInventory,setEditItemInventoryId,editItemInventoryId,updatedInventory } = useInventory()
  
  const handleChangeBrands = (elem) => {
      setEditItemInventoryId(elem.id)
      setInventoryName(elem.inventoryname)
      setPrice(elem.price)
  }
  
  const handleIncrementQuantity = (elem) => {
    const updatedQuantity = parseInt(elem.quantity) + 1; // Increment quantity by 1
    updatedInventory(elem.id, elem.inventoryname, elem.price, updatedQuantity);
  };
  
  const handleDecrementQuantity = (elem) => {
    if (parseInt(elem.quantity) > 0) {
      const updatedQuantity = parseInt(elem.quantity) - 1; // Decrement quantity by 1 if it's greater than 0
      updatedInventory(elem.id, elem.inventoryname, elem.price, updatedQuantity);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const items = inventoriesList.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentItems(items);

    const totalItems = inventoriesList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    setPageNumbers(numbers);
  }, [currentPage, itemsPerPage, inventoriesList]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='inventory-component'>
      <div className="row">
          <InventoryForm/>
      </div>
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

      <div className="showListBrands">
        <div className="show_grid_list_brands">
          {currentItems?.map((elem,i) => {
            return (
              <div className="items-new" key={i}>
                {editItemInventoryId == elem.id ? <> 
                  <input
                    type="text"
                    value={inventoryName}
                    onChange={(e) =>
                        setInventoryName(e.target.value)
                    }
                    autoFocus
                  />
                  <img src={elem.image} alt="" />
                  <div className="inventory_info">
                    <input
                        type="text"
                        className='col-md-6 p-1'
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value)
                        }
                        autoFocus
                        
                    />
                    <div className="quantity_rate">
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M19 12.998H5V10.998H19V12.998Z" fill="black"/>
                      </svg>
                      <h6>{elem.quantity}</h6>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z" fill="black"/>
                      </svg>
                    </div>
                  </div>
                  </> : <>
                    <h6>{elem.inventoryname}</h6>
                    <img src={elem.image} alt="" />
                    <div className="inventory_info">
                      <h6 className='price'>PHP {elem.price}</h6>
                      <div className="quantity_rate">
                        <svg 
                          className='subtract' 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={e => handleDecrementQuantity(elem)} // Call handleDecrementQuantity on click  
                        >
                          <path d="M19 12.998H5V10.998H19V12.998Z" fill="#fff"/>
                        </svg>
                        <h6>{parseInt(elem.quantity)}</h6>
                        <svg 
                          className='add' 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={e => handleIncrementQuantity(elem)} // Call handleDecrementQuantity on click

                        >
                          <path d="M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z" fill="#fff"/>
                        </svg>
                      </div>
                    </div>
                </>}
                <div className="button-brand d-flex align-items-center justify-content-center">
                  {editItemInventoryId == elem.id ? <>
                      <button onClick={() => updatedInventory(elem.id,inventoryName,price,elem.quantity)}>
                          Save Edit
                      </button>
                  </> : <>
                      <button onClick={() => handleChangeBrands(elem)}>
                          Edit
                      </button>
                  </>}
                  <button onClick={() => deleteInventory(elem)}>
                      Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminInventory