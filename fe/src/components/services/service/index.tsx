import { IconType } from "react-icons/lib";

type ServiceProps = {
  icon: IconType;
  name: string;
  description: string;
};

const ServiceItem = ({ icon: Icon, name, description }: ServiceProps) => (
  <div className="flex items-center space-x-3">
    <Icon className="text-3xl text-gray-300" />
    <div>
      <h4 className="font-bold text-xl">{name}</h4>
      <p>{description}</p>
    </div>
  </div>
);

export default ServiceItem;
