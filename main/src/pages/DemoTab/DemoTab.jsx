import { useState } from 'react'
import axios from 'axios';

const api = axios.create({baseURL: 'http://localhost:8000'})

function DemoTab(){
    const [inputText, setInputText] = useState('');
    const [selectedOption, setSelectedOption] = useState('ViT-L/14');

    const handleSubmit = async (e) => {
        // console.log(inputText, selectedOption)
        const response = await api.post('/message/process', { 
            inputText: inputText, 
            inputModel: selectedOption 
        })
        console.log(response.data);
    }

    return(
        <div className='flex flex-col justify-center h-[20%] w-[25%]'>
            <div className='flex flex-col border-2 border-dotted h-full w-full m-2 p-1'>
                <div className='flex flex-row justify-between h-full w-full'>
                    <div className='text-xl w-[25%]'>CLIP 1</div>
                    <textarea type="text" className='w-full border border-dashed p-1' placeholder='nhập text' value={inputText} onChange={(e) => setInputText(e.target.value)}/>
                </div>
                <div className='flex justify-center mt-2'>
                    <select className='justify-items-center border' value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                        <option value="ViT-L/14">ViT-L/14</option>
                        <option value="ViT-B/32">ViT-B/32</option>
                    </select>
                </div>
            </div>
            
            <button type='submit' className='border bg-blue-500 rounded-lg text-white p-1 m-2 justify-items-center' onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default DemoTab;