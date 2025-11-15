export type Page = 'home' | 'about' | 'contact' | 'admin' | 'verifier' | 'deleteDocs';

export interface BlockchainRecord {
    docName: string;
    uploader: string;
    timestamp: string;
    docHash: string;
}

export type VerificationStatus = 'Genuine' | 'Fake' | 'Error';

export interface VerificationResult {
    status: VerificationStatus;
    record: BlockchainRecord | null;
    message: string;
}
