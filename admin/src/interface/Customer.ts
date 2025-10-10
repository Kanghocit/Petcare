export interface Customer {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    username?: string;
    phone: string;
    address: any[];
    createdAt: string;
    status: string;
    isVerified?: boolean;
    rank: string;
    total_spend?: number;
    userLevel?: string;
    note: string;
}

export interface Staff {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    username?: string;
    phone: string;
    createdAt: string;
    status: string;

    note: string;
}