"use client";

import { useEffect, useState } from "react";
import TimeUnit from "./time-unit";

type CountdownTimerProps = {
  endTime: Date | string; // có thể truyền string ISO
};

const CountdownTimer = ({ endTime }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Chuẩn hoá chuỗi thời gian: nếu thiếu timezone thì coi như UTC
  const normalizeEndTime = (value: Date | string): number => {
    if (value instanceof Date) return value.getTime();
    if (typeof value === "string") {
      const hasTimezone = /([zZ])|([+\-]\d{2}:\d{2})$/.test(value);
      const iso = hasTimezone ? value : `${value}Z`;
      const t = new Date(iso).getTime();
      return Number.isNaN(t) ? 0 : t;
    }
    return 0;
  };

  useEffect(() => {
    const end = normalizeEndTime(endTime);
    if (!end) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalHours = Math.floor(distance / (1000 * 60 * 60));
      const remainingMsAfterHours = distance - totalHours * 60 * 60 * 1000;
      const minutes = Math.floor((remainingMsAfterHours / (1000 * 60)) % 60);
      const seconds = Math.floor((remainingMsAfterHours / 1000) % 60);

      setTimeLeft({
        hours: totalHours,
        minutes,
        seconds,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex gap-2 p-4 rounded-lg">
      <TimeUnit value={timeLeft.hours} label="Giờ" />
      <TimeUnit value={timeLeft.minutes} label="Phút" />
      <TimeUnit value={timeLeft.seconds} label="Giây" />
    </div>
  );
};

export default CountdownTimer;
