import React from 'react'
import { Link } from 'react-router-dom'
import { useServices } from '../context/ServicesContext'
import { useInventory } from '../context/InventoryContext'
import { useBrands } from '../context/BrandsContext'
import { useState } from 'react'
import { useEffect } from 'react'
import { useAccount } from '../context/AccountContext'
import { useCustomer } from '../context/CustomerContext'

const Dashboard = () => {

    const [showQrCode, setShowQrCode] = useState(false)
    const [result, setResult] = useState(null)

    const [scannedItem, setScannedItem] = useState([])
    const { servicesList } = useServices()
    const { booksList,updateBookStatus } = useCustomer();
    const { inventoriesList,decreaseInventoryQuantity } = useInventory()
    const { brandsList } = useBrands()
    const { accountList } = useAccount()

    useEffect(() => {
        if (result) {
            const item = booksList.find(item => item.id === result.text)
            
            updateBookStatus(item.id, "Scanned"); // Assuming updateBookStatus is a method in context to update the status
            if (item) {
                setScannedItem(item)
                setShowQrCode(true)
                decreaseInventoryQuantity(item.orders); // Decrease the quantity in the inventory
                setResult(null)
            }
        }
    }, [result, booksList]);

    
    const getTotalCount = (list) => {
        return list?.length;
    };



    return (
        <div className='dashboard-component container-fluid'>
            <div className="title">
                <h3>
                    DASHBOARD
                </h3>
            </div>
            <div className="grid-dashboards row">
                <div className="col-md-4 p-2">
                    <div className="boxItem p-2">
                        <Link to={'/accounts'}>
                            <h3>
                                Accounts
                            </h3>
                            <div className="range">
                                <div className="l_side">
                                    <svg width="35" height="22" viewBox="0 0 35 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 0.0209961C18.8537 0.0209961 20.152 0.558755 21.1092 1.51597C22.0664 2.47319 22.6042 3.77145 22.6042 5.12516C22.6042 6.47887 22.0664 7.77714 21.1092 8.73435C20.152 9.69157 18.8537 10.2293 17.5 10.2293C16.1463 10.2293 14.848 9.69157 13.8908 8.73435C12.9336 7.77714 12.3958 6.47887 12.3958 5.12516C12.3958 3.77145 12.9336 2.47319 13.8908 1.51597C14.848 0.558755 16.1463 0.0209961 17.5 0.0209961ZM7.29167 3.66683C8.10833 3.66683 8.86667 3.88558 9.52292 4.27933C9.30417 6.36475 9.91667 8.43558 11.1708 10.0543C10.4417 11.4543 8.98333 12.4168 7.29167 12.4168C6.13134 12.4168 5.01855 11.9559 4.19807 11.1354C3.3776 10.315 2.91667 9.20215 2.91667 8.04183C2.91667 6.88151 3.3776 5.76871 4.19807 4.94824C5.01855 4.12777 6.13134 3.66683 7.29167 3.66683ZM27.7083 3.66683C28.8687 3.66683 29.9815 4.12777 30.8019 4.94824C31.6224 5.76871 32.0833 6.88151 32.0833 8.04183C32.0833 9.20215 31.6224 10.315 30.8019 11.1354C29.9815 11.9559 28.8687 12.4168 27.7083 12.4168C26.0167 12.4168 24.5583 11.4543 23.8292 10.0543C25.1007 8.41286 25.6908 6.34462 25.4771 4.27933C26.1333 3.88558 26.8917 3.66683 27.7083 3.66683ZM8.02083 18.6147C8.02083 15.596 12.2646 13.146 17.5 13.146C22.7354 13.146 26.9792 15.596 26.9792 18.6147V21.1668H8.02083V18.6147ZM0 21.1668V18.9793C0 16.9522 2.75625 15.246 6.48958 14.7502C5.62917 15.7418 5.10417 17.1127 5.10417 18.6147V21.1668H0ZM35 21.1668H29.8958V18.6147C29.8958 17.1127 29.3708 15.7418 28.5104 14.7502C32.2437 15.246 35 16.9522 35 18.9793V21.1668Z" fill="#FFE600"/>
                                    </svg>
                                </div>
                                <div className="r_side">
                                    {getTotalCount(accountList)}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="col-md-4 p-2">
                    <div className="boxItem p-2">
                        <Link to={'/services'}>
                            <h3>
                                Services
                            </h3>
                            <div className="range">
                                <div className="l_side">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16H11V13H14V11H11V8H9V11H6V13H9V16ZM0 20V4H6V0H14V4H20V20H0ZM8 4H12V2H8V4ZM2 18H18V6H2V18Z" fill="#FFE600"/>
                                    </svg>
                                </div>
                                <div className="r_side">
                                    {getTotalCount(servicesList)}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="col-md-4 p-2">
                    <div className="boxItem p-2">
                        <Link to={'/brands'}>
                            <h3>
                                Brands
                            </h3>
                            <div className="range">
                                <div className="l_side">
                                    <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.0938 19.3125H1C0.895833 19.3125 0.802083 19.2708 0.71875 19.1875C0.635417 19.1042 0.59375 19.0104 0.59375 18.9062C0.59375 17.9271 0.609583 17.0675 0.64125 16.3275C0.672917 15.5875 0.719583 14.9262 0.78125 14.3438H10.5938C12.0312 14.3438 13.2554 13.8333 14.2662 12.8125C15.2771 11.7917 15.7821 10.5417 15.7813 9.0625C15.7813 8 15.4846 7.03625 14.8912 6.17125C14.2979 5.30625 13.5008 4.66583 12.5 4.25L8.3125 2.59375C9.4375 1.96875 10.62 1.495 11.86 1.1725C13.1 0.85 14.3863 0.688333 15.7188 0.6875C18.3854 0.6875 20.6667 1.58875 22.5625 3.39125C24.4583 5.19375 25.4062 7.39667 25.4062 10C25.4062 12.6042 24.505 14.8075 22.7025 16.61C20.9 18.4125 18.6971 19.3133 16.0938 19.3125ZM1.1875 11.875C1.60417 10.3958 2.21875 9.005 3.03125 7.7025C3.84375 6.4 4.8125 5.24917 5.9375 4.25L11.5625 6.53125C12.1042 6.76042 12.5312 7.10417 12.8438 7.5625C13.1562 8.02083 13.3125 8.52083 13.3125 9.0625C13.3125 9.85417 13.0471 10.5208 12.5163 11.0625C11.9854 11.6042 11.3238 11.875 10.5312 11.875H1.1875Z" fill="#FFE600"/>
                                    </svg>
                                </div>
                                <div className="r_side">
                                    {getTotalCount(brandsList)}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="col-md-4 p-2">
                    <div className="boxItem p-2">
                        <Link to={'/booking'}>
                            <h3>
                                Booking
                            </h3>
                            <div className="range">
                                <div className="l_side">
                                    <svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 0.5H2.5C1.125 0.5 0 1.625 0 3V23C0 24.375 1.125 25.5 2.5 25.5H17.5C18.875 25.5 20 24.375 20 23V3C20 1.625 18.875 0.5 17.5 0.5ZM6.25 3H8.75V9.25L7.5 8.3125L6.25 9.25V3ZM17.5 23H2.5V3H3.75V14.25L7.5 11.4375L11.25 14.25V3H17.5V23Z" fill="#FFE600"/>
                                    </svg>
                                </div>
                                <div className="r_side">
                                    {getTotalCount(booksList)}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="col-md-4 p-2">
                    <div className="boxItem p-2">
                        <Link to={'/inventory'}>
                            <h3>
                                Inventory
                            </h3>
                            <div className="range">
                                <div className="l_side">
                                    <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 22H21V26H17V22ZM24 22H28V26H24V22ZM17 15H21V19H17V15ZM24 15H28V19H24V15Z" fill="#FFE600"/>
                                    <path d="M15 22H2V8H26V13H28V8C27.9995 7.46973 27.7886 6.96133 27.4136 6.58637C27.0387 6.21141 26.5303 6.00053 26 6H20V2C19.9995 1.46973 19.7886 0.961329 19.4136 0.586371C19.0387 0.211413 18.5303 0.000529477 18 0H10C9.46973 0.000529477 8.96133 0.211413 8.58637 0.586371C8.21141 0.961329 8.00053 1.46973 8 2V6H2C1.46973 6.00053 0.961329 6.21141 0.586371 6.58637C0.211413 6.96133 0.000529477 7.46973 0 8V22C0.000529477 22.5303 0.211413 23.0387 0.586371 23.4136C0.961329 23.7886 1.46973 23.9995 2 24H15V22ZM10 2H18V6H10V2Z" fill="#FFE600"/>
                                    </svg>
                                </div>
                                <div className="r_side">
                                    {getTotalCount(inventoriesList)}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard