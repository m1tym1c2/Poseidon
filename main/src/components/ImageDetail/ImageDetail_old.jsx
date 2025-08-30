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
    const videoRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState(`${import.meta.env.VITE_VIDEO_URL}/${video_id}.mp4`);
    const [ans, setAns] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [evaluationId, setEvaluationId] = useState('');
    const [currentTime, setCurrentTime] = useState(0);

    const frameToTime = (frame) => frame / fps;
    const timeToFrame = (time) => Math.floor(time * fps);

    const handleVideoError = () => {
        setVideoSrc(`${import.meta.env.VITE_VIDEO_ERROR_URL}/${video_id}.mp4`);
    };

    const handleImageError = (e) => {
        e.target.src = `${import.meta.env.VITE_KEYFRAME_ERROR_URL}/${img.video_id}/${img.frame_id}.jpg`;
    };

    const submitAnswer = () => {
        if (!sessionId || !evaluationId) {
            console.error("Session ID or Evaluation ID is missing");
            return;
        }

        const videoCurrentTimeMs = videoRef.current ? videoRef.current.currentTime * 1000 : 0;
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

    // useEffect(() => {
    //     loginDres(setSessionId, setEvaluationId);
    // }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [videoSrc]);

    useEffect(() => {
        if (videoRef.current) {
            const timeInSeconds = frameToTime(currentFrame);
            videoRef.current.currentTime = timeInSeconds;
        }
    }, [currentFrame, fps]);

    useEffect(() => {
        const updateCurrentTime = () => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
            }
        };

        videoRef.current?.addEventListener('timeupdate', updateCurrentTime);

        return () => {
            videoRef.current?.removeEventListener('timeupdate', updateCurrentTime);
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
        return Math.floor((frameId * 1000) / fps);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-2xl">
            <div className="bg-white rounded flex flex-col text-center items-center w-2/3 h-4/5">
                <p className="my-2 text-lg">{video_id}, {currentFrame}, {frameToMilliseconds(currentFrame, fps)}</p>

                <div className="w-full flex flex-row p-2 justify-around items-stretch h-[350px]">
                    {/* <video
                        key={videoSrc}
                        ref={videoRef}
                        controls
                        className="w-[45%] h-full object-cover mb-5"
                    onError={handleVideoError}
                    >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                    </video> */}

                    <img
                        src={`${import.meta.env.VITE_KEYFRAME_URL}/${video_id}/${currentFrame}.jpg`}
                        alt="Detailed view"
                        className="w-[45%] h-full object-cover mb-5"
                        onError={handleImageError}
                    />
                </div>


                <NearbyList
                    video_id={video_id}
                    frame_id={currentFrame}
                    setCurrentFrame={setCurrentFrame}
                />

                <div className="flex w-full mt-4 items-center">
                    <div className="flex-1 flex items-center justify-center space-x-3">
                        <div className="mr-4 text-lg">
                            Thời gian: {formatTime(currentTime)}
                        </div>
                        <input
                            type="text"
                            placeholder="Answer (optional)"
                            value={ans}
                            onChange={(e) => setAns(e.target.value)}
                            className="flex-grow py-2 px-4 border border-gray-500 max-w-xs"
                        />
                        <button
                            onClick={submitAnswer}
                            className="py-2 px-4 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Submit Answer
                        </button>
                    </div>
                    
                </div>

                <button
                    onClick={toggleFps}
                    className="mt-4 py-2 px-4 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                >
                    {fps === 25 ? "Switch to 30 FPS" : "Switch to 25 FPS"}
                </button>

                <button
                    onClick={convertCurrentTimeToFrame}
                    className="mt-4 py-2 px-4 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                >
                    Convert Current Time to Frame ID
                </button>

                <button
                    onClick={closeImage}
                    className="mt-4 py-2 px-4 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                >
                    Close
                </button>

                <ToastContainer />
            </div>
        </div>
    );
};



export default ImageDetail;
