import React from "react";

import { VoicherInterface } from "@/interface/voicher";
import Voicher from "./voicher";

interface VoichersProps {
  voichersData?: { voichers?: VoicherInterface[] };
}

const Voichers: React.FC<VoichersProps> = ({ voichersData }) => {
  const voicherData = voichersData?.voichers || [];

  return (
    <div className="flex flex-wrap gap-16 justify-center items-center">
      {voicherData.map((item: VoicherInterface) => (
        <div key={item._id}>
          <Voicher
            code={item.code}
            date={item.endDate}
            description={item.name}
            status={item.status}
          />
        </div>
      ))}
    </div>
  );
};

export default Voichers;
