import React, { useEffect, useRef, useState } from 'react'
import { useAccount } from '../context/AccountContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useBrands } from '../context/BrandsContext';

const BrandForm = ({ search,setSearch }) => {

    const { addBrands } = useBrands()
    const { generateRandomString } = useAccount()
    const [brandName,setBrandName] = useState("")

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

    const handleAddBrands = () => {
        if (fileByte != null) {
            const uploadFile = () => {
                const allStorageRef = ref(storage,`all-brands/${generateRandomString(30)}`)
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
                        addBrands(brandName,downloadURL)
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
                            type="text" 
                            className="input-text" 
                            id="brandName" 
                            placeholder="Enter Brand" 
                            value={brandName}
                            onChange={e => setBrandName(e.target.value)}
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
                </div>
                <div className="button_form">
                    <button onClick={handleAddBrands} >Add + </button>
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

const AdminBrands = () => {
    const [brand,setBrand] = useState("")
    const { brandsList,deleteBrand,setEditItemBrandId,editItemBrandId,updatedBrand } = useBrands()
    
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search,750)

    const handleChangeBrands = (elem) => {
        setEditItemBrandId(elem.id)
        setBrand(elem.brandname)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageNumbers, setPageNumbers] = useState([]);
  
    useEffect(() => {
        const filteredBrands = brandsList.filter(brand => 
            brand.brandname.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const items = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(items);
    
        const totalItems = filteredBrands.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const numbers = [];
        for (let i = 1; i <= totalPages; i++) {
            numbers.push(i);
        }
        setPageNumbers(numbers);
    }, [currentPage, itemsPerPage, brandsList, debouncedSearch]);
    
  
    const paginate = (pageNumber) => {
        if (pageNumber < 1) pageNumber = 1;
        if (pageNumber > pageNumbers.length) pageNumber = pageNumbers.length;
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);    

    return (
        <div className='brands-component'>
            <div className="row">
                <BrandForm/>
            </div>
            <div className="showListBrands">
                <div className='show-nav'>
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Search Brand Name"
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
                <div className="show_grid_list_brands">
                    {currentItems?.map((elem,i) => {
                        return (
                            <div className="items-new" key={i}>
                                {editItemBrandId == elem.id ? <> 
                                    <img src={elem.image} alt="" />
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) =>
                                            setBrand(e.target.value)
                                        }
                                        autoFocus
                                    />
                                </> : <>
                                    <img src={elem.image} alt="" />
                                    <h6>{elem.brandname}</h6>
                                </>}
                                <div className="button-brand d-flex align-items-center justify-content-center">
                                    {editItemBrandId == elem.id ? <>
                                        <button className='btn btn-primary' onClick={() => updatedBrand(elem.id,brand)}>
                                            Save Edit
                                        </button>
                                    </> : <>
                                        <button className='btn btn-primary' onClick={() => handleChangeBrands(elem)}>
                                            Edit
                                        </button>
                                    </>}
                                    <button className='btn btn-danger' onClick={() => deleteBrand(elem)}>
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

export default AdminBrands