import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

interface CardProps {
    icon: React.ReactElement;
    text: string;
    options: React.ReactElement[];
}

const Card: React.FC<CardProps> = ({ icon, text, options }) => {
    const [showOptions, setShowOptions] = useState<boolean[]>(Array(options.length).fill(false));

    const toggleOption = (index: number) => {
        const newOptionsState = [...showOptions];
        newOptionsState[index] = !newOptionsState[index];
        setShowOptions(newOptionsState);
    };

    return (
        <div>
            <div className='flex justify-between items-center p-2'>
                <div className='text-2xl'>{icon}</div>
                <div>{text}</div>
                <div onClick={() => toggleOption(0)}>
                    <span className='text-2xl'>{showOptions[0] ? <MdKeyboardArrowRight /> : <MdKeyboardArrowDown />}</span>
                </div>
            </div>
            {showOptions[0] && (
                <div className='bg-option-mode'>
                    {options.map((option, index) => (
                        <div key={index} className="flex flex-col card-options option items-center py-2" onClick={() => toggleOption(index)}>
                            {option}
                            <div className='separator'></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export { Card };