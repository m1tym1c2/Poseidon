import { useState } from 'react';
import axios from 'axios';
import TextBox from '../../components/TextBox/TextBox';
import LogoBox from '../../components/Submit/Logo';

function SlideBar({ setImageData }) {
    const [clip, setClip] = useState(['', '']);

    const handleSearch = async () => {
        try {
            let data = null;
            if (clip[0]) {
                const clip_response = await axios.post(`${import.meta.env.VITE_CLIP_TEXT_RETRIEVAL_URL}`, {
                    "text": clip[0],
                    "top_k": 500
                });
                const clip_data = clip_response.data.data;
                if (clip_data) data = clip_data;
            }

            if (data) {
                setImageData(data);
            } else {
                console.log("No data found");
            }

        } catch (error) {
            console.error('There was an error during search!', error);
        }
    };

    return (
        <div className="w-[20%] flex flex-col items-center">
            <LogoBox video_id="L12_V001" frame_time="12900" ans="Minh Triết nè"/>

            <TextBox name='CLIP' state={[clip, setClip]} option={['apple_clip', 'original_clip', 'laion_clip']}/>

            <button type='submit' className='w-full border hover:bg-red-600 bg-blue-500 rounded-lg text-white p-1 m-2' onClick={handleSearch}>Search</button>
        </div>
    );
}

export default SlideBar;
