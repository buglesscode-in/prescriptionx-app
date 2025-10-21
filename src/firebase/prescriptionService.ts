import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    addDoc,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// --- 1. INTERFACE DEFINITION (No Change) ---
export interface EnterpriseData {
    id?: string;
    hospitalName: string;
    address: string;
    doctorName: string;
    licenseNumber: string;
    createdByUid: string;
    logoUrl?: string;

    // Soft Delete Fields
    isDeleted?: boolean;
    deletedAt?: Timestamp | null;
}

const COLLECTION_NAME = 'enterprises';

// --- 1. READ ALL ENTERPRISES (MODIFIED QUERY LOGIC) ---
export async function getEnterprisesByUid(uid: string): Promise<EnterpriseData[]> {
    const collectionRef = collection(db, COLLECTION_NAME);

    // 💥 CORRECTED QUERY LOGIC 💥
    // We use "==" false because every new document will now explicitly have isDeleted: false.
    // This is the most reliable way to filter active items.
    const q = query(collectionRef, where('createdByUid', '==', uid), where('isDeleted', '==', false));

    try {
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                }) as EnterpriseData
        );
    } catch (error) {
        console.error('Error reading enterprise list:', error);
        // Note: If you run this query and the data exists but the index is building,
        // it will throw a FirebaseError.
        throw new Error('Failed to load enterprise list.');
    }
}
