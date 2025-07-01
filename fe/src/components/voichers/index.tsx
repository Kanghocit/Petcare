import React from "react";
import Voicher from "./voicher";

const Voichers = () => {
  return (
    <div className="flex flex-wrap gap-16 justify-center items-center">
      <Voicher
        code="1234567890"
        date="2025-01-01"
        description="Mã giảm giá 10%"
        status="expired"
      />
      <Voicher
        code="1234567890"
        date="2025-01-01"
        description="Mã giảm giá 10%"
        status="expired"
      />
      <Voicher
        code="1234567890"
        date="2025-01-01"
        description="Mã giảm giá 10%"
        status="expired"
      />
      <Voicher
        code="1234567890"
        date="2025-01-01"
        description="Mã giảm giá 10%"
        status="active"
      />
    </div>
  );
};

export default Voichers;
