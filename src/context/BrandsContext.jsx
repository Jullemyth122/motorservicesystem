import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../lib/firebase';
import { deleteObject, getStorage, ref } from 'firebase/storage';

const createBrandsContext = createContext();

export function useBrands() {
    return useContext(createBrandsContext)
}

const BrandsProvider = ({children}) => {
    const [brandsList,setBrandsList] = useState([])
    const [editItemBrandId, setEditItemBrandId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "brands"));
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
            setBrandsList(items);
        };

        fetchData();
    }, []);

    const addBrands = async(brandname,image) => {
        try {
            const docRef = await addDoc(collection(db, "brands"), { brandname: brandname,image:image });
            setBrandsList([...brandsList, { id: docRef.id, brandname: brandname,image:image }]);
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    }

    // Update an existing item
    const updatedBrand = async (id, newbrandname,) => {
        try {
            const itemRef = doc(db, "brands", id);
            await updateDoc(itemRef, { brandname: newbrandname });
            const updatedBrands = brandsList.map((item) =>
                item.id === id ? { ...item, brandname: newbrandname } : item
            );
            setBrandsList(updatedBrands);
            setEditItemBrandId(""); // Clear edit mode
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };
    
    const deleteBrand = async(elem) => {
        try {
            const storageRef = ref(getStorage(), elem.image);
            await deleteObject(storageRef); // Delete the image from Firebase Storage
            await deleteDoc(doc(db, "brands", elem.id));
            const updatedBrands = brandsList.filter((item) => item.id !== elem.id);
            setBrandsList(updatedBrands);
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    }

    const value = {
        addBrands,
        updatedBrand,
        deleteBrand,
        brandsList,
        editItemBrandId,
        setEditItemBrandId
    }

    return (
        <createBrandsContext.Provider value={value}>
            {children}
        </createBrandsContext.Provider>
    )
}

export default BrandsProvider