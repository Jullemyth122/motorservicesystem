import React, { useState } from 'react'
import { useContext } from 'react';
import { createContext } from 'react';

const createFinalContext = createContext();


export function useFinal() {
    return useContext(createFinalContext);
}

const FinalProvider = ({children}) => {
    const [emailUid,setEmailUid] = useState("")
    const [name, setName] = useState("")
    const [bookDate, setBookDate] = useState("")
    const [showQrCode, setShowQrCode] = useState(false)
    const [shopList,setShopList] = useState([])
    const [number,setPhoneNumber] = useState("")
    const [brands,setBrands] = useState("")

    const value = {
        shopList,
        showQrCode,
        setShopList,
        setShowQrCode,
        bookDate,setBookDate,
        emailUid,setEmailUid,
        number,setPhoneNumber,
        brands,setBrands
    }

    return (
        <createFinalContext.Provider value={value}>
            {children}
        </createFinalContext.Provider>
    )
}

export default FinalProvider