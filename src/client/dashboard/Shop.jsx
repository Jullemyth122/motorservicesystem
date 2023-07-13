import React, { useRef, useState } from 'react'
import { useInventory } from '../../context/InventoryContext'
import { useEffect } from 'react'
import { useAccount } from '../../context/AccountContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFinal } from '../../context/FinalContext'

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

const Shop = () => {

    const { state: service } = useLocation()
    const shopContainerRef = useRef(null);

    const { brands } = useFinal()
    const navigate = useNavigate()
    const [search,setSearch] = useState('')
    const debouncedSearch = useDebounce(search,750)

    const [allItems,setAllItems] = useState([])
    const [allItemsFilter,setAllItemsFilter] = useState(allItems)

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;
    const totalPages = Math.ceil(allItemsFilter.length / itemsPerPage);

    const { inventoriesList } = useInventory()

    useEffect(() => {
        let itemsList = [];
        if (brands === "" || brands.trim() === "") { // if brands is empty or contains only whitespace
            itemsList = inventoriesList;
        } else {
            itemsList = inventoriesList.filter(item => item.brand == brands);
        }
        setAllItems([...itemsList]);
        setAllItemsFilter([...itemsList]);
    }, [inventoriesList, brands]); // 'brands' should be a dependency as well
    

    useEffect(() => {
        if (debouncedSearch.trim() === '') {
            setAllItemsFilter(allItems);
        } else {
            const lowercasedSearch = debouncedSearch.toLowerCase();
            const results = allItems.filter(
                (item) =>
                item?.inventoryname?.toLowerCase().includes(lowercasedSearch)
            );
            setAllItemsFilter(results);
        }
    }, [debouncedSearch, allItems]);

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
    };

    const handleNextPage = () => {
        if(currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
            shopContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

        }
    };

    const handlePrevPage = () => {
        if(currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
            shopContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = allItemsFilter.slice(startIndex, endIndex);

    const handleBuyItem = (elem) => {
        navigate(`/card/${elem.id}`,{ state : { item:elem,service:service?.service}});
    }

    return (
        <div className='shop-component'>
            <div className="shop-header">
                <div className="shop_indicators">
                    <div className="shop_inputs d-flex align-items-center justify-content-center">
                        <input 
                            type="text" 
                            placeholder='Search'
                            value={search}
                            onChange={e => handleSearch(e)}
                        />
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24.9128 23.5863L19.0452 17.7198C20.7459 15.6781 21.5939 13.0593 21.4129 10.4082C21.2319 7.75713 20.0358 5.27788 18.0735 3.48622C16.1111 1.69456 13.5335 0.728426 10.8769 0.788801C8.22036 0.849176 5.68933 1.93141 3.81037 3.81037C1.93141 5.68933 0.849176 8.22036 0.788801 10.8769C0.728426 13.5335 1.69456 16.1111 3.48622 18.0735C5.27788 20.0358 7.75713 21.2319 10.4082 21.4129C13.0593 21.5939 15.6781 20.7459 17.7198 19.0452L23.5863 24.9128C23.6734 24.9999 23.7768 25.069 23.8906 25.1162C24.0044 25.1633 24.1264 25.1876 24.2495 25.1876C24.3727 25.1876 24.4947 25.1633 24.6085 25.1162C24.7223 25.069 24.8257 24.9999 24.9128 24.9128C24.9999 24.8257 25.069 24.7223 25.1162 24.6085C25.1633 24.4947 25.1876 24.3727 25.1876 24.2495C25.1876 24.1264 25.1633 24.0044 25.1162 23.8906C25.069 23.7768 24.9999 23.6734 24.9128 23.5863ZM2.68703 11.1245C2.68703 9.45575 3.18189 7.82445 4.10901 6.43691C5.03613 5.04937 6.35389 3.96792 7.89564 3.3293C9.43739 2.69069 11.1339 2.5236 12.7706 2.84916C14.4073 3.17472 15.9107 3.97832 17.0907 5.15832C18.2708 6.33833 19.0743 7.84175 19.3999 9.47846C19.7255 11.1152 19.5584 12.8117 18.9198 14.3534C18.2812 15.8952 17.1997 17.2129 15.8122 18.1401C14.4246 19.0672 12.7933 19.562 11.1245 19.562C8.88753 19.5596 6.74286 18.6698 5.16106 17.088C3.57926 15.5062 2.68952 13.3615 2.68703 11.1245Z" fill="#fff"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="shop-container" ref={shopContainerRef}>
                <div className="shop-body">
                    <div className="shop-main-list">
                        {displayedItems?.filter((el) => el.quantity > 0).map((elem,i) => {
                            return (
                                <div className="item_shop" key={i}>
                                    <div className="name_item">
                                        {elem.inventoryname}
                                    </div>
                                    <div className="img_shop">
                                        <img src={elem.image} alt="" />
                                    </div>
                                    <div className="price_info">
                                        <h4>
                                            PHP {elem?.price}
                                        </h4>
                                        <h4>
                                            Qty: {elem.quantity}
                                        </h4>
                                    </div>
                                    <div className="purchase_info">
                                        <div 
                                            className="buy" 
                                            onClick={e => handleBuyItem(elem)}
                                        >
                                            <h4> Buy </h4>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="pagination">
                        <div className={`next ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePrevPage}>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 30L0 15L15 0L17.6719 2.625L7.17187 13.125H30V16.875H7.17187L17.6719 27.375L15 30Z" fill="black"/>
                            </svg>
                        </div>
                        <div className={`prev ${currentPage === totalPages ? 'disabled' : ''}`} onClick={handleNextPage}>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 0L30 15L15 30L12.3281 27.375L22.8281 16.875L0 16.875L0 13.125L22.8281 13.125L12.3281 2.625L15 0Z" fill="black"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop