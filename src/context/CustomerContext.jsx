import React, { useContext, useEffect, useState } from 'react';
import {  arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import {  db } from '../lib/firebase';
import { format } from 'date-fns';

const createCustomerContext = React.createContext();


export function useCustomer() {
    return useContext(createCustomerContext);
}

const CustomerProvider = ({ children }) => {

    const [booksList,setBooksList] = useState([])
    const [editItemBookId, setEditItemBookId] = useState("");

    async function fetchOrders(email) {
        const docRef = doc(db, 'auth', email);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            return docSnap.data().orders || [];
        } else {
            return [];
        }
    }

    const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "books"));
    const items = [];

    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
    });
        setBooksList(items);
    };
    
    useEffect(() => {

        fetchData();
    }, []);


    const addBook = async(stats) => {
        try {
            const docRef = doc(db, "books", stats.emailUid);
            const currentDate = format(new Date(), 'yyyy-MM-dd');
            console.log(currentDate)
            await setDoc(docRef, {name:stats.name,date:stats.date,orders:stats.orders,phoneno:stats.phoneno,status:'pending', createdAt: currentDate });
            setBooksList([...booksList, { id: stats.emailUid,name:stats.name,date:stats.date,orders:stats.order, phoneno:stats.phoneno,status: 'pending', createdAt: currentDate }]);        
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    }
    

    const updatedBook = async(id,pendingStatus) => {
        try {
            console.log(id,pendingStatus)
            const itemRef = doc(db, "books", id);
            await updateDoc(itemRef, { status: pendingStatus });
            const updatedBooks = booksList.map((item) =>
                item.id === id ? { ...item, status: pendingStatus } : item
            );
            fetchData()
            // setBooksList(updatedBooks);
            // setEditItemBookId(""); // Clear edit mode
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    }

    const updateBookStatus = async (id, newStatus) => {
        try {
            const itemRef = doc(db, "books", id);
            await updateDoc(itemRef, { status: newStatus });
            const updatedBooks = booksList.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
            );
            setBooksList(updatedBooks);
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };
    
    const deleteBook = async(elem) => {
        try {
            await deleteDoc(doc(db, "books", elem.id));
            const updatedBook = booksList.filter((item) => item.id !== elem.id);
            setBooksList(updatedBook);
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    }

    const value = {
        addBook,
        updatedBook,
        deleteBook,
        updateBookStatus,
        booksList,
        editItemBookId,
        setEditItemBookId,
        fetchOrders
    }

    return (
        <createCustomerContext.Provider value={value}>
            {children}
        </createCustomerContext.Provider>
    )
}

export default CustomerProvider