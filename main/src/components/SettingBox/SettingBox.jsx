import { useRef } from "react"
import { FaRedo } from 'react-icons/fa';

const SettingBox = ({nearByState, sampleState}) => {
    const [nearBy, setNearBy] = nearByState
    const [sample, setSample] = sampleState
    const inputNearBy = useRef()
    const inputSample = useRef()

    const updateValue = (e) => {
        if (e.target.name === 'nearBy')
            setNearBy(e.target.value)
        else
        if (e.target.name === 'sample')
            setSample(e.target.value)
    }

    const reset = (e) => {
        const { name } = e.currentTarget
        if (name === "resetNearBy"){
            inputNearBy.current.value = ""
            setNearBy("")
        }
        else if (name === "resetSample"){
            inputSample.current.value = ""
            setSample("")
        }
    
    }

    return (
        <div className="w-full p-1 mt-1 ml-1 flex flex-col border-[3px] border-dotted border-blue-400 rounded-md">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between">
                        <label htmlFor='nearBy' className="">NearBy</label>
                        <input ref={inputNearBy} placeholder='500' className="border p-1 w-3/4 ml-1" type="text" name='nearBy' id="nearBy" onChange={updateValue}></input>
                        <button 
                            className="ml-2" 
                            name="resetNearBy"
                            onClick={reset}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <FaRedo />
                        </button>
                    </div>

                    <div className="flex flex-row justify-between mt-2">
                        <label htmlFor='sample' className="">Sample</label>
                        <input ref={inputSample} placeholder='500' className="border p-1 w-3/4 ml-1" type="text" name='sample' id="sample" onChange={updateValue}></input>
                        <button 
                            className="ml-2" 
                            name="resetSample"
                            onClick={reset}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <FaRedo />
                        </button>
                    </div>
            </div>
        </div>
    )
}

export default SettingBox