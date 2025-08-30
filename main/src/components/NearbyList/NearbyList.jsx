import React, { useState, useEffect } from "react";

const NearbyList = ({ video_id, frame_id, setCurrentFrame }) => {
    const [listFrame, setListFrame] = useState([]);

    const changeCurrentFrame = (currentFrame) => {
        setCurrentFrame(currentFrame);
    };

    const getList = async () => {
        try {
            if (video_id) {
                // Import JSON file dynamically
                console.log(video_id)
                const content = await import(`../../../../data/jsons/${video_id}.json`);
                console.log("Content:", content.listImages);
                // Set listFrame with listImages if it exists, otherwise set to an empty array
                setListFrame(content.default?.listImages || content.listImages || []);
            }
        } catch (error) {
            console.error("Error loading content:", error);
            setListFrame([]); // Reset listFrame in case of an error
        }
    };

    // Call getList when video_id changes
    useEffect(() => {
        if (video_id) {
            getList();
        }
    }, [video_id]);

    // Determine the frame indices for display
    const getFrameIndices = () => {
        const frameIdWithoutJpg = frame_id.replace('.jpg', '');
        const currentIndex = listFrame.indexOf(frameIdWithoutJpg);
        console.log(currentIndex)
        if (currentIndex === -1) {
            return []; // Return an empty array if frame_id is not found
        }
        // Determine the indices for the frames around the current frame_id
        const indices = [];
        for (let i = -3; i <= 3; i++) {
            const index = currentIndex + i;
            if (index >= 0 && index < listFrame.length) {
                indices.push(index);
            }
        }
        return indices;
    };

    const frameIndices = getFrameIndices();

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            const currentIndex = listFrame.indexOf(frame_id);
            if (event.key === 'ArrowLeft' && currentIndex > 0) {
                // Navigate to the previous frame
                const previousFrame = listFrame[currentIndex - 1];
                changeCurrentFrame(previousFrame);
                console.log(`Previous Frame ID: ${previousFrame}`);
            }
            if (event.key === 'ArrowRight' && currentIndex < listFrame.length - 1) {
                // Navigate to the next frame
                const nextFrame = listFrame[currentIndex + 1];
                changeCurrentFrame(nextFrame);
                console.log(`Next Frame ID: ${nextFrame}`);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [listFrame, frame_id]); // Dependencies to re-run the effect when these values change

    const handleImageError = (e, index) => {
        e.target.src = `${import.meta.env.VITE_KEYFRAME_URL}/${video_id}/${listFrame[index]}.jpg`;
    };

    return (
        <div className="bg-[#4696f6] flex space-x-1 w-11/12">
            {frameIndices.map((index, idx) => (
                <img
                    key={index}
                    src={`${import.meta.env.VITE_KEYFRAME_URL}/${video_id}/${listFrame[index]}.jpg`}
                    alt={`Frame ${listFrame[index]}`}
                    className={`w-[14%] h-24 object-cover cursor-pointer ${idx === Math.floor(frameIndices.length / 2) ? 'border-4 border-red-500' : ''}`}
                    onClick={() => {
                        console.log(`Frame ID: ${listFrame[index]}`);
                        changeCurrentFrame(listFrame[index]);
                    }}
                    onError={(e) => handleImageError(e, index)} // Xử lý lỗi khi không tải được ảnh
                />
            ))}
        </div>
    );
};

export default NearbyList;
