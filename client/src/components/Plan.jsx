import React from 'react';
import { PricingTable } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Plan = () => {
  return (
    <motion.div
      className='max-w-2xl mx-auto z-20 my-30'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.4 }}
    >
      <motion.div
        className='text-center'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: false, amount: 0.4 }}
      >
        <h2 className='text-slate-700 text-[42px] font-semibold'>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </motion.div>

      <motion.div
        className='mt-14 max-sm:mx-8'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.4 }}
      >
        <PricingTable />
      </motion.div>
    </motion.div>
  );
};

export default Plan;
