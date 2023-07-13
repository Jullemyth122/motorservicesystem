import React, { useEffect, useRef, useState } from 'react';

const Slider = ({ items }) => {

    const btnRefs = useRef([]);
    const slidesRef = useRef([])

    const handleSliders = (index) => {
        if (slidesRef.current[index]) {                
            slidesRef.current.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add("active");
                } else {
                    slide.classList.remove("active");
                }
            });
    
            btnRefs.current.forEach((btn, i) => {
                if (i === index) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        }
    };

    const autoSlide = () => {
        let currentIndex = 0;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slidesRef.current.length;
            handleSliders(currentIndex);
        }, 3000); // Change 3000 to desired interval in milliseconds
    };
      
    useEffect(() => {
        autoSlide();
    }, []);


    return (
        <div className="sliderHome">
            <img 
                src="./img/reviews.jpg" 
                alt="" 
                className="transparent-background" 
            />
            <h6 className='title-review'>
                Reviews
            </h6>
            <div className="slider-wrapper">
                {items.map((item, index) => (
                <div
                    className={`slider-item ${index === 0 ? 'active' : ''}`}
                    ref={(el) => slidesRef.current[index] = el}
                    key={index}
                >
                    <div className="rate_side">
                        <img src={item.img} alt="" />
                        <div className="rate_lines">
                            {Array.from({length:item.rate}).map((item, index) => {
                                return (
                                    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z" fill="yellow"/>
                                    </svg>
                                )
                            })}
                        </div>
                    </div>
                    <h6>
                        {item.name}
                    </h6>
                    <p>
                        {item.descrip}
                    </p>
                </div>
                ))}
            </div>
            <div className="slider-controls">
                {items.map((elem, i) => {
                    const className = i === 0 ? 'btn active' : 'btn';
                    return (
                        <span
                        key={i} 
                        className={className}
                        ref={(el) => btnRefs.current[i] = el }
                        onClick={() => handleSliders(i)} 
                        ></span>
                    );
                })}
            </div>
        </div>
    );
};

export default Slider;
