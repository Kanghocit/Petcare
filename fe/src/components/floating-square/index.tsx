"use client";

import { motion } from "framer-motion";
import React from "react";

interface FloatingSquareProps {
  delay?: number;
  position?: React.CSSProperties;
  size?: number;
  opacity?: number;
  zIndex?: number;
}

const FloatingSquare: React.FC<FloatingSquareProps> = ({
  delay = 0,
  position = {},
  size = 120,
  opacity = 0.15,
  zIndex = 10,
}) => {
  return (
    <motion.div
      className="absolute bg-blue-400 rounded-xl backdrop-blur-md"
      style={{
        width: size,
        height: size,
        opacity: opacity * 2,
        zIndex,
        ...position,
      }}
      initial={{ y: 0 }}
      animate={{ y: [0, -20, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

export default FloatingSquare;
