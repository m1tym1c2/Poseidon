import { useState, useEffect, useRef } from "react";
import NearbyList from "../NearbyList/NearbyList";
import loginDres from '../Submit/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageDetail = ({ video_id, frame_id, setNearbyScreenInfo }) => {
    const closeImage = () => {
        setNearbyScreenInfo(null);
    };

    const [currentFrame, setCurrentFrame] = useState(frame_id);
    const [fps, setFps] = useState(25);
    const [keyframeId, setKeyframeId] = useState('');
    const videoRef = useRef(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [ans, setAns] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [evaluationId, setEvaluationId] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [keyframesData, setKeyframesData] = useState([]);
    const [fpsData, setFpsData] = useState([]);
    const [youtubeData, setYoutubeData] = useState([]);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState('');

    const frameToTime = (frame) => frame / fps;
    const timeToFrame = (time) => Math.floor(time * fps);

    const handleImageError = (e) => {
        e.target.src = `${import.meta.env.VITE_KEYFRAME_ERROR_URL}/${video_id}/${currentFrame}.jpg`;
    };

    // Hàm xác định kích thước ảnh
    const handleImageLoad = (e) => {
        const img = e.target;
        setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
        });
    };

    // Fetch dữ liệu keyframe_id, fps và youtube URL từ JSON sử dụng import
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Import keyframe_id data
                const keyframeResponse = await import(`../../../../data/keyframe_id/${video_id}.json`);
                setKeyframesData(keyframeResponse.default?.listImages || []);
                
                // Import fps data
                const fpsResponse = await import(`../../../../data/fps/${video_id}.json`);
                setFpsData(fpsResponse.default?.listImages || []);
                
                // Import youtube URL data
                const youtubeResponse = await import(`../../../../data/video/${video_id}.json`);
                setYoutubeData(youtubeResponse.default?.listImages || []);
                
                // Lấy URL YouTube đầu tiên (nếu có)
                if (youtubeResponse.default?.listImages?.length > 0) {
                    setYoutubeUrl(youtubeResponse.default.listImages[0]);
                }
            } catch (error) {
                console.error("Error loading JSON data:", error);
            }
        };

        if (video_id) {
            fetchData();
        }
    }, [video_id]);

    // Cập nhật keyframe_id và fps khi currentFrame thay đổi
    useEffect(() => {
        if (keyframesData.length > 0 && fpsData.length > 0) {
            const frameIndex = parseInt(currentFrame, 10) - 1;
            
            if (frameIndex >= 0 && frameIndex < keyframesData.length) {
                setKeyframeId(keyframesData[frameIndex]);
            }
            
            if (frameIndex >= 0 && frameIndex < fpsData.length) {
                setFps(fpsData[frameIndex]);
            }
        }
    }, [currentFrame, keyframesData, fpsData]);

    // Cập nhật YouTube embed URL khi currentFrame hoặc youtubeUrl thay đổi
    useEffect(() => {
        if (youtubeUrl) {
            const videoId = extractYoutubeVideoId(youtubeUrl);
            if (videoId) {
                // Sửa lỗi: sử dụng currentFrame thay vì keyframeId
                const timeInSeconds = frameToMilliseconds(keyframeId, fps) / 1000;
                const newEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${Math.floor(timeInSeconds)}&mute=1`;
                setYoutubeEmbedUrl(newEmbedUrl);
            }
        }
    }, [currentFrame, fps, youtubeUrl, keyframeId]); // Thêm keyframeId vào dependencies

    const submitAnswer = () => {
        if (!sessionId || !evaluationId) {
            console.error("Session ID or Evaluation ID is missing");
            return;
        }

        // Sửa lỗi: sử dụng currentFrame thay vì keyframeId
        const videoCurrentTimeMs = frameToMilliseconds(keyframeId, fps);
        const url = `https://eventretrieval.one/api/v2/submit/${evaluationId}?session=${sessionId}`;
        
        const body = ans ? {
            answerSets: [{
                answers: [{
                    text: `${ans}-${video_id}-${videoCurrentTimeMs}`
                }]
            }]
        } : {
            answerSets: [{
                answers: [{
                    mediaItemName: video_id,
                    start: videoCurrentTimeMs,
                    end: videoCurrentTimeMs
                }]
            }]
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 412) {
                    toast.error("NỘP TRÙNG");
                    throw new Error('Precondition Failed: Missing required temporal information.');
                }
                toast.error("LỖI");
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status) {
                if (data.submission === 'WRONG') {
                    toast.error("SAI");
                } else {
                    toast.success("ĐÚNG");
                }
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    };

    useEffect(() => {
        const updateCurrentTime = () => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
            }
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', updateCurrentTime);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('timeupdate', updateCurrentTime);
            }
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeImage();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const toggleFps = () => {
        setFps((prevFps) => (prevFps === 25 ? 30 : 25));
    };

    const convertCurrentTimeToFrame = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const frameID = timeToFrame(currentTime);
            console.log(`Frame ID at ${currentTime} seconds (FPS: ${fps}): ${frameID}`);
            alert(`Frame ID: ${frameID}`);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    function frameToMilliseconds(frameId, fps) {
        return Math.floor((parseInt(frameId, 10) * 1000) / fps);
    }

    // Xác định class cho ảnh dựa trên tỷ lệ khung hình
    const getImageClass = () => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) {
            return "max-w-[45%] max-h-full object-contain mb-5";
        }
        
        const aspectRatio = imageDimensions.width / imageDimensions.height;
        
        // Nếu ảnh dọc (chiều cao > chiều rộng)
        if (aspectRatio < 1) {
            return "max-h-[300px] max-w-full object-contain mb-5";
        }
        
        // Nếu ảnh ngang
        return "max-w-[45%] max-h-full object-contain mb-5";
    };

    // Hàm trích xuất video ID từ URL YouTube
    const extractYoutubeVideoId = (url) => {
        if (!url) return null;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-2xl">
            <div className="bg-white rounded flex flex-col text-center items-center w-2/3 h-4/5 overflow-y-auto p-4">
                <p className="my-2 text-lg">
                    {video_id}, Frame: {currentFrame}, Time: {frameToMilliseconds(keyframeId, fps)}ms, 
                    Keyframe: {keyframeId}, FPS: {fps}
                </p>

                <div className="w-full flex flex-row p-2 justify-around items-stretch h-[350px]">
                    <img
                        src={`${import.meta.env.VITE_KEYFRAME_URL}/${video_id}/${currentFrame}.jpg`}
                        alt="Detailed view"
                        className={getImageClass()}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                    />
                    
                    {youtubeEmbedUrl && (
                        <div className="w-[45%] h-full mb-5">
                            <iframe
                                key={youtubeEmbedUrl} // Thêm key để force re-render khi URL thay đổi
                                width="100%"
                                height="100%"
                                src={youtubeEmbedUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </div>

                <NearbyList
                    video_id={video_id}
                    frame_id={currentFrame}
                    setCurrentFrame={setCurrentFrame}
                />

                <div className="flex w-full mt-4 items-center justify-center">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="mr-4 text-lg">
                            Thời gian: {formatTime(currentTime)}
                        </div>
                        <input
                            type="text"
                            placeholder="Answer (optional)"
                            value={ans}
                            onChange={(e) => setAns(e.target.value)}
                            className="py-2 px-4 border border-gray-500 max-w-xs"
                        />
                        <button
                            onClick={submitAnswer}
                            className="py-2 px-4 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Submit Answer
                        </button>
                    </div>
                </div>

                <div className="flex space-x-4 mt-4">
                    <button
                        onClick={toggleFps}
                        className="py-2 px-4 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                    >
                        {fps === 25 ? "Switch to 30 FPS" : "Switch to 25 FPS"}
                    </button>

                    <button
                        onClick={convertCurrentTimeToFrame}
                        className="py-2 px-4 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                    >
                        Convert Current Time to Frame ID
                    </button>

                    <button
                        onClick={closeImage}
                        className="py-2 px-4 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        Close
                    </button>
                </div>

                <ToastContainer />
            </div>
        </div>
    );
};

export default ImageDetail;