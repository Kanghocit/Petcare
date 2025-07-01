import React from "react";
import { App } from "antd";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <App>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-100 to-blue-100 font-[Quicksand]">
        {children}
      </div>
    </App>
  );
};

export default AuthLayout;
