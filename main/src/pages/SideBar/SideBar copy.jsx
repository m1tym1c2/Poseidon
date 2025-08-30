import { useState } from 'react';
import axios from 'axios';
import TextBox from '../../components/TextBox/TextBox';
import ImageBox from '../../components/ImageBox/ImageBox';
import IDBox from '../../components/IDBox/IDBox';
import SettingBox from '../../components/SettingBox/SettingBox';
import DynamicBox from '../../components/DynamicBox/DynamicBox'; 
import LogoBox from '../../components/Submit/Logo';

function SlideBar({ setImageData }) {
    const [clip1, setClip1] = useState(['', '']);
    const [clip2, setClip2] = useState(['', '']);
    const [ocr, setOCR] = useState('');
    const [asr, setASR] = useState('');

    const [eventClip, setEventClip] = useState({ model: 'apple_clip', values: [''] });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [modelImg, setModelImg] = useState('apple_clip');
    const [videoID, setVideoID] = useState('');
    const [frameID, setFrameID] = useState('');
    const [nearBy, setNearBy] = useState('');
    const [sample, setSample] = useState('');
    const [textToTranslate, setTextToTranslate] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    const fetchFramesForVideo = async (videoID) => {
        try {
            const response = await import(`../../../../data/json/${videoID}.json`);
            return response.listImages;
        } catch (error) {
            console.error("Error fetching frames for video:", error);
            return [];
        }
    };

    const handleSearch = async () => {
        try {
            let data = null;

            // Check if videoID is provided without frameID
            if (videoID && !frameID) {
                const frames = await fetchFramesForVideo(videoID);
                data = frames.map((frame) => ({
                    frame_id: `${frame}.jpg`,
                    video_id: videoID,
                }));
                setImageData(data);
                return;
            }

            // If frameID and videoID are both provided
            if (videoID && frameID) {
                data = [{
                    frame_id: `${frameID}.jpg`,
                    video_id: videoID,
                }];
                setImageData(data);
            }

            const firstImage = selectedFiles.length > 0 ? selectedFiles[0] : null;
            if (firstImage) {
                const formData = new FormData();
                formData.append('file', firstImage);

                const image_response = await axios.post(
                    `${import.meta.env.VITE_IMAGE_RETRIEVAL_URL}?model_type=${modelImg}`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                const image_data = image_response.data.data;
                if (image_data) data = image_data;
            }

            if (clip1[0]) {
                const clip_response = await axios.post(`${import.meta.env.VITE_CLIP_TEXT_RETRIEVAL_URL}`, {
                    model_type: clip1[1],
                    text: clip1[0],
                });
                const clip_data = clip_response.data.data;
                if (clip_data) data = clip_data;
            }

            if (eventClip.values && eventClip.values.length > 0 && eventClip.values[0] !== '') {
                const requestBody = {
                    model_type: eventClip.model,
                    list_event: eventClip.values
                };
    
                const eventClipResponse = await axios.post(
                    `${import.meta.env.VITE_EVENT_CLIP_RETRIEVAL_URL}`,
                    requestBody
                );
    
                const eventClipData = eventClipResponse.data.data;
    
                if (eventClipData && eventClipData.length > 0) {
                    data = eventClipData.map(item => ({
                        frame_id: `${item.frame_id}`,
                        video_id: item.video_id
                    }));
                }
            } else {
                console.log('DynamicBox is empty');
            }
            console.log(data)

            if (clip2[0]) {
                const hybrid_response = await axios.post(`${import.meta.env.VITE_HYBRID_RETRIEVAL_URL}`, {
                    model_type: clip2[1],
                    text: clip2[0],
                });
                let hybrid_data = hybrid_response.data.data;
                if (hybrid_data) {
                    hybrid_data = hybrid_data.map(item => ({
                        ...item,
                        frame_id: `${item.frame_id}.jpg`
                    }));
                    data = hybrid_data;
                }
            }

            if (ocr) {
                const ocr_response = await axios.post(`${import.meta.env.VITE_OCR_RETRIEVAL_URL}`, {
                    text: ocr,
                });
                let ocr_data = ocr_response.data.data;
                if (ocr_data) {
                    ocr_data = ocr_data.map(item => ({
                        ...item,
                        frame_id: `${item.frame_id}.jpg`
                    }));
                    data = ocr_data;
                }
            }

            if (asr) {
                const asr_response = await axios.post(`${import.meta.env.VITE_ASR_RETRIEVAL_URL}`, {
                    text: asr,
                });
                let asr_data = asr_response.data.data;
                if (asr_data) {
                    asr_data = asr_data.map(item => ({
                        ...item,
                        frame_id: `${item.frame_id}.jpg`
                    }));
                    data = asr_data;
                }
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

    const handleTranslate = async (e) => {
        if (e.key === 'Enter') {
            try {
                // Thay thế URL của ngrok API bằng ngrok_url của bạn
                const ngrokUrl = "https://4d84-35-201-17-59.ngrok-free.app/translate"; 

                // Kiểm tra nếu văn bản không rỗng
                if (textToTranslate.trim()) {
                    const res = await fetch(ngrokUrl, {
                        method: "POST",
                        body: JSON.stringify({
                            text: textToTranslate,  // Gửi văn bản để dịch
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    const data = await res.json();
                    setTranslatedText(data.translated_text);  // Đọc và lưu kết quả dịch
                } else {
                    alert("Please enter text to translate");
                }
            } catch (error) {
                console.error('Error translating text:', error);
            }
        }
    };

    return (
        <div className="w-[20%] flex flex-col items-center">
            <LogoBox video_id="L12_V001" frame_time="12900" ans="Minh Triết nè"/>
            <input 
                type="text" 
                value={textToTranslate} 
                onChange={(e) => setTextToTranslate(e.target.value)} 
                onKeyDown={handleTranslate} 
                placeholder="Enter text to translate" 
                className="border p-1 m-2 w-full"
            />
            <textarea 
                value={translatedText} 
                readOnly 
                placeholder="Translated text will appear here" 
                className="border p-1 m-2 w-full"
            />
            <TextBox name='CLIP' state={[clip1, setClip1]} option={['apple_clip', 'original_clip', 'laion_clip']}/>
            
            {/* DynamicBox với state và option model được truyền vào */}
            <DynamicBox name='Dynamic CLIP' state={[eventClip, setEventClip]} modelOptions={['apple_clip', 'original_clip', 'laion_clip']} />
            
            <TextBox name='Hybrid' state={[clip2, setClip2]} option={['ViT-B2/16']}/>
            <TextBox name='OCR' state={[ocr, setOCR]} />
            <TextBox name='ASR' state={[asr, setASR]} />
            <ImageBox state={[selectedFiles, setSelectedFiles]} setModelImg={setModelImg}/>

            <IDBox videoState={[videoID, setVideoID]} frameState={[frameID, setFrameID]} />

            {/* <SettingBox nearByState={[nearBy, setNearBy]} sampleState={[sample, setSample]} /> */}

            <button type='submit' className='w-full border hover:bg-red-600 bg-blue-500 rounded-lg text-white p-1 m-2' onClick={handleSearch}>Search</button>
        </div>
    );
}

export default SlideBar;
