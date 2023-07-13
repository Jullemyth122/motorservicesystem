import React, { useEffect, useRef, useState } from 'react'
import { useServices } from '../context/ServicesContext';
import { useAccount } from '../context/AccountContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useBrands } from '../context/BrandsContext';

const ServiceForm = () => {

    const { addServices } = useServices()
    const { generateRandomString } = useAccount()
    const { brandsList } = useBrands()
    const [serviceName,setServiceName] = useState("")
    const [price,setPrice] = useState("")
    const [mileage,setMileage] = useState("below")
    const [brandname,setBrandName] = useState()
    const [fileByte, setFileByte] = useState(null)

    const fileInput = useRef(null)
    
    const handleFiles = e => {
        fileInput.current.click()
    }

    const handleAdditionalUpload = e => {
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

    const handleAddServices = () => {
        if (fileByte != null) {
            const uploadFile = () => {
                const allStorageRef = ref(storage,`all-services/${generateRandomString(30)}`)
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
                        addServices(serviceName,price,downloadURL,mileage,brandname)
                    })
                })
            }
            uploadFile()
        }
        setFileByte(null)
    }

    return (
        <div className="service_container">
            <div className="service_whole_form">
                <div className="service-form">
                    <div className="service-input">
                        <input 
                            type="text" 
                            className="input-text" 
                            id="serviceName" 
                            placeholder="Enter Service" 
                            value={serviceName}
                            onChange={e => setServiceName(e.target.value)}
                        />
                    </div>
                    <div className="service-input">
                        <input 
                            type="number" 
                            className="input-text" 
                            id="price" 
                            placeholder="Enter Price" 
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="service-input">
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
                    <div className="service-input">
                        <select name="mileage" value={mileage} onChange={e => setMileage(e.target.value)}>
                            <option value="below">
                                Below 15000 
                            </option>
                            <option value="up">
                                Above 15000 
                            </option>
                        </select>
                    </div>
                    <div className="service-input">
                        <select name="mileage" value={brandname} onChange={e => setBrandName(e.target.value)}>
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
                    <button onClick={handleAddServices} >Add + </button>
                </div>
            </div>
        </div>
    );
};

const useDebounce = (value,delay) => {
    const [debouncedValue,setDebounceValue] = useState(value)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebounceValue(value)
        },delay)

        return () => {
            clearTimeout(timeoutId)
        }
    },[value,delay])

    return debouncedValue
}

const AdminServices = () => {
    
    const [servicename,setServiceName] = useState("")
    const [price,setPrice] = useState("")
    const { servicesList,deleteServices,setEditItemId,editItemId,updatedServices } = useServices()

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search,750)

    const [popOpen, setPopOpen] = useState(false);
    const [viewItem, setViewItem] = useState({});
    
    // A function to handle view button click
    const handleView = (item) => {
        setViewItem(item);
        setPopOpen(true);
    };
    
    // A function to handle closing the popOpen
    const closePopOpen = () => {
        setPopOpen(false);
    };

    const handleChangeServices = (elem) => {
        setEditItemId(elem.id)
        setServiceName(elem.servicename)
        setPrice(elem.price)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageNumbers, setPageNumbers] = useState([]);
  
    useEffect(() => {
        const filteredServices = servicesList.filter(service => 
            service.servicename.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const items = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(items);
    
        const totalItems = filteredServices.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const numbers = [];
        for (let i = 1; i <= totalPages; i++) {
            numbers.push(i);
        }
        setPageNumbers(numbers);
    }, [currentPage, itemsPerPage, servicesList, debouncedSearch]);
    
  
    const paginate = (pageNumber) => {
        if (pageNumber < 1) pageNumber = 1;
        if (pageNumber > pageNumbers.length) pageNumber = pageNumbers.length;
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);    


    return (
        <div className='services-component'>
            {popOpen && 
                <div className="popOpen">
                    <div className="popOpen-content">
                        <button className="close-btn" onClick={closePopOpen}>X</button>
                        <div className="receipt-header">
                            <h2> Service Item </h2>
                        </div>
                        <div className="receipt-content">
                            <div className="item">
                                <div className="item-image">
                                    <img src={viewItem.image} alt={viewItem.servicename} />
                                </div>
                                <div className="item-info">
                                    <p>Service Name: <span>{viewItem.servicename}</span></p>
                                    <p>Brand: <span>{viewItem.brand}</span></p>
                                    <p>Price: <span>PHP {viewItem.price}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="row">
                <ServiceForm/>
            </div>
            <div className="showListServices">
                <div className='show-nav'>
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Search Service Name"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
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
                            <th scope='col'> Service Name </th>
                            <th scope='col'> Price </th>
                            <th scope='col' className='text-center'> Image </th>
                            <th scope='col'> Brand </th>
                            <th>
                                <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.06412 26.7123H5.20901L18.423 12.5342L16.2781 10.2329L3.06412 24.411V26.7123ZM24.9726 10.1507L18.4613 3.24658L20.6062 0.945206C21.1935 0.315069 21.9151 0 22.771 0C23.6259 0 24.347 0.315069 24.9343 0.945206L27.0792 3.24658C27.6665 3.87671 27.9729 4.63726 27.9984 5.52822C28.0239 6.41808 27.7431 7.17808 27.1558 7.80822L24.9726 10.1507ZM22.7511 12.5753L6.51126 30H0V23.0137L16.2398 5.58904L22.7511 12.5753ZM17.3506 11.3836L16.2781 10.2329L18.423 12.5342L17.3506 11.3836Z" fill="white"/>
                                </svg>        
                            </th>
                            <th>
                                <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.6875 30C3.82812 30 3.09271 29.6739 2.48125 29.0217C1.86875 28.3683 1.5625 27.5833 1.5625 26.6667V5C1.11979 5 0.748438 4.84055 0.448438 4.52167C0.149479 4.20167 0 3.80556 0 3.33333C0 2.86111 0.149479 2.465 0.448438 2.145C0.748438 1.82611 1.11979 1.66667 1.5625 1.66667H7.8125C7.8125 1.19444 7.9625 0.798333 8.2625 0.478333C8.56146 0.159444 8.93229 0 9.375 0H15.625C16.0677 0 16.4391 0.159444 16.7391 0.478333C17.038 0.798333 17.1875 1.19444 17.1875 1.66667H23.4375C23.8802 1.66667 24.251 1.82611 24.55 2.145C24.85 2.465 25 2.86111 25 3.33333C25 3.80556 24.85 4.20167 24.55 4.52167C24.251 4.84055 23.8802 5 23.4375 5V26.6667C23.4375 27.5833 23.1318 28.3683 22.5203 29.0217C21.9078 29.6739 21.1719 30 20.3125 30H4.6875ZM4.6875 5V26.6667H20.3125V5H4.6875ZM12.5 18.1667L15.4687 21.3333C15.7812 21.6389 16.1526 21.7917 16.5828 21.7917C17.012 21.7917 17.3698 21.6389 17.6562 21.3333C17.9688 21 18.125 20.6039 18.125 20.145C18.125 19.6872 17.9688 19.3056 17.6562 19L14.6875 15.8333L17.6562 12.6667C17.9688 12.3333 18.125 11.9372 18.125 11.4783C18.125 11.0206 17.9688 10.6389 17.6562 10.3333C17.3698 10 17.012 9.83333 16.5828 9.83333C16.1526 9.83333 15.7812 10 15.4687 10.3333L12.5 13.5L9.53125 10.3333C9.24479 10 8.88698 9.83333 8.45781 9.83333C8.0276 9.83333 7.65625 10 7.34375 10.3333C7.05729 10.6389 6.91406 11.0206 6.91406 11.4783C6.91406 11.9372 7.05729 12.3333 7.34375 12.6667L10.3125 15.8333L7.34375 19C7.05729 19.3056 6.91406 19.6872 6.91406 20.145C6.91406 20.6039 7.05729 21 7.34375 21.3333C7.65625 21.6389 8.0276 21.7917 8.45781 21.7917C8.88698 21.7917 9.24479 21.6389 9.53125 21.3333L12.5 18.1667Z" fill="white"/>
                                </svg>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.map((elem,i) => {
                            return (
                                <tr key={i}>
                                    {editItemId == elem.id ? <> 
                                    <td>
                                        <input
                                            className='form-control'
                                            type="text"
                                            value={servicename}
                                            onChange={(e) =>
                                                setServiceName(e.target.value)
                                            }
                                            autoFocus
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='form-control'
                                            type="number"
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(e.target.value)
                                            }
                                            autoFocus
                                        />
                                    </td>
                                    <td>
                                        <div className="item">
                                            <img src={elem.image} alt="" />
                                            <button className='btn btn-light' onClick={() => handleView(elem)}>
                                                View
                                            </button>
                                        </div>
                                    </td>
                                    </> : <>
                                    <td>
                                        <h6>{elem.servicename}</h6>
                                    </td>
                                    <td>
                                        <h6>PHP {elem.price}</h6>
                                    </td>
                                    <td>
                                        <div className="item">
                                            <img src={elem.image} alt="" />
                                            <button className='btn btn-light' onClick={() => handleView(elem)}>
                                                View
                                            </button>
                                        </div>
                                    </td>
                                    </>}
                                    <td>
                                        <h6>{elem.brand}</h6>
                                    </td>
                                    <td>
                                        {editItemId == elem.id ? <>
                                            <button className='btn btn-primary' onClick={() => updatedServices(elem.id,servicename,price)}>
                                                Save Edit
                                            </button>
                                        </> : <>
                                            <button className='btn btn-primary' onClick={() => handleChangeServices(elem)}>
                                                Edit
                                            </button>
                                        </>}
                                    </td>
                                    <td>
                                        <button className='btn btn-danger' onClick={() => deleteServices(elem)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
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

export default AdminServices