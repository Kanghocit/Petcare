import { SERVICES } from "@/constants/services";
import React from "react";
import ServiceItem from "./service";

const Services = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 justify-items-center py-14 px-6 me-8 ">
      {SERVICES.map((service) => (
        <ServiceItem
          key={service.id}
          icon={service.icon}
          name={service.name}
          description={service.description}
        />
      ))}
    </div>
  );
};

export default Services;
