import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import WriteArticle from './pages/WriteArticle'
import ReviewResume from './pages/ReviewResume'
import Dashboard from './pages/Dashboard'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground1'
import RemoveObjects from './pages/RemoveObjects'

import Community from './pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import PdfSummarizer from './pages/PdfSummarizer'
import {Toaster} from 'react-hot-toast'


const App = () => {


  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}/>

        <Route path='/ai' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
          <Route path='write-article' element={<WriteArticle/>}/>
          <Route path='review-resume' element={<ReviewResume/>}/>
          <Route path='blog-titles' element={<BlogTitles/>}/>
          <Route path='generate-images' element={<GenerateImages/>}/>
          <Route path='remove-background' element={<RemoveBackground/>}/>
          <Route path='remove-objects' element={<RemoveObjects/>}/>
          <Route path='pdf-summarizer' element={<PdfSummarizer/>}/>
          <Route path='community' element={<Community/>}/>
          

        </Route>
      </Routes>
    </div>
  )
}

export default App