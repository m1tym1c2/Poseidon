import { useState } from "react";
import { FaRedo } from 'react-icons/fa';

const IDBox = ({ videoState, frameState }) => {
    const [videoID, setVideoID] = videoState;
    const [frameID, setFrameID] = frameState;

    // Hàm cập nhật giá trị khi người dùng nhập liệu
    const updateValue = (e) => {
        if (e.target.name === 'videoID') {
            setVideoID(e.target.value);
        } else if (e.target.name === 'frameID') {
            setFrameID(e.target.value);
        }
    };

    // Hàm reset giá trị input
    const reset = () => {
        setVideoID(""); // Reset giá trị videoID
        setFrameID(""); // Reset giá trị frameID
    };

    return (
        <div className="w-full p-1 mt-1 ml-1 flex flex-col border-[3px] border-dotted border-blue-400 rounded-md">
            <div className="flex flex-row w-full">
                <div className="flex flex-col w-[90%]">
                    <div className="flex flex-row justify-between">
                        <label htmlFor="videoID">VideoID</label>
                        <input
                            className="border p-1 w-3/4 ml-1"
                            type="text"
                            name="videoID"
                            id="videoID"
                            value={videoID} // Gán giá trị videoID từ state
                            onChange={updateValue}
                        />
                    </div>

                    <div className="flex flex-row justify-between mt-2">
                        <label htmlFor="frameID">FrameID</label>
                        <input
                            className="border p-1 w-3/4 ml-1"
                            type="text"
                            name="frameID"
                            id="frameID"
                            value={frameID} // Gán giá trị frameID từ state
                            onChange={updateValue}
                        />
                    </div>
                </div>

                <button
                    className="ml-2"
                    name="resetVideoID"
                    onClick={reset}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <FaRedo />
                </button>
            </div>
        </div>
    );
};

export default IDBox;
