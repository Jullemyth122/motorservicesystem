import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../lib/firebase';
import { deleteObject, getStorage, ref } from 'firebase/storage';

const createInventoryContext = createContext();

export function useInventory() {
    return useContext(createInventoryContext)
}

const InventoryProvider = ({children}) => {
    const [inventoriesList,setInventoryList] = useState([])
    const [editItemInventoryId, setEditItemInventoryId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
            setInventoryList(items);
        };

        fetchData();
    }, []);

    const addInventory = async(inventoryname,image,price,quantity,brand) => {
        try {
            const docRef = await addDoc(collection(db, "inventory"), { inventoryname: inventoryname,image:image,price:price,quantity:quantity,brand:brand,typeofbook:'Products' });
            setInventoryList([...inventoriesList, { id: docRef.id, inventoryname: inventoryname,image:image,price:price,quantity:quantity, typeofbook:'Products' }]);
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    }

    // Update an existing item
    const updatedInventory = async (id, newinventoryname,newprice,newquantity) => {
        try {
            const itemRef = doc(db, "inventory", id);
            await updateDoc(itemRef, { inventoryname: newinventoryname,price:newprice,quantity:newquantity });
            const updatedBrands = inventoriesList.map((item) =>
                item.id === id ? { ...item, inventoryname: newinventoryname,price:newprice,quantity:newquantity } : item
            );
            setInventoryList(updatedBrands);
            setEditItemInventoryId(""); // Clear edit mode
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };
    
    const deleteInventory = async(elem) => {
        try {
            const storageRef = ref(getStorage(), elem.image);
            await deleteObject(storageRef); // Delete the image from Firebase Storage
            await deleteDoc(doc(db, "inventory", elem.id));
            const updatedBrands = inventoriesList.filter((item) => item.id !== elem.id);
            setInventoryList(updatedBrands);
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    }

    const decreaseInventoryQuantity = async (orders) => {
        orders.forEach(async (order) => {
            const itemToUpdate = inventoriesList.find((item) => item.inventoryname === order.itemname);
            if (!itemToUpdate) return; // Item not found in the list
        
            const newQuantity = itemToUpdate.quantity - order.qty;
            if (newQuantity < 0) return; // Don't let quantity become negative
    
            try {
                const itemRef = doc(db, "inventory", itemToUpdate.id);
                await updateDoc(itemRef, { quantity: newQuantity });
            
                const updatedInventories = inventoriesList.map((item) =>
                    item.id === itemToUpdate.id ? { ...item, quantity: newQuantity } : item
                );
                setInventoryList(updatedInventories);
            } catch (error) {
                console.error("Error updating item quantity: ", error);
            }
        });
    };

    const increaseInventoryQuantity = async (orders) => {
        orders.forEach(async (order) => {
            const itemToUpdate = inventoriesList.find((item) => item.inventoryname === order.itemname);
            if (!itemToUpdate) return; // Item not found in the list
        
            const newQuantity = itemToUpdate.quantity + order.qty;
            if (newQuantity < 0) return; // Don't let quantity become negative
    
            try {
                const itemRef = doc(db, "inventory", itemToUpdate.id);
                await updateDoc(itemRef, { quantity: newQuantity });
            
                const updatedInventories = inventoriesList.map((item) =>
                    item.id === itemToUpdate.id ? { ...item, quantity: newQuantity } : item
                );
                setInventoryList(updatedInventories);
            } catch (error) {
                console.error("Error updating item quantity: ", error);
            }
        });
    };


    const value = {
        addInventory,
        updatedInventory,
        deleteInventory,
        inventoriesList,
        editItemInventoryId,
        decreaseInventoryQuantity,
        increaseInventoryQuantity,
        setEditItemInventoryId
    }

    return (
        <createInventoryContext.Provider value={value}>
            {children}
        </createInventoryContext.Provider>
    )
}

export default InventoryProvider