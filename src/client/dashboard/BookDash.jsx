import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from '../../context/AccountContext'
import { useEffect } from 'react'
import { useFinal } from '../../context/FinalContext'

function generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const BookDash = () => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 620px)');
        const handleMediaQueryChange = () => setIsMobile(mediaQuery.matches);
    
        // Immediate check
        handleMediaQueryChange();
    
        // Watch for changes
        mediaQuery.addEventListener('change', handleMediaQueryChange);
    
        // Cleanup function
        return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }, []);
    

    const {shopList,setShopList,setBrands} = useFinal()
    const navigate = useNavigate()
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        setOrders(shopList)
        setBrands("")
    }, []);

    const handleFinalizeOrder = async() => {
        if(orders.length === 0){
            alert("No orders to finalize!");
            return; // if there are no orders, we don't proceed further.
        }
        setOrders([]);
        return navigate('/info',{ state:{ 
            item: {
                orders:orders
            }
        }})
    }

    const handleRemoveOrder = (indexToRemove) => {
        const list = shopList.filter((_,idx) => idx !== indexToRemove);
        setShopList(list);
        setOrders(list);
    }

    return (
        <div className="bookOrders">
            <div className="container-md">
                <h2>Book Orders</h2>
                {isMobile ? 
                <>
                    <button className="final-button m-2"
                        onClick={handleFinalizeOrder}
                    >
                        Finalize Order
                    </button>
                    <div className="table-item-list">
                        {orders.map((order, index) => (
                            <div className="mobile-item" key={index}>
                                <div className="item_r">
                                    <img src={order.image} alt={order.itemname} />
                                </div>
                                <div className="item_l">
                                    <div className="item_texts">
                                        <h4>
                                            Item: {order.itemname}
                                        </h4>
                                        <p>
                                            Type:{order.typeofbook}
                                        </p>
                                    </div>
                                    <div className="item_texts">
                                        <p>Price:{order.price}</p>
                                        {order.typeofbook == 'Service' ? <></> : 
                                        <p>Qty: {order.qty}</p>
                                        }
                                    </div>
                                    <button 
                                        className="btn btn-danger" 
                                        onClick={() => handleRemoveOrder(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                : 
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <th>
                                    Image
                                </th>
                                <th>
                                    Item
                                </th>
                                <th>
                                    Type
                                </th>
                                <th>
                                    Price
                                </th>
                                <th>
                                    Quantity
                                </th>
                                <th>
                                    <button className='final-button' onClick={handleFinalizeOrder}>Finalize Order</button>
                                </th>
                            </tr>
                        </thead>
                        <tr className="gap">
                            <td colSpan="6"></td>
                        </tr>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr className='order-item' key={index}>
                                    <td>
                                        <img src={order.image} alt={order.itemname} />
                                    </td>
                                    <td>
                                        <h4>{order.itemname}</h4>
                                    </td>
                                    <td>
                                        <p>{order.typeofbook}</p>
                                    </td>
                                    <td>
                                        <p>{order.price}</p>
                                    </td>
                                    <td>
                                        {order.typeofbook == 'Service' ? <></> : 
                                        <p>{order.qty}</p>
                                        }
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-danger" 
                                            onClick={() => handleRemoveOrder(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}

export default BookDash