import React from "react";

import { getAllVoichers } from "@/libs/voicher";
import { VoicherInterface } from "@/interface/voicher";
import Voicher from "./voicher";

const Voichers = async () => {
  const data = await getAllVoichers(4);
  const voicherData = data.voichers;

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
