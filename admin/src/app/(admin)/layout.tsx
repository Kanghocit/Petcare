"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/components/tables/layout/AppHeader";
import AppSidebar from "@/components/tables/layout/AppSidebar";
import Backdrop from "@/components/tables/layout/Backdrop";
import React from "react";
import { App } from "antd";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <App>
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="mx-auto max-w-(--breakpoint-2xl) p-4 pt-24 md:p-6">
            {children}
          </div>
        </div>
      </div>
    </App>
  );
}
