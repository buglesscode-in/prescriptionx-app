import { db } from './config';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { TemplateData } from '@/interfaces/template';

const TEMPLATES_COLLECTION = "templates";

// --- CREATE ---
/**
 * Adds a new medication template to Firestore.
 * @param {object} params
 * @param {string} params.templateName - The name of the template.
 * @param {Array<Medication>} params.medications - The array of medication objects.
 * @param {string} params.userUid - The UID of the user creating the template.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const addTemplate = async ({ templateName, medications, userUid }) => {
    try {
        const dataToSave = {
            templateName,
            medications,
            createdByUid: userUid,
            isDeleted: false,
            createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, TEMPLATES_COLLECTION), dataToSave);
        return docRef.id;
    } catch (error) {
        console.error("Error adding template: ", error);
        throw new Error("Failed to save template.");
    }
};

// --- READ (List) ---
/**
 * Fetches all templates created by a specific user.
 * @param {string} userUid - The UID of the user.
 * @returns {Promise<Array<object>>} An array of template objects, each with its Firestore ID.
 */
export const getUserTemplates = async (userUid) => {
    try {
        const templatesRef = collection(db, TEMPLATES_COLLECTION);
        const q = query(
            templatesRef,
            where("createdByUid", "==", userUid),
            where("isDeleted", "==", false),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const templates = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as TemplateData[];

        return templates;
    } catch (error) {
        console.error("Error fetching templates: ", error);
        throw new Error("Failed to fetch templates.");
    }
};

// --- UPDATE ---
/**
 * Updates an existing medication template.
 * @param {string} templateId - The Firestore document ID of the template to update.
 * @param {object} dataToUpdate - An object containing the fields to update 
 * (e.g., { templateName: "New Name", medications: [...] }).
 */
export const updateTemplate = async (templateId, dataToUpdate) => {
    try {
        const templateDocRef = doc(db, TEMPLATES_COLLECTION, templateId);
        await updateDoc(templateDocRef, {
            ...dataToUpdate,
            updatedAt: serverTimestamp(), // Good practice to track updates
        });
    } catch (error) {
        console.error("Error updating template: ", error);
        throw new Error("Failed to update template.");
    }
};

// --- DELETE ---
/**
 * Deletes a medication template from Firestore.
 * @param {string} templateId - The Firestore document ID of the template to delete.
 */
export const deleteTemplate = async (templateId) => {
    try {
        const templateDocRef = doc(db, TEMPLATES_COLLECTION, templateId);
        await updateDoc(templateDocRef, {
            isDeleted: true,
            deletedAt: serverTimestamp(), // Record when it was deleted
        });
    } catch (error) {
        console.error("Error deleting template: ", error);
        throw new Error("Failed to delete template.");
    }
};