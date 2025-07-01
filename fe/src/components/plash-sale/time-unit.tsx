type TimeUnitProps = {
  value: number;
  label: string;
};

const TimeUnit = ({ value, label }: TimeUnitProps) => {
  const paddedValue = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center bg-yellow-400 rounded-md px-3 py-2 w-[60px]">
      <span className="text-3xl font-bold text-black">{paddedValue}</span>
      <span className="text-xl text-black">{label}</span>
    </div>
  );
};

export default TimeUnit;
