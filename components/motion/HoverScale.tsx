"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function HoverScale({ children, className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.965 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={className ?? "inline-block"}
      {...props}
    >
      {children}
    </motion.div>
  );
}
