import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'
    >

      <motion.div
        className='text-center mb-6'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Create amazing content <br /> with{' '}
          <motion.span
            className='text-primary inline-block'
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.6 }}
          >
            AI Tools
          </motion.span>
        </motion.h1>

        <motion.p
          className='mt-4 max-w-xs sm:max-w-xl m-auto max-sm:text-xs text-gray-600'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Transform your content creation with our suite of premium AI tools. Write articles, generate images and enhance your workflow.
        </motion.p>
      </motion.div>

      <motion.div
        className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/ai')}
          className='bg-primary text-white px-10 py-3 rounded-lg transition cursor-pointer'
        >
          Start creating now
        </motion.button>
      </motion.div>

      <motion.div
        className='flex items-center mx-auto gap-4 text-gray-500 mt-8'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
{/*         <img src={assets.user_group} alt='user group' className='h-8' />
        Trusted by 1k+ people */}
      </motion.div>
    </motion.div>
  );
};

export default Hero;
