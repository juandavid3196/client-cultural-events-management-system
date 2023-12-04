import React from 'react'
import './LeftAside.scss';

const LeftAside = () => {
    return (
        <div className='container'>
            <div className="aside-top">
                <img src="/media/img/image 2.svg" alt="img-aside" />
            </div>
            <div className="aside-bottom">
                <div className='section-button'>
                    <i class="fa-solid fa-calendar-days"></i>
                    <span>Eventos</span>
                    <i class="fa-solid fa-angle-right"></i>
                </div>
                <div className='section-button'>
                    <i class="fa-solid fa-file-shield"></i>
                    <span>Permisos</span>
                    <i class="fa-solid fa-angle-right"></i>
                </div>
            </div>
        </div>
    )
}

export default LeftAside