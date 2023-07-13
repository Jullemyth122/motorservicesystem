import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code';
import { useCustomer } from '../../context/CustomerContext';
import { useEffect } from 'react';
import { useAccount } from '../../context/AccountContext';
import { useFinal } from '../../context/FinalContext';
import { useInventory } from '../../context/InventoryContext';

function generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const Info = () => {

    const [bookDateError, setBookDateError] = useState('');
    const [numberError, setNumberError] = useState('');
    const { decreaseInventoryQuantity } = useInventory()
    const { addBook,booksList } = useCustomer()
    const { number,setPhoneNumber,setShopList,shopList,bookDate,setBookDate,emailUid,setEmailUid,setBrands } = useFinal()
    const { showQrCode,setShowQrCode } = useFinal()
    const { user,owner } = useAccount();
    const { state: item } = useLocation()
    const [imgURLs,setImageURLs] = useState("")
    const [totalPrice,setTotalPrice] = useState(0)
    const [alertBook,setAlertBookOrder] = useState(false)
    const [finalList,setFinalList] = useState([])
    const navigate = useNavigate()


    function checkDateLimit(date) {
        const sameDateItems = booksList.filter((item) => item.date === date);
        return sameDateItems.length < 30;
    }

    useEffect(() => {
        let qrCodeValue = "";
        let totalPrice = 0;
        if (user) {
            setFinalList(item?.item?.orders)
            qrCodeValue = item?.item?.orders?.map(order => {
                if (!isNaN(parseInt(order.price)) && !isNaN(parseInt(order.qty))) {
                    totalPrice += parseInt(order.price) * parseInt(order.qty);
                }
                console.log(order.price)
                return `${order.itemname} ${order.typeofbook == 'Service' ? '' : `- ${order.qty} pcs`} - ${order.price} PHP`;
            }).join('\n');
            qrCodeValue += `\nTotal Price: ${totalPrice}`;            
        }
        setImageURLs(qrCodeValue);
    },[item,user]);

    useEffect(() => {
        let price = 0;
        shopList?.map((elem,i) => {
            price += parseInt(elem.price) * parseInt(elem.qty);
            return setTotalPrice(price)
        })
    },[shopList])

    useEffect(() => {
        if (user) {
            setEmailUid(user.email.toString() + '-' + generateRandomString(20))
        }
    },[user])


    const handleFinalBook = (e) => {
        e.preventDefault();    

        
        let validationError = false;
        // Validate book date
        let currentDate = new Date();
        let selectedDate = new Date(bookDate);
        if (!bookDate || selectedDate < currentDate) {
            setBookDateError("Book date should be later than the current date");
            validationError = true;
        } else if (!checkDateLimit(bookDate)) {
            setBookDateError("Maximum limit of 30 orders for the selected date has been reached");
            validationError = true;
        } else {
            setBookDateError('');
        }
    
        // Validate number
        let numberPattern = new RegExp("^09[0-9]{9}$"); // 11 digits phone number starting with '09'
        if (!number || number.length != 11 || !numberPattern.test(number)) {
            if (!number || number.length != 11) {
                setNumberError("Number should have exactly 11 digits");
            } else if (!numberPattern.test(number)) {
                setNumberError("Number should start with '09'");
            }
            validationError = true;
        } else {
            setNumberError('');
        }

    
        if (validationError) {
            return;
        }
    
        if (!user) {
            setShowQrCode(true);
            return navigate('/login', { state: { item, infostatus: "info" } });
        } else {
            setShowQrCode(true);
        }
    };
    
    const finalBookOrder = () => {

        const items = {
            emailUid: emailUid,
            name:owner.usernameAcc,
            phoneno:number,
            date:bookDate,
            orders:shopList
        }
        setShopList([])
        setPhoneNumber('')
        setAlertBookOrder(true)
        addBook(items)
        decreaseInventoryQuantity(shopList)
    }
    
    const returnHome = () => {
        setShopList([])
        setFinalList([])
        setBookDate('')
        setPhoneNumber('')
        setBrands("")
        setShowQrCode(false)
        setAlertBookOrder(false)
        window.location.reload()
        window.location.href = '/'
    }
    return (
        <div className='info-component'>
            {!showQrCode ?
                <>
                <div className="card-form">
                    <div className="receipt-form">
                        <div className="receipt_head">
                            <p>
                                Item/s
                            </p>
                            <p>
                                Price
                            </p>
                        </div>
                        <div className="receipt_list">
                            {shopList?.map((elem,idx) => {
                                return (
                                    <div className="two_items" key={idx}>
                                        <p>
                                            {elem.itemname} - {elem.qty} pc/s
                                        </p>
                                        <p>
                                            {elem.price ? 'PHP ' + elem.price : ''}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="receipt_bottom">
                            <p>
                                Total Price
                            </p>
                            <p>
                                PHP {totalPrice}
                            </p>
                        </div>
                    </div>
                    <form onSubmit={handleFinalBook} className="info-form">
                        <div className="input-wrapper">
                            <input className='date' type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} />
                            <svg width="192" height="208" viewBox="0 0 192 208" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.2" d="M184 32V72H8V32C8 29.8783 8.84286 27.8434 10.3431 26.3431C11.8434 24.8429 13.8783 24 16 24H176C178.122 24 180.157 24.8429 181.657 26.3431C183.157 27.8434 184 29.8783 184 32Z" fill="#fff"/>
                                <path d="M176 16H152V8C152 5.87827 151.157 3.84344 149.657 2.34315C148.157 0.842854 146.122 0 144 0C141.878 0 139.843 0.842854 138.343 2.34315C136.843 3.84344 136 5.87827 136 8V16H56V8C56 5.87827 55.1571 3.84344 53.6569 2.34315C52.1566 0.842854 50.1217 0 48 0C45.8783 0 43.8434 0.842854 42.3431 2.34315C40.8429 3.84344 40 5.87827 40 8V16H16C11.7565 16 7.68687 17.6857 4.68629 20.6863C1.68571 23.6869 0 27.7565 0 32V192C0 196.243 1.68571 200.313 4.68629 203.314C7.68687 206.314 11.7565 208 16 208H176C180.243 208 184.313 206.314 187.314 203.314C190.314 200.313 192 196.243 192 192V32C192 27.7565 190.314 23.6869 187.314 20.6863C184.313 17.6857 180.243 16 176 16ZM40 32V40C40 42.1217 40.8429 44.1566 42.3431 45.6569C43.8434 47.1571 45.8783 48 48 48C50.1217 48 52.1566 47.1571 53.6569 45.6569C55.1571 44.1566 56 42.1217 56 40V32H136V40C136 42.1217 136.843 44.1566 138.343 45.6569C139.843 47.1571 141.878 48 144 48C146.122 48 148.157 47.1571 149.657 45.6569C151.157 44.1566 152 42.1217 152 40V32H176V64H16V32H40ZM176 192H16V80H176V192ZM80 104V168C80 170.122 79.1571 172.157 77.6569 173.657C76.1566 175.157 74.1217 176 72 176C69.8783 176 67.8434 175.157 66.3431 173.657C64.8429 172.157 64 170.122 64 168V116.94L59.58 119.16C57.6811 120.109 55.4827 120.266 53.4686 119.594C51.4544 118.923 49.7895 117.479 48.84 115.58C47.8905 113.681 47.7343 111.483 48.4057 109.469C49.0771 107.454 50.521 105.789 52.42 104.84L68.42 96.84C69.6401 96.2294 70.9961 95.9411 72.3591 96.0023C73.7221 96.0636 75.0468 96.4724 76.2072 97.1899C77.3676 97.9074 78.3253 98.9098 78.9892 100.102C79.653 101.294 80.001 102.636 80 104ZM139.16 134.45L120 160H136C138.122 160 140.157 160.843 141.657 162.343C143.157 163.843 144 165.878 144 168C144 170.122 143.157 172.157 141.657 173.657C140.157 175.157 138.122 176 136 176H104C102.514 176 101.058 175.586 99.7941 174.805C98.5303 174.024 97.509 172.907 96.8446 171.578C96.1802 170.249 95.8989 168.761 96.0323 167.282C96.1657 165.802 96.7086 164.389 97.6 163.2L126.38 124.83C127.035 123.959 127.504 122.962 127.76 121.903C128.016 120.843 128.053 119.743 127.868 118.669C127.683 117.594 127.28 116.569 126.685 115.656C126.09 114.743 125.314 113.961 124.406 113.359C123.498 112.756 122.476 112.346 121.403 112.152C120.331 111.959 119.23 111.987 118.168 112.234C117.107 112.481 116.107 112.943 115.23 113.59C114.354 114.238 113.618 115.058 113.07 116C112.56 116.939 111.868 117.766 111.033 118.433C110.198 119.1 109.238 119.592 108.21 119.882C107.182 120.172 106.106 120.253 105.046 120.12C103.986 119.988 102.963 119.644 102.038 119.11C101.113 118.575 100.304 117.861 99.6599 117.009C99.0153 116.157 98.5479 115.185 98.2852 114.149C98.0226 113.114 97.9699 112.036 98.1305 110.98C98.291 109.924 98.6615 108.911 99.22 108C101.863 103.427 105.94 99.8532 110.82 97.833C115.7 95.8128 121.111 95.4588 126.212 96.8259C131.314 98.1931 135.822 101.205 139.038 105.395C142.254 109.585 143.998 114.718 144 120C144.017 125.217 142.316 130.295 139.16 134.45Z" fill="#fff"/>
                            </svg>
                        </div>
                        {bookDateError && <div style={{color:"red"}}>{bookDateError}</div>}
                        <input className='phone-no' type="text" placeholder='Phone No.' value={number} onChange={e => setPhoneNumber(e.target.value)} />
                        {numberError && <div style={{color:"red"}}>{numberError}</div>}
                        <button className='book-button' type="submit"> Book Now </button>
                    </form>
                </div>
                </>
                :
                <>
                {alertBook ? 
                    <div className='show-result'>
                        <h4>
                            Book Successfully
                        </h4>
                        <div className="receipt-form">
                            <div className="receipt_top">
                                Hi {owner?.usernameAcc}
                                <br/>
                                Please Bring Your Qr Code <br/>
                                Location : Anabu A1, Imus ,Philippines,4103
                            </div>
                            <div className="receipt_head">
                                <p>
                                    Item/s
                                </p>
                                <p>
                                    Price
                                </p>
                            </div>
                            <div className="receipt_list">
                                {finalList?.map((elem,idx) => {
                                    return (
                                        <div className="two_items" key={idx}>
                                            <p>
                                                {elem.itemname} - {elem.qty} pc/s
                                            </p>
                                            <p>
                                                {elem.price ? 'PHP ' + elem.price : ''}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="receipt_date">
                                <p>
                                    Date Book
                                </p>
                                <p>
                                    {bookDate}
                                </p>
                            </div>
                            <div className="receipt_bottom">
                                <p>
                                    Total Price
                                </p>
                                <p>
                                    PHP {totalPrice}
                                </p>
                            </div>
                        </div>
                        <div className="svg_result" onClick={returnHome}>
                            <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.00015 10.1698L2.53015 6.69983C2.34317 6.51286 2.08957 6.40781 1.82515 6.40781C1.56072 6.40781 1.30712 6.51286 1.12015 6.69983C0.933168 6.88681 0.828125 7.14041 0.828125 7.40483C0.828125 7.53576 0.853914 7.66541 0.904019 7.78638C0.954124 7.90734 1.02756 8.01725 1.12015 8.10983L5.30015 12.2898C5.69015 12.6798 6.32015 12.6798 6.71015 12.2898L17.2901 1.70983C17.4771 1.52286 17.5822 1.26926 17.5822 1.00483C17.5822 0.740407 17.4771 0.486811 17.2901 0.299833C17.1032 0.112856 16.8496 0.0078125 16.5851 0.0078125C16.3207 0.0078125 16.0671 0.112856 15.8801 0.299833L6.00015 10.1698Z" fill="#fff"/>
                            </svg>
                        </div>
                    </div>
                :  
                    <div className="qr-code-wrapper">
                        <p>
                            Take a screenshot or picture to save
                        </p>
                        <QRCode value={imgURLs} size={256}/>
                        <button onClick={finalBookOrder}>Done</button>
                    </div>
                }
            </>
            }
        </div>
    )
}

export default Info
