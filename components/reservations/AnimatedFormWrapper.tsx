import { ReactNode } from "react";
import { motion } from "framer-motion";

type FormWrapperProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const formVariants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      ease: "easeOut",
    },
  },
};

const AnimatedFormWrapper = ({
  title,
  description,
  children,
}: FormWrapperProps) => {
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
        <p className="text-sm md:text-base">{description}</p>
      </div>
      {children}
    </motion.div>
  );
};

export default AnimatedFormWrapper;
