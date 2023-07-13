import React, { useContext, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import {  onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { authentication, db } from '../lib/firebase';
import { authCollectionRef } from '../lib/firebase-collection';

const createAccountContext = React.createContext();


export function useAccount() {
    return useContext(createAccountContext);
}

const AccountProvider = ({ children }) => {

    function generateRandomString(length) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    const [owner,setOwner] = useState(null)
    const [accountList,setAccountList] = useState(null)

    const fetchData = () => {
        getDocs(collection(db, "auth"))
        .then((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                items.push({ id: doc.id, ...data });
                // if (data.type === 'customer') {
                // }
            });
            setAccountList(items);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);
   
    


    const useAuth = () => {
        const [ currentUser, setCurrentUser ] = useState();
        useEffect(() => {
            const unsub = onAuthStateChanged(authentication, user => {
                setCurrentUser(user)
            });
            return unsub;
        }, [])
        return currentUser;
    }

    const user = useAuth();

    useEffect(() => {
        onSnapshot(authCollectionRef, (snapshot) => {
            snapshot.docs.map((it, ix) => {
                if (it.data().emailAcc === user?.email) {
                    setOwner(it.data());
                }
            });
        });
    }, [user]);

    const registerAccount = (
        uid,
        emailAcc,
        usernameAcc,
        type,
    ) => {
        setDoc(doc(db,`auth`,`${uid}`),{
            uid:uid,
            emailAcc:emailAcc,
            usernameAcc:usernameAcc,
            type:type
        },{merge:true})
        .then(res => {})
        .catch(err => {console.log(err)})

    }

    const loginAccount = async(provider,type) => {
        await signInWithPopup(authentication, provider)
        .then(res => {
            const querySnapshot = getDocs(authCollectionRef);
            querySnapshot.then(res_ => {
                if (res_.docs.some(e => e.data().emailAcc == res.user.providerData[0].email) == false) {
                    registerAccount(
                        res.user.providerData[0].email,
                        res.user.providerData[0].email,
                        res.user.displayName,
                        type,
                    )
                    return
                } 
            })
        })
        .catch(err => {console.log(err)})
    }

    const handleLogOut = () => {
        window.location.href = '/'
        return signOut(authentication)
    }

    const deleteAccount = async (uid) => {
        // Delete the document from the 'auth' collection
        await deleteDoc(doc(db, 'auth', uid));
    }
    
    const updateAccount = async (uid, emailAcc, usernameAcc, type) => {
        // Update the document in the 'auth' collection
        await updateDoc(doc(db, 'auth', uid), {
            emailAcc,
            usernameAcc,
            type
        });
        fetchData()
    }

    const value = {
        user,
        owner,
        setOwner,
        handleLogOut,
        registerAccount,
        loginAccount,
        generateRandomString,
        accountList,
        setAccountList,
        deleteAccount,
        updateAccount
    }

    return (
        <createAccountContext.Provider value={value}>
            {children}
        </createAccountContext.Provider>
    )
}

export default AccountProvider