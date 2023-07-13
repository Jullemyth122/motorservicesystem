import React, { useRef, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useAccount } from '../context/AccountContext'
import { useFinal } from '../context/FinalContext'
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { useEffect } from 'react';

const Navbar = () => {

    const { user, owner,handleLogOut } = useAccount()
    const { shopList } = useFinal()

    const refLinkref = useRef(null)
    const [show,setShow] = useState(false)
    const [showCartList,setShowCartList] = useState([])

    const [showCart,setShowCart] = useState(false)
    const handleShowCart = () => {
        setShowCart(!showCart)
    }
    const { booksList } = useCustomer()

    const handleShow = () => {
        setShow(!show)
    }


    useEffect(() => {
        if (user) {
            const itemsList = booksList
                .filter((el) => el.id.includes(user.email + '-'))
                .filter((el) => el.status != 'success')
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date in descending order
            setShowCartList(itemsList);
        }
    }, [user,booksList]);
    
    return (
        <nav className='nav-component'>
            <div className="hamburger-button" onClick={handleShow}>
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 1C0 0.447715 0.447715 0 1 0H23C23.5523 0 24 0.447715 24 1C24 1.55228 23.5523 2 23 2H1C0.447715 2 0 1.55228 0 1ZM0 9C0 8.44772 0.447715 8 1 8H23C23.5523 8 24 8.44772 24 9C24 9.55229 23.5523 10 23 10H1C0.447715 10 0 9.55229 0 9ZM0 17C0 16.4477 0.447715 16 1 16H23C23.5523 16 24 16.4477 24 17C24 17.5523 23.5523 18 23 18H1C0.447715 18 0 17.5523 0 17Z" fill="black"/>
                </svg>
            </div>
            <ul ref={refLinkref} className={`nav-links ${show ? 'show-links' : ''} align-items-center justif-content-center`}>
                {owner?.type == 'admin' && user?.email.length > 0 ? <>
                    <Link className='nav-link' to={'/'} onClick={handleShow}>
                        <h3>
                            Dashboard
                        </h3>
                    </Link>
                    <Link className='nav-link' to={'/accounts'} onClick={handleShow}>
                        <h3>
                            Accounts
                        </h3>
                    </Link>
                    <Link className='nav-link' to={'/services'} onClick={handleShow}>
                        <h3>
                            Services
                        </h3>
                    </Link>
                    <Link className='nav-link' to={'/brands'} onClick={handleShow}>
                        <h3>
                            Brands
                        </h3>
                    </Link>
                    <Link className='nav-link' to={'/booking'} onClick={handleShow}>
                        <h3>
                            Booking
                        </h3>
                    </Link>
                    <Link className='nav-link' to={'/inventory'} onClick={handleShow}>
                        <h3>
                            Products / Inventory
                        </h3>
                    </Link>
                </> : <>
                    <Link className='nav-link' to={'/'} onClick={handleShow}>
                        <h3>
                            HOME
                        </h3>
                    </Link>
                    <Link className='nav-link' to={'/shop'} onClick={handleShow}>
                        <h3>
                            SHOP
                        </h3>
                    </Link>
                    <Link className='nav-link' to='/about' onClick={handleShow}>
                        <h3>ABOUT</h3>
                    </Link>
                    <Link className='nav-link' to='/contact' onClick={handleShow}>
                        <h3>CONTACT</h3>
                    </Link>
                    {shopList?.length > 0 && 
                        <Link className='nav-link' to={'/book'} onClick={handleShow}>
                            <h3>
                                BOOK ORDER
                            </h3>
                        </Link>
                    }
                </>}
                {user?.email && user?.email.length > 0 ? <>
                <div className="nav-link cart_icon" onClick={handleShowCart}>
                    {owner?.type == 'customer' && user?.email.length > 0 && 
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99933 18.5493 4 18C4 17.45 4.196 16.979 4.588 16.587C4.98 16.195 5.45067 15.9993 6 16C6.55 16 7.021 16.196 7.413 16.588C7.805 16.98 8.00067 17.4507 8 18C8 18.55 7.804 19.021 7.412 19.413C7.02 19.805 6.54933 20.0007 6 20ZM16 20C15.45 20 14.979 19.804 14.587 19.412C14.195 19.02 13.9993 18.5493 14 18C14 17.45 14.196 16.979 14.588 16.587C14.98 16.195 15.4507 15.9993 16 16C16.55 16 17.021 16.196 17.413 16.588C17.805 16.98 18.0007 17.4507 18 18C18 18.55 17.804 19.021 17.412 19.413C17.02 19.805 16.5493 20.0007 16 20ZM5.15 4L7.55 9H14.55L17.3 4H5.15ZM4.2 2H18.95C19.3333 2 19.625 2.171 19.825 2.513C20.025 2.855 20.0333 3.20067 19.85 3.55L16.3 9.95C16.1167 10.2833 15.8707 10.5417 15.562 10.725C15.2533 10.9083 14.916 11 14.55 11H7.1L6 13H18V15H6C5.25 15 4.68333 14.6707 4.3 14.012C3.91667 13.3533 3.9 12.6993 4.25 12.05L5.6 9.6L2 2H0V0H3.25L4.2 2Z" fill="white"/>
                        </svg>
                    }
                    <h3>
                        {owner?.usernameAcc}
                    </h3>
                    {owner?.type == 'customer' && user?.email.length > 0 ? 
                        <div className={`cart_container_list ${showCart  ? 'show' : ''}`}>
                            {showCartList?.map((item) => (
                                <div className="cart_list" key={item.id}>
                                    <h4>{item.date}</h4> {/* Display the date */}
                                    {item.orders?.map((order) => (
                                        <div className="cart_item" key={order.itemname}>
                                        <img src={order.image} alt={order.itemname} />
                                        <div>
                                            <h4>{order.itemname}</h4> {/* Display the item name */}
                                            <p>{order.typeofbook}</p> {/* Display the type of book */}
                                        </div>
                                        <p>{order.price}</p> {/* Display the price */}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    : 
                    <></>
                    }
                </div>
                </>
                : 
                <></>
                }
                {user?.email && user?.email.length > 0 ?
                <>
                    <div className='nav-link' onClick={e => handleLogOut(owner)}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14ZM0 18V0H9V2H2V16H9V18H0Z" fill="#fff"/>
                        </svg>
                    </div>
                </>
                :
                <Link className='nav-link' to={'/login'} onClick={handleShow}>
                    <h3>
                        L O G I N
                    </h3>
                </Link>
                }
            </ul>

        </nav>
    )
}

export default Navbar


