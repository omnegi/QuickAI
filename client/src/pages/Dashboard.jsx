import React, { useEffect, useState } from 'react'
import { Gem, Sparkles } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItems from '../components/CreationItems';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Dashboard = () => {
  const [creations,setCreations]=useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const{ data } = await axios.get('/api/user/get-user-creation',{
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setCreations(data.creation);
      } else {
        toast.error(data.message);
      } 
      
    } catch (error) {
      toast.error(error.message);      
    }
    setLoading(false);
  }
  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className='p-6 h-full overflow-y-scroll'>
      <div className='flex justify-start gap-4 flex-wrap'>


        <div className='bg-white p-4 rounded-xl flex justify-between items-center w-72 px-6 border border-gray-200 '>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
            </div> 
          <div className='w-10 h-10 bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] rounded-lg flex items-center justify-center'>
            <Sparkles className='w-5  text-white'/>
            </div>       
         </div>


          <div className='bg-white p-4 rounded-xl flex justify-between items-center w-72 px-6 border border-gray-200 '>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='premium' fallback='Free'>Premium</Protect>
            </h2>
            </div> 
          <div className='w-10 h-10 bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] rounded-lg flex items-center justify-center'>
            <Gem className='w-5  text-white'/>
            </div>       
         </div>


      </div>

      {
        loading ? (
          <div className='flex justify-center items-center h-3/4 '>
            <div  className='w-11 h-11  rounded-full border-3  border-purple-500 border-t-transparent animate-spin'></div>
            
          </div>
        ) : (
          <div className='space-y-3'>
            <p className='mt-6 mb-4'>Recent Creations</p>
           
              {
                creations.map((item) => <CreationItems key={item.id} item={item} />)
              }
           
          </div>
        )
      }



    </div>
  )
}

export default Dashboard