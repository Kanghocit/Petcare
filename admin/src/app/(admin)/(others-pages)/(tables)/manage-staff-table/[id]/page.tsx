import { Metadata } from 'next';
import React from 'react'
import { GetUserByIdAction } from '../../manage-customer-table/action';
import StaffInfoCard from '@/components/user-profile/StaffInfoCard';

export const metadata: Metadata = {
    title: "Kangdy Admin |",
    description: "Kangdy",
    // other metadata
};

const StaffDetail = async ({ params }: { params: Promise<{ id: string }> }) => {

    const { id } = await params
    const customer = await GetUserByIdAction(id);

    return (
        <div className="space-y-6">
            <StaffInfoCard user={customer.user} />
        </div>
    )
}

export default StaffDetail
