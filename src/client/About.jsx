import React from 'react'

const About = () => {
    return (
        <div className="about-us">
            <div className="image-container">
                <img src="./img/s1.jpg" alt="About Us"/>
            </div>
            <div className="text-container">
                <h4>
                    About Us
                </h4>
                <p>
                    Motozing Motor Parts and Services with its tagline #RidewithConfidence, offers affordable and quality Preventive Maintenance Services (PMS) for motorcycles. It is well known for its fixed PMS Packages, no hidden charges and free check-ups. It also uses FI cleaning machine, for effeciency.
                </p>
                <p>
                    It values its customers and continouously works for ways on improving customer experience. In fact, it has a queueing system to avoid the hassles of wait times. Just visit its website, book a service, receive a queue number and wait for your turn.
                </p>
                <p className='last-line'>
                    Motozing. Great service - PMS packages, excellent customer service, a wide range of products and experienced & friendly mechanics. #RideWithConfidence
                </p>
            </div>
        </div>
    )
}

export default About