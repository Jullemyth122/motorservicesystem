import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../lib/firebase';
import { deleteObject, getStorage, ref } from 'firebase/storage';

const createBookssContext = createContext();

export function useBrands() {
    return useContext(createBookssContext)
}

const BooksProvider = ({children}) => {
    const [booksList,setBooksList] = useState([])
    const [editItemBookId, setEditItemBookId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "books"));
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
            setBooksList(items);
        };

        fetchData();
    }, []);

    const addBrands = async(brandname,image) => {
        try {
            const docRef = await addDoc(collection(db, "books"), { brandname: brandname,image:image });
            setBooksList([...booksList, { id: docRef.id, brandname: brandname,image:image }]);
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    }

    // Update an existing item
    const updatedBrand = async (id, newbrandname,) => {
        try {
            const itemRef = doc(db, "books", id);
            await updateDoc(itemRef, { brandname: newbrandname });
            const updatedBrands = booksList.map((item) =>
                item.id === id ? { ...item, brandname: newbrandname } : item
            );
            setBooksList(updatedBrands);
            setEditItemBookId(""); // Clear edit mode
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };
    
    const deleteBrand = async(elem) => {
        try {
            const storageRef = ref(getStorage(), elem.image);
            await deleteObject(storageRef); // Delete the image from Firebase Storage
            await deleteDoc(doc(db, "books", elem.id));
            const updatedBrands = booksList.filter((item) => item.id !== elem.id);
            setBooksList(updatedBrands);
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    }

    const value = {
        addBrands,
        updatedBrand,
        deleteBrand,
        booksList,
        editItemBookId,
        setEditItemBookId
    }

    return (
        <createBookssContext.Provider value={value}>
            {children}
        </createBookssContext.Provider>
    )
}

export default BooksProvider