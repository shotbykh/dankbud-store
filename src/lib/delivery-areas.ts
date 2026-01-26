// Delivery Area Configuration for Port Elizabeth

// BLOCKED: Hard block - no delivery possible
export const BLOCKED_AREAS = [
    'motherwell',
    'kwazakhele',
    'new brighton',
    'zwide',
    'kwanobuhle',
    'kwadwesi'
];

// REVIEW REQUIRED: Order held for admin approval
export const REVIEW_AREAS = [
    'gelvandale',
    'helenvale',
    'bethelsdorp',
    'schauderville',
    'holland park',
    'korsten',
    'north end',
    'sidwell',
    'kensington'
];

export type DeliveryAreaStatus = 'allowed' | 'blocked' | 'review';

export function checkDeliveryArea(suburb: string): DeliveryAreaStatus {
    const normalized = suburb.toLowerCase().trim();
    
    if (BLOCKED_AREAS.some(area => normalized.includes(area))) {
        return 'blocked';
    }
    
    if (REVIEW_AREAS.some(area => normalized.includes(area))) {
        return 'review';
    }
    
    return 'allowed';
}

export function getDeliveryAreaMessage(status: DeliveryAreaStatus): string {
    switch (status) {
        case 'blocked':
            return '⛔ Sorry, we cannot deliver to this area. Please choose PUDO or Collection.';
        case 'review':
            return '⚠️ Delivery to this area requires approval. We will confirm within 30 minutes.';
        default:
            return '';
    }
}
