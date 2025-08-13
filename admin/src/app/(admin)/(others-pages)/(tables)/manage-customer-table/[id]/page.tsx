import { Metadata } from 'next';
import React from 'react'
import { GetUserByIdAction } from '../action';
import UserInfoCard from '@/components/user-profile/UserInfoCard';

export const metadata: Metadata = {
    title: "Petcare Admin ",
    description: "Petcare",
    // other metadata
  };

const CustomerDetail = async ({params} : {params: {id: string}}) => {

    const {id } = await params
    const customer = await GetUserByIdAction(id);

  return (
    <div className="space-y-6">
      <UserInfoCard user={customer.user}/>
    </div>
  )
}

export default CustomerDetail
