import {
    Timestamp,
} from 'firebase/firestore';

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