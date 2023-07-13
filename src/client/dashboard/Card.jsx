import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import QRScanner from '../../QRScanner';
import QRCode from "react-qr-code";
import { useCustomer } from '../../context/CustomerContext';
import { useAccount } from '../../context/AccountContext';
import { useFinal } from '../../context/FinalContext';

const Card = () => {

    const navigate  = useNavigate()
    const { shopList,setShopList } = useFinal()

    const [qty,setQty] = useState(1)

    const { state: shopItem }  = useLocation();

    const handleAddQty = () => {
        setQty(qty + 1);
    };

    const handleSubQty = () => {
        if (qty > 0) {
            setQty(qty - 1);
        }
    };

    const handleBookOrder = () => {

        if (shopList.length > 30) {
            
        }

        const order = {
            itemname: shopItem?.item?.servicename ? shopItem?.item.servicename : shopItem?.item.inventoryname,
            image:shopItem?.item?.image,
            price:shopItem?.item?.price,
            typeofbook:shopItem?.item?.typeofbook,
            typeoforder:'buy',
            qty:qty
        }
        setShopList([...shopList,order])        
        return alert("Added at Book Order")
    }

    return (
        <div className='card-component'>
            {/* <div className="back-button" onClick={e => navigate('/shop') }>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 30L0 15L15 0L17.6719 2.625L7.17187 13.125H30V16.875H7.17187L17.6719 27.375L15 30Z" fill="black"/>
                </svg>
            </div> */}
            <div className="card-container">
                <div className="card-item">
                    <ul>
                        <svg onClick={e => navigate('/shop')} className="arrow" version="1.1" viewBox="0 0 512 512" width="512px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polygon points="352,115.4 331.3,96 160,256 331.3,416 352,396.7 201.5,256 " stroke="#727272"/></svg>
                        Back to Shop
                    </ul>
                    <div className="item-self">
                        <div className="photo">
                            <img src={shopItem?.item.image} alt='item'/>
                        </div>
                        <div className="description">
                            <h2>{shopItem?.item.inventoryname}</h2>
                            <h4>Brand: {shopItem?.item.brand}</h4>
                            <h1>PHP{shopItem?.item.price}</h1>
                            <p>
                                Stocks - {shopItem?.item.quantity}
                            </p>
                            <div className="button_info align-items-center justify-content-start gap-2">
                                <button onClick={handleBookOrder}> Book Now </button>
                                <div className="qty_side">
                                    <button onClick={handleAddQty}>+</button>
                                    <h3>{qty}</h3>
                                    <button onClick={handleSubQty}>-</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Card