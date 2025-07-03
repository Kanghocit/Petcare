import React, { useState } from "react";
import { Drawer } from "antd";

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const cart = [];

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="cursor-pointer" onClick={showDrawer}>
        {children}
      </div>
      <Drawer
        title="Giỏ hàng"
        closable={false}
        onClose={onClose}
        open={open}
        placement="right"
      >
        {cart.length < 1 ? (
          <div>
            <p>Giỏ hàng trống</p>
          </div>
        ) : (
          <div>
            <p>Giỏ hàng không trống</p>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default App;
