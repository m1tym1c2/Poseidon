import { useState, useEffect } from 'react';
import { FaRedo, FaPlus, FaMinus } from 'react-icons/fa';

const DynamicBox = ({ name, state, modelOptions = [] }) => {
    const [inputs, setInputs] = state;
    const [selectedModel, setSelectedModel] = useState(modelOptions[0]);

    useEffect(() => {
        setInputs((prevInputs) => ({
            model: selectedModel,
            values: prevInputs.values || ['']
        }));
    }, [selectedModel]);

    const handleAddInput = () => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            values: [...prevInputs.values, '']
        }));
    };

    const handleRemoveInput = (index) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            values: prevInputs.values.filter((_, i) => i !== index)
        }));
    };

    const handleInputChange = (index, newValue) => {
        setInputs((prevInputs) => {
            const updatedValues = [...prevInputs.values];
            updatedValues[index] = newValue;
            return { ...prevInputs, values: updatedValues };
        });
    };

    const handleReset = (index) => {
        setInputs((prevInputs) => {
            const updatedValues = [...prevInputs.values];
            updatedValues[index] = '';
            return { ...prevInputs, values: updatedValues };
        });
    };

    return (
        <div className='w-full p-2 mt-1 ml-1 border-[3px] border-dotted border-blue-400 rounded-md'>
            <label className='font-semibold'>{name}</label>

            {modelOptions.length > 0 && (
                <select
                    className='border ml-2 mb-2'
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    {modelOptions.map((o, i) => (
                        <option key={i} value={o}>{o}</option>
                    ))}
                </select>
            )}

            {inputs.values && inputs.values.map((input, index) => (
                <div key={index} className='flex flex-row items-center mb-2'>
                    <textarea
                        className="w-full border border-dashed p-1 border-blue-400 h-8"
                        type="text"
                        placeholder={`Input ${index + 1}`}
                        value={input}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />

                    <button className="ml-2" onClick={() => handleReset(index)}>
                        <FaRedo />
                    </button>

                    {inputs.values.length > 1 && (
                        <button className="ml-2" onClick={() => handleRemoveInput(index)}>
                            <FaMinus />
                        </button>
                    )}
                </div>
            ))}

            <button className='mt-2 w-full border bg-green-500 text-white rounded-lg p-1' onClick={handleAddInput}>
                <FaPlus /> Add Text Input
            </button>
        </div>
    );
};

export default DynamicBox;
