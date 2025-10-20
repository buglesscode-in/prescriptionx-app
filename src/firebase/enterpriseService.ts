// src/firebase/enterpriseService.ts

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

// --- 2. READ ALL ENTERPRISES (MODIFIED QUERY LOGIC) ---
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

// --- 3. CREATE A NEW ENTERPRISE (CRITICAL FIX APPLIED) ---
export async function createEnterprise(data: Omit<EnterpriseData, 'id'>): Promise<string> {
  try {
    // 💥 FIX: Explicitly add isDeleted: false to the new document 💥
    const dataToCreate = {
      ...data,
      isDeleted: false,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToCreate);
    return docRef.id;
  } catch (error) {
    console.error('Error creating new enterprise:', error);
    throw new Error('Failed to create new enterprise.');
  }
}

// --- 4. UPDATE AN EXISTING ENTERPRISE (No Change) ---
export async function updateEnterprise(id: string, data: EnterpriseData): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // setDoc overwrites the existing document with the new data
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Error updating enterprise:', error);
    throw new Error('Failed to update enterprise.');
  }
}

// --- 5. SOFT DELETE AN ENTERPRISE (No Change) ---
export async function softDeleteEnterprise(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);

    // Update the document to mark it as logically deleted
    await updateDoc(docRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(), // Record when it was deleted
    });
  } catch (error) {
    console.error('Error soft-deleting enterprise:', error);
    throw new Error('Failed to soft-delete enterprise profile.');
  }
}
