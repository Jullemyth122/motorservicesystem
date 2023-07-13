import { collection } from "firebase/firestore";
import { db } from './firebase'

export const authCollectionRef = collection(db,'auth')
export const orderRef = collection(db,'order')
