import React from 'react';
import { useState, useEffect } from "react";
import ImageDetail from "../../components/ImageDetail/ImageDetail";

const ImageTab = ({ imageData }) => {
  const [NearbyScreenInfo, setNearbyScreenInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openImage = (img) => {
    setNearbyScreenInfo({
      video_id: img.video_id,
      frame_id: img.frame_id.replace('.jpg', ''),
    });
  };

  const handleImageError = (e, img) => {
    e.target.src = `${import.meta.env.VITE_KEYFRAME_ERROR_URL}/${img.video_id}/${img.frame_id}.jpg`;
  };

  useEffect(() => {
  }, [NearbyScreenInfo]);

  return (
    <div className='w-full max-h-[95vh] overflow-y-scroll flex flex-wrap justify-start relative h-full'>
      {imageData.map((img, index) => (
        <div key={index} className='w-[12.5%] border flex justify-center items-center'>
          <img 
            src={`${import.meta.env.VITE_KEYFRAME_URL}/${img.video_id}/${img.frame_id}.jpg`} 
            alt={`Frame ${index}`} 
            className="max-w-full h-auto cursor-pointer"
            onClick={() => openImage(img)}
            // onError={(e) => handleImageError(e, img)} 
          />
        </div>
      ))}
      {NearbyScreenInfo && 
        <ImageDetail
          video_id={NearbyScreenInfo.video_id}
          frame_id={NearbyScreenInfo.frame_id}
          setNearbyScreenInfo={setNearbyScreenInfo}
        />
      }  
    </div>
  );
};

export default ImageTab;
