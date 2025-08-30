import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { FaRedo } from 'react-icons/fa';

const TextBox = ({name, state, option=false}) => {
    const [value, setValue] = state
    const Input = useRef()
    const model = useRef()
    
    const reset = () => {
        // console.log("reset")
        Input.current.value = ''
        setValue('')
    }

    const updateTextInput = () => {
        // console.log(Input.current.value)
        if (option)
            setValue([Input.current.value, model.current.value])
        else
            setValue(Input.current.value)
    }

    const updateInputModel = () => {
        setValue([Input.current.value, model.current.value])
    }

    useEffect(()=>{
        if (option) setValue([Input.current.value, model.current.value])
    },[])

    return (
        <div className='w-full p-1 mt-1 ml-1 flex flex-col border-[3px] border-dotted border-blue-400 rounded-md'>
            
            <div className='flex flex-row mb-1 items-center justify-between'>
                {/* Feature Name */}
                <label 
                    htmlFor={name} 
                    className='w-[20%] font-semibold'>
                        {name}
                </label>

                {/* Input */}
                <textarea 
                    ref={Input} 
                    className="w-full border border-dashed p-1 border-blue-400 h-8" 
                    type="text" 
                    placeholder='nhập text'
                    name={name} 
                    onChange={updateTextInput}
                    id={name}
                />
                {/* {console.log(Input)} */}
            </div>
            
            <div className='flex flex-row justify-between'>

                {/* REDO Input */}
                <button 
                    className="mr-2" 
                    onClick={reset} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                        <FaRedo />
                </button>

                {/* Select Model */}
                {option && 
                    <select 
                        ref={model} 
                        onChange={updateInputModel}
                        className='border w-1/2'
                    >
                        <option value='default' disabled>Select an option</option>
                        {option.map((o,i)=><option key={i} value={o}>{o}</option>)}
                    </select> 
                }
                {/* {console.log(model)} */}
            </div>
            

        </div>
    )

}

export default TextBox