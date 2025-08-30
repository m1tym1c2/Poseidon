import React, { useRef } from "react";
import { FaRedo } from 'react-icons/fa';

const ImageBox = ({ state, setModelImg, option=['apple_clip', 'original_clip', 'laion_clip'] }) => {
    const [selectedFiles, setSelectedFiles] = state;
    const inputImage = useRef();

    const selectFiles = (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length) {
            setSelectedFiles([newFiles[0]]);  // Only store the first file
            inputImage.current.value = '';
        }
    };

    const handleRemove = (filename) => {
        setSelectedFiles((prevSelectedFiles) => prevSelectedFiles.filter(file => file.name !== filename));
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const newFiles = event.dataTransfer.files;
        if (newFiles.length) {
            setSelectedFiles([newFiles[0]]);  // Again, only first file
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const reset = () => {
        setSelectedFiles([]);
    };

    const changeModel = (e) => {
        setModelImg(e.target.value);
    };

    const triggerFileSelect = () => {
        inputImage.current.click();
    };

    return (
        <div
            className="w-full p-1 mt-1 ml-1 flex flex-col border-[3px] border-dotted border-blue-400 rounded-md"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
        >
            <div className="flex flex-row justify-between">
                <input 
                    ref={inputImage}
                    accept="image/*"
                    type="file" 
                    multiple 
                    onChange={selectFiles} 
                    style={{ display: 'none' }} 
                />
                <button
                    onClick={triggerFileSelect}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
                >
                    Choose Files
                </button>

                {option && 
                    <select 
                        onChange={changeModel}
                        className='border w-1/2'
                    >
                        <option value='default' disabled>Select an option</option>
                        {option.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                }

                <button 
                    className="ml-2" 
                    onClick={reset} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <FaRedo />
                </button>
            </div>
            
            <div>
                <ul className='overflow-y-auto h-12 bg-blue-200 mt-1'>
                    {
                        selectedFiles.map((file, index) => (
                            <li key={index} className='flex flex-row px-6 justify-between'>
                                <p>{file.name}</p>
                                <button
                                    className="mr-2"
                                    onClick={() => handleRemove(file.name)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <FaRedo />
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};

export default ImageBox;