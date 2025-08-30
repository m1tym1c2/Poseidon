import { useState } from 'react'
import './App.css'

import SlideBar from './pages/SideBar/SideBar'
import TabBar from './pages/TabBar/TabBar'
import ImageTab from './pages/ImageTab/ImageTab'

function App() {

  const [activeTab, setActiveTab] = useState('Search Tab')
  const [imageData, setImageData] = useState([]);

  return (
    <>
      <div className='flex flex-row'>
        <SlideBar setImageData={setImageData} />
        <div className='flex flex-col w-[80%]'>
          <TabBar tabState = {[activeTab, setActiveTab]}/>
          <ImageTab imageData={imageData} />
        </div>
      </div>
      
    </>
  )
}

export default App