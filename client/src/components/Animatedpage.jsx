import React from 'react'

import { motion, AnimatePresence} from 'framer-motion'

const animations = {
    initial: { opacity: 0, },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0.5 },
}

const Animatedpage = ({ children }) => {
  return (
    <motion.div 
        variants={animations}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 1 }} >
        {children}
        </motion.div>
  );
};

export default Animatedpage