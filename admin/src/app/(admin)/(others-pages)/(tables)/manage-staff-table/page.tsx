import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ModalAddStaff from "./ModalAddStaff";
import { Metadata } from "next";
import SearchStaff from "./SearchStaff";
import ManageStaffTable from "@/components/tables/ManageStaffTable";
import { GetAllUsersAction } from "../manage-customer-table/action";


export const metadata: Metadata = {
    title: "Kangdy Admin | Staffs ",
    description: "Kangdy",
};

const ManageStaffTablePage = async ({
    searchParams,
}: {
    searchParams: Promise<{ page: number; search: string }>;
}) => {
    const { page, search } = await searchParams;
    const staffsData = await GetAllUsersAction("staff", Number(page), search);

    return (
        <>
            <PageBreadcrumb pageTitle="Danh sách nhân viên" />
            <div className="space-y-6">
                <ComponentCard
                    title="Quản lí nhân viên"
                    subHeader={
                        <div className="flex items-center justify-between gap-2">
                            <ModalAddStaff />
                            <SearchStaff />
                        </div>
                    }
                >
                    <ManageStaffTable staffs={staffsData} />
                </ComponentCard>
            </div>
        </>
    );
};

export default ManageStaffTablePage;
