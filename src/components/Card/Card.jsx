import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

const Card = ({ icon, text, options }) => {
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const stopPropagation = (e) => {
        e.stopPropagation(); // Evita que el clic en una opción propague al contenedor y cierre el card
    };

    return (
        <div onClick={toggleOptions}> {/* Hacer clic en el card completo abre/cierra */}
            <div className='flex justify-between items-center p-2'>
                <div className='text-2xl'>{icon}</div>
                <div>{text}</div>
                <div>
                    <span className='text-2xl'>{showOptions ? <MdKeyboardArrowRight /> : <MdKeyboardArrowDown />}</span>
                </div>
            </div>
            {showOptions && (
                <div className='bg-option-mode' onClick={stopPropagation}>
                    {options.map((option, index) => (
                        <div key={index} className="flex flex-col card-options option items-center py-2" onClick={stopPropagation}>
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
