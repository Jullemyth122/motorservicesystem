import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../lib/firebase';
import { deleteObject, getStorage, ref } from 'firebase/storage';

const createServicesContext = createContext();

export function useServices() {
    return useContext(createServicesContext)
}

const ServicesProvider = ({children}) => {
    const [servicesList,setServicesList] = useState([])
    const [editItemId, setEditItemId] = useState("");

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "services"));
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        setServicesList(items);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const addServices = async(servicename,price,image,mileage,brandname) => {
        try {
            await addDoc(collection(db, "services"), { servicename: servicename,price:price,image:image,typeofbook:'Service',mileage:mileage,brand:brandname });
            fetchData()
            // setServicesList([...servicesList, { id: docRef.id, servicename: servicename,price:price,image:image,typeofbook:'Service',mileage:mileage, brand:brandname }]);
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    }

    // Update an existing item
    const updatedServices = async (id, newserviceName, newPrice) => {
        try {
            const itemRef = doc(db, "services", id);
            await updateDoc(itemRef, { servicename: newserviceName,price:newPrice });
            const updatedServices = servicesList.map((item) =>
                item.id === id ? { ...item, servicename: newserviceName,price:newPrice } : item
            );
            setServicesList(updatedServices);
            setEditItemId(""); // Clear edit mode
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };
    
    const deleteServices = async(elem) => {
        try {
            const storageRef = ref(getStorage(), elem.image);
            await deleteObject(storageRef); // Delete the image from Firebase Storage
            await deleteDoc(doc(db, "services", elem.id));
            const updatedServices = servicesList.filter((item) => item.id !== elem.id);
            setServicesList(updatedServices);
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    }

    const value = {
        addServices,
        updatedServices,
        deleteServices,
        servicesList,
        editItemId,
        setEditItemId
    }

    return (
        <createServicesContext.Provider value={value}>
            {children}
        </createServicesContext.Provider>
    )
}

export default ServicesProvider