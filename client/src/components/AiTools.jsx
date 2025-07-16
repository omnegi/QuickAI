import { AiToolsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const AiTools = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    return (
        <motion.div 
            className='px-4 sm:px-20 xl:px-32 my-24'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.4 }} // Animate on every scroll
        >
            <motion.div 
                className='text-center'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: false, amount: 0.4 }} // Animate on every scroll
            >
                <h2 className='text-slate-700 text-[42px] font-semibold'>Powerful AI tools</h2>
                <p className='text-gray-500 max-w-lg mx-auto'>
                    Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
                </p>
            </motion.div>

            <div className='flex flex-wrap justify-center mt-10 gap-6'>
                {AiToolsData.map((tool, index) => (
                    <motion.div
                        key={index}
                        className='p-8 m-4 max-w-xs shadow-lg rounded-lg bg-[#FDFDFE] border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer'
                        onClick={() => user && navigate(tool.path)}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: false, amount: 0.4 }} // Animate on every scroll
                    >
                        <tool.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{ background: `linear-gradient(to bottom,${tool.bg.from},${tool.bg.to})` }} />
                        <h3 className='mt-6 mb-3 text-lg font-semibold'>{tool.title}</h3>
                        <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default AiTools;
