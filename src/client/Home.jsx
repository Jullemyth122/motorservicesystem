import React, { useEffect, useRef, useState } from 'react'
import { useBrands } from '../context/BrandsContext'
import { useNavigate } from 'react-router-dom'
import { useServices } from '../context/ServicesContext';
import { useFinal } from '../context/FinalContext';
import { Link } from 'react-router-dom';
import Slider from './Slider';
import { messaging } from '../lib/firebase';

const items = [
    {
        title:'Service Offer',
        descrip:"-	Ensuring the proper levels and condition of fluids such as engine oil, coolant, brake fluid, and transmission oil is crucial for optimal performance and longevity of your motorcycle.",
        image: "./services/1.jpg",
    },
    {
        title:'Service Offer',
        descrip:"-	Regularly inspect and clean or replace air filters, oil filters, and fuel filters. Clean filters promote better airflow, fuel efficiency, and prevent contaminants from entering the engine.",
        image: "./services/2.jpg",
    },
    {
        title:'Service Offer',
        descrip:"-	Overall Inspection and Cleaning: Conduct a comprehensive inspection of the motorcycle, including lights, controls, cables, suspension, and chassis. Clean the bike regularly to remove dirt, debris, and corrosive substances that can affect performance and aesthetics.",
        image: "./services/3.jpg",
    },
    {
        title:'Service Offer',
        descrip:"-	Regular preventive maintenance keeps your motorcycle in top-notch condition, ensuring optimal performance every time you hit the road. By taking care of your bike, you'll experience smoother rides, better fuel efficiency, and a more enjoyable overall riding experience.",
        image: "./services/4.jpg",
    },
    {
        title:'Service Offer',
        descrip:"-	Investing in preventive maintenance actually helps you save money in the long term. By identifying and addressing small issues early on, you can prevent them from escalating into more significant and expensive problems. Regular maintenance also ensures that your bike operates at peak efficiency, saving you money on fuel consumption and costly repairs down the road.",
        image: "./services/5.jpg",
    },
    {
        title:'Service Offer',
        descrip:"-	Your safety should be a top priority when riding a motorcycle. Preventive maintenance plays a crucial role in identifying and addressing potential safety issues before they become major problems. By maintaining brakes, tires, and other vital components, you can ride with confidence, knowing that your bike is in excellent working order.",
        image: "./services/6.jpg",
    },
    {
        title:'Service Offer',
        descrip:"-	Perhaps the most compelling reason to invest in preventive maintenance is the peace of mind it brings, Knowing that your motorcycle is in excellent condition and has been thoroughly inspected and serviced gives you confidence and eliminates unnecessary worries while riding. You can focus on enjoying the open road and the thrill of riding, knowing that your bike is in its best possible state.",
        image: "./services/7.jpg",
    },
];

const reviews = [
    {
        name:'Mervin John',
        rate:5,
        img:"./reviews/mervin john.jpg",
        descrip:'5star Solid 100/10 aangkinin nya yung motor mo. Grabe mag linis sulit na sulit ang 499 Search nyo lang sa googlemap. Unit B Anabu 1A Imus, in-front of Sun City Plaza. Just search Motozing Parts, Services & Accessories'
    },
    {
        name:'Ronald Sheldon Garcia',
        rate:5,
        img:"./reviews/ronald sheldon garcia.jpg",
        descrip:"Quality daw Service dito and sulit kita naman sa reaction ko Happy ang Person Sulit nga motozing shop May online reservation din sila Sa mga naka Honda click or any motor Totoo ang Sabi sabi Sulit at Qualit Upload nten soon."
    },
    {
        name:"Jomar Porcalla Jr.",
        rate:4,
        img:"./reviews/JomarPorcallaJr.jpg",
        descrip:"Alagang Motozing parts and accessories shop si baby lexy ko  siguradong pulido gawa at matapat na mekaniko  may mga package pa sila na siguradong makakatipid ka  MotoData no. 1  Free motorcycle checkup  Any kind of brands"
    },
    {
        name:"Jun D. Bautista",
        rate:4,
        img:"./reviews/JunD.Bautista.jpg",
        descrip: "Touch down Porac Pampanga thanks you lord for the safe ride and syempre shoutout dyan kila sir kiv MOTOZING part & accessories napakahusay ng mekaniko nyo, salamat sa pag alaga kay GIO ko NATUMBOK din kung bakit tinopak hehehe  napaka asikaso mabait pa, pampanga nako sir walang palya si gio   highly recomended po, try nyo minsan anabu imus sila, solid dyan makatarungan pa mag presyo   #goodjob   #kondisyon"
    }

];


const Home = () => {
    const delay = 2500;

    const navigate = useNavigate()
    const { brands,setBrands } = useFinal()
    const { brandsList } = useBrands()
    const [mileage,setMileage] = useState("below")

    const handleService = () => {
        if (mileage.length > 0 && brands.length > 0 && brands != "SELECT") {
            navigate("/service",{ state: { item: { mileage:mileage,brands:brands } } })
        } else {
            return alert("Please select brand / mileage first")
        }
    }

    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);
  
    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    const [scrollPos, setScrollPos] = useState(-100);
  
    const handleScroll = () => {
        const position = window.pageYOffset / 2;
        setScrollPos(-100 + position);
    };


    const btnRefs = useRef([]);
    const slides = useRef([])

    const handleSliders = (index) => {
        if (slides.current[index]) {
            slides.current[index].style.transform = `translateX(${-90 * index}vw)`;
    
            slides.current.forEach((slide, i) => {
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
            currentIndex = (currentIndex + 1) % slides.current.length;
            handleSliders(currentIndex);
        }, 3000); // Change 3000 to desired interval in milliseconds
    };
      
    useEffect(() => {
        autoSlide();
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() =>
            setIndex((prevIndex) =>
                prevIndex === items.length - 1 ? 0 : prevIndex + 1
            ),
        delay);
    
        return () => {
            resetTimeout();
        };
    }, [index]);



    return (
        <div className='home-component container-fluid'>
            <div id='home' className="bgImg">
                <div className="mainBg">
                    <img src="./img/logo.png" alt="" />
                </div>
                <div className="mileage-section">
                    <div className="mileage-entitle">
                        <h3>
                            Revive Your Ride: Expert Motorcycle Repairs Done Right!
                        </h3>
                    </div>
                    <div className="mileage-sector">
                        <div className="model">
                            <div className="item_label">
                                <select className='styled-select' name="" id="" value={brands}  onChange={e => setBrands(e.target.value)}>
                                    <option value="SELECT">
                                        Select Brand / Model
                                    </option>
                                    {brandsList.map((brand, idx) => (
                                    <option key={idx} value={brand.brandname}>
                                        {brand?.brandname}
                                    </option>
                                    ))}
                                </select>
                                <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.47873 6.85482L0.68706 3.06315C0.225254 2.60135 0.122199 2.07294 0.377893 1.47794C0.633588 0.882943 1.08907 0.584957 1.74435 0.583984H9.25477C9.91102 0.583984 10.367 0.88197 10.6227 1.47794C10.8784 2.07391 10.7748 2.60232 10.3121 3.06315L6.52039 6.85482C6.37456 7.00065 6.21657 7.11003 6.04644 7.18294C5.8763 7.25586 5.694 7.29232 5.49956 7.29232C5.30512 7.29232 5.12282 7.25586 4.95268 7.18294C4.78255 7.11003 4.62456 7.00065 4.47873 6.85482Z" fill="black"/>
                                </svg>
                            </div>
                        </div>
                        <div className="mileage">
                            <div className="item_label">
                                <select className='styled-select' name="mileage" value={mileage} onChange={e => setMileage(e.target.value)}>
                                    <option value="below">
                                        Below 15000 
                                    </option>
                                    <option value="up">
                                        Above 15000 
                                    </option>
                                </select>
                                <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.47873 6.85482L0.68706 3.06315C0.225254 2.60135 0.122199 2.07294 0.377893 1.47794C0.633588 0.882943 1.08907 0.584957 1.74435 0.583984H9.25477C9.91102 0.583984 10.367 0.88197 10.6227 1.47794C10.8784 2.07391 10.7748 2.60232 10.3121 3.06315L6.52039 6.85482C6.37456 7.00065 6.21657 7.11003 6.04644 7.18294C5.8763 7.25586 5.694 7.29232 5.49956 7.29232C5.30512 7.29232 5.12282 7.25586 4.95268 7.18294C4.78255 7.11003 4.62456 7.00065 4.47873 6.85482Z" fill="black"/>
                                </svg>
                            </div>
                        </div>
                        <div className="book-side">
                            <button onClick={handleService}>
                                View Service
                            </button>
                        </div>
                    </div>
                </div>
                <img
                    style={{ 
                        objectPosition: `center ${scrollPos}px`,
                        transition: 'transform 2s cubic-bezier(.75,.19,.2,.85)'  
                    }} 
                    className='home-page-bg' 
                    src="./img/bg.jpg" alt="" 
                />
            </div>
            <div className="why_choose_comp">
                <h4 className='why_top'>
                    Our RealTime Milestone
                </h4>
                <div className="d-flex align-items-stretch justify-content-center flex-wrap">
                    <div className="item_choose stylish">
                        <div className="item_icon">
                            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 10C13.381 10 14.631 9.44 15.536 8.535C16.44 7.631 17 6.381 17 5C17 3.619 16.44 2.369 15.536 1.465C14.631 0.56 13.381 0 12 0C10.619 0 9.369 0.56 8.464 1.465C7.56 2.369 7 3.619 7 5C7 6.381 7.56 7.631 8.464 8.535C8.92781 9.00011 9.47897 9.36897 10.0858 9.62039C10.6926 9.8718 11.3432 10.0008 12 10ZM20 11C20.3285 11.0007 20.6539 10.9364 20.9575 10.811C21.2611 10.6856 21.537 10.5015 21.7692 10.2692C22.0015 10.037 22.1856 9.7611 22.311 9.45749C22.4364 9.15388 22.5007 8.82849 22.5 8.5C22.5 7.81 22.221 7.185 21.768 6.732C21.5361 6.49951 21.2605 6.31516 20.9571 6.18954C20.6536 6.06392 20.3284 5.9995 20 6C19.6715 5.99934 19.3461 6.06356 19.0425 6.18896C18.7389 6.31436 18.463 6.49849 18.2308 6.73076C17.9985 6.96304 17.8144 7.2389 17.689 7.54251C17.5636 7.84612 17.4993 8.17151 17.5 8.5C17.4995 8.82845 17.5638 9.15378 17.6892 9.45733C17.8147 9.76088 17.9988 10.0367 18.2311 10.2689C18.4633 10.5012 18.7391 10.6853 19.0427 10.8108C19.3462 10.9362 19.6715 11.0005 20 11ZM20 11.59C18.669 11.59 17.668 11.996 17.083 12.558C15.968 11.641 14.205 11 12 11C9.734 11 8.005 11.648 6.908 12.564C6.312 11.999 5.3 11.59 4 11.59C1.812 11.59 0.5 12.68 0.5 13.772C0.5 14.317 1.812 14.864 4 14.864C4.604 14.864 5.146 14.813 5.623 14.731L5.583 15.001C5.583 16.001 7.989 17.001 12 17.001C15.762 17.001 18.417 16.001 18.417 15.001L18.397 14.746C18.86 14.819 19.392 14.864 20 14.864C22.051 14.864 23.5 14.317 23.5 13.772C23.5 12.68 22.127 11.59 20 11.59ZM4 11C4.69 11 5.315 10.721 5.768 10.268C6.00049 10.0361 6.18484 9.76048 6.31046 9.45706C6.43608 9.15364 6.5005 8.82839 6.5 8.5C6.50066 8.17151 6.43644 7.84612 6.31104 7.54251C6.18564 7.2389 6.00151 6.96304 5.76924 6.73076C5.53696 6.49849 5.2611 6.31436 4.95749 6.18896C4.65388 6.06356 4.32849 5.99934 4 6C3.67155 5.99947 3.34622 6.06378 3.04267 6.18923C2.73912 6.31468 2.46331 6.49881 2.23106 6.73106C1.99881 6.96331 1.81468 7.23912 1.68923 7.54267C1.56378 7.84622 1.49947 8.17155 1.5 8.5C1.49934 8.82849 1.56356 9.15388 1.68896 9.45749C1.81436 9.7611 1.99849 10.037 2.23076 10.2692C2.46304 10.5015 2.7389 10.6856 3.04251 10.811C3.34612 10.9364 3.67151 11.0007 4 11Z" fill="white"/>
                            </svg>
                        </div>
                        <div className="item_text">
                            <h4>
                                Registered Customers
                            </h4>
                            <h4>
                                13211
                            </h4>
                        </div>
                    </div>
                    <div className="item_choose stylish">
                        <div className="item_icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.7804 13.3004L17.7804 19.3004L19.8904 17.1404L13.8904 11.1404L11.7804 13.3004ZM15.5004 8.10044C15.1104 8.10044 14.6904 8.05044 14.3604 7.91044L2.97035 19.2504L0.860352 17.1404L8.27035 9.74044L6.50035 7.96044L5.78035 8.66044L4.33035 7.25044V10.1104L3.63035 10.8104L0.110352 7.25044L0.810352 6.55044H3.62035L2.22035 5.14044L5.78035 1.58044C6.0569 1.3024 6.38568 1.08175 6.74779 0.931193C7.1099 0.780633 7.49819 0.703125 7.89035 0.703125C8.28251 0.703125 8.67081 0.780633 9.03291 0.931193C9.39502 1.08175 9.7238 1.3024 10.0004 1.58044L7.89035 3.74044L9.30035 5.14044L8.59035 5.85044L10.3804 7.63044L12.2004 5.75044C12.0604 5.42044 12.0004 5.00044 12.0004 4.63044C11.9964 4.16877 12.0841 3.71089 12.2583 3.28334C12.4325 2.85579 12.6899 2.46706 13.0154 2.13966C13.3409 1.81227 13.7282 1.55272 14.1547 1.37605C14.5813 1.19938 15.0387 1.1091 15.5004 1.11044C16.0904 1.11044 16.6104 1.25044 17.0804 1.53044L14.4104 4.20044L15.9104 5.70044L18.5804 3.03044C18.8604 3.50044 19.0004 4.00044 19.0004 4.63044C19.0004 6.55044 17.4504 8.10044 15.5004 8.10044Z" fill="white"/>
                            </svg>
                        </div>
                        <div className="item_text">
                            <h4>
                                PMS Completed
                            </h4>
                            <h4>
                                2223
                            </h4>
                        </div>
                    </div>
                    <div className="item_choose stylish">
                        <div className="item_icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.95 18C14.8 18 12.7043 17.5207 10.663 16.562C8.62167 15.6033 6.81333 14.3367 5.238 12.762C3.66267 11.1873 2.396 9.379 1.438 7.337C0.48 5.295 0.000666667 3.19933 0 1.05C0 0.75 0.0999999 0.5 0.3 0.3C0.5 0.0999999 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0749999 5.725 0.225C5.90833 0.375 6.01667 0.566667 6.05 0.8L6.7 4.3C6.73333 4.53333 6.729 4.746 6.687 4.938C6.645 5.13 6.54933 5.30067 6.4 5.45L3.975 7.9C4.675 9.1 5.55433 10.225 6.613 11.275C7.67167 12.325 8.834 13.2333 10.1 14L12.45 11.65C12.6 11.5 12.796 11.3873 13.038 11.312C13.28 11.2367 13.5173 11.216 13.75 11.25L17.2 11.95C17.4333 12 17.625 12.1127 17.775 12.288C17.925 12.4633 18 12.6673 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18ZM3.025 6L4.675 4.35L4.25 2H2.025C2.10833 2.68333 2.225 3.35833 2.375 4.025C2.525 4.69167 2.74167 5.35 3.025 6ZM11.975 14.95C12.625 15.2333 13.2877 15.4583 13.963 15.625C14.6383 15.7917 15.3173 15.9 16 15.95V13.75L13.65 13.275L11.975 14.95Z" fill="white"/>
                            </svg>
                        </div>
                        <div className="item_text">
                            <h4>
                                Services Completed
                            </h4>
                            <h4>
                                15071
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <Slider items={reviews} />
            <div className="showIdeals row">
                <div className="col-md-6 ideal_ct">
                    <img src="./img/id1.jpeg" alt="" />
                    <div className="textBanner col-md-8">
                        <h5>
                            With our motorcycle services, you can unleash the full potential of your ride. Our website is your portal to a world of unrivaled knowledge and quality, from routine maintenance to performance improvements.                         
                        </h5>
                        <button className='button-banner'>
                            <Link to={'/shop'}>
                                Select Order Now!
                            </Link>
                        </button>
                    </div>
                </div>
                <div className="col-md-6 ideal_ct">
                    <img src="./img/id2.jpg" alt="" />
                    <div className="textBanner col-md-8">
                        <h5>
                            Our website provides comprehensive and dependable services for all of your bicycling requirements.                         
                        </h5>
                        <button className='button-banner'>
                            <Link to={'/shop'}>
                                Select Order Now!
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
            <div id='promo' className='showServices'>
                <main>
                    <h1>Promo Services</h1>
                    <div className="indicator">
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
                    <div className="testimonial">
                        <div className="slide-row" 
                            id="slide" 
                            >
                            {items.map((elem,i) => {
                                return (
                                    <div 
                                        key={i} 
                                        className={`slide-col${i === 0 ? ' active' : ''}`}
                                        ref={(el) => slides.current[i] = el}
                                    >
                                        <div className="user-text">
                                            <h2>{elem.title}</h2>
                                            <p>
                                                {elem.descrip}
                                            </p>
                                        </div>
                                        <div className="user-img">
                                            <img src={elem.image} alt="avatar"/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </main>
            </div>
            <div className="why_choose_comp">
                <h4 className='why_top'>
                    Choose Motozing
                </h4>
                <p className='why_text'>
                    Our reasonable pricing, quick and flexible appointment times, and all original parts and accessories are all available to you, Ka-Motozing!
                </p>
                <div className="d-flex align-items-stretch justify-content-center flex-wrap">
                    <div className="item_choose">
                        <div className="item_icon">
                            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 10C13.381 10 14.631 9.44 15.536 8.535C16.44 7.631 17 6.381 17 5C17 3.619 16.44 2.369 15.536 1.465C14.631 0.56 13.381 0 12 0C10.619 0 9.369 0.56 8.464 1.465C7.56 2.369 7 3.619 7 5C7 6.381 7.56 7.631 8.464 8.535C8.92781 9.00011 9.47897 9.36897 10.0858 9.62039C10.6926 9.8718 11.3432 10.0008 12 10ZM20 11C20.3285 11.0007 20.6539 10.9364 20.9575 10.811C21.2611 10.6856 21.537 10.5015 21.7692 10.2692C22.0015 10.037 22.1856 9.7611 22.311 9.45749C22.4364 9.15388 22.5007 8.82849 22.5 8.5C22.5 7.81 22.221 7.185 21.768 6.732C21.5361 6.49951 21.2605 6.31516 20.9571 6.18954C20.6536 6.06392 20.3284 5.9995 20 6C19.6715 5.99934 19.3461 6.06356 19.0425 6.18896C18.7389 6.31436 18.463 6.49849 18.2308 6.73076C17.9985 6.96304 17.8144 7.2389 17.689 7.54251C17.5636 7.84612 17.4993 8.17151 17.5 8.5C17.4995 8.82845 17.5638 9.15378 17.6892 9.45733C17.8147 9.76088 17.9988 10.0367 18.2311 10.2689C18.4633 10.5012 18.7391 10.6853 19.0427 10.8108C19.3462 10.9362 19.6715 11.0005 20 11ZM20 11.59C18.669 11.59 17.668 11.996 17.083 12.558C15.968 11.641 14.205 11 12 11C9.734 11 8.005 11.648 6.908 12.564C6.312 11.999 5.3 11.59 4 11.59C1.812 11.59 0.5 12.68 0.5 13.772C0.5 14.317 1.812 14.864 4 14.864C4.604 14.864 5.146 14.813 5.623 14.731L5.583 15.001C5.583 16.001 7.989 17.001 12 17.001C15.762 17.001 18.417 16.001 18.417 15.001L18.397 14.746C18.86 14.819 19.392 14.864 20 14.864C22.051 14.864 23.5 14.317 23.5 13.772C23.5 12.68 22.127 11.59 20 11.59ZM4 11C4.69 11 5.315 10.721 5.768 10.268C6.00049 10.0361 6.18484 9.76048 6.31046 9.45706C6.43608 9.15364 6.5005 8.82839 6.5 8.5C6.50066 8.17151 6.43644 7.84612 6.31104 7.54251C6.18564 7.2389 6.00151 6.96304 5.76924 6.73076C5.53696 6.49849 5.2611 6.31436 4.95749 6.18896C4.65388 6.06356 4.32849 5.99934 4 6C3.67155 5.99947 3.34622 6.06378 3.04267 6.18923C2.73912 6.31468 2.46331 6.49881 2.23106 6.73106C1.99881 6.96331 1.81468 7.23912 1.68923 7.54267C1.56378 7.84622 1.49947 8.17155 1.5 8.5C1.49934 8.82849 1.56356 9.15388 1.68896 9.45749C1.81436 9.7611 1.99849 10.037 2.23076 10.2692C2.46304 10.5015 2.7389 10.6856 3.04251 10.811C3.34612 10.9364 3.67151 11.0007 4 11Z" fill="white"/>
                            </svg>
                        </div>
                        <div className="item_text">
                            <h4>
                                Highly-Trained Staff
                            </h4>
                            <p>
                                Our staffs have the experience and understanding to handle any task precisely and efficiently. You can rely on their great talents and dedication to meet your demands with professionalism and quality. Do not accept anything less than the best. 
                            </p>
                        </div>
                    </div>
                    <div className="item_choose">
                        <div className="item_icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.7804 13.3004L17.7804 19.3004L19.8904 17.1404L13.8904 11.1404L11.7804 13.3004ZM15.5004 8.10044C15.1104 8.10044 14.6904 8.05044 14.3604 7.91044L2.97035 19.2504L0.860352 17.1404L8.27035 9.74044L6.50035 7.96044L5.78035 8.66044L4.33035 7.25044V10.1104L3.63035 10.8104L0.110352 7.25044L0.810352 6.55044H3.62035L2.22035 5.14044L5.78035 1.58044C6.0569 1.3024 6.38568 1.08175 6.74779 0.931193C7.1099 0.780633 7.49819 0.703125 7.89035 0.703125C8.28251 0.703125 8.67081 0.780633 9.03291 0.931193C9.39502 1.08175 9.7238 1.3024 10.0004 1.58044L7.89035 3.74044L9.30035 5.14044L8.59035 5.85044L10.3804 7.63044L12.2004 5.75044C12.0604 5.42044 12.0004 5.00044 12.0004 4.63044C11.9964 4.16877 12.0841 3.71089 12.2583 3.28334C12.4325 2.85579 12.6899 2.46706 13.0154 2.13966C13.3409 1.81227 13.7282 1.55272 14.1547 1.37605C14.5813 1.19938 15.0387 1.1091 15.5004 1.11044C16.0904 1.11044 16.6104 1.25044 17.0804 1.53044L14.4104 4.20044L15.9104 5.70044L18.5804 3.03044C18.8604 3.50044 19.0004 4.00044 19.0004 4.63044C19.0004 6.55044 17.4504 8.10044 15.5004 8.10044Z" fill="white"/>
                            </svg>
                        </div>
                        <div className="item_text">
                            <h4>
                                Fast & Effective Services 
                            </h4>
                            <p>
                                You'll experience lightning-fast solutions that deliver results in no time. Say goodbye to wasted hours and hello to efficient, top-notch service. Try us today and see the difference for yourself!
                            </p>
                        </div>
                    </div>
                    <div className="item_choose">
                        <div className="item_icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.95 18C14.8 18 12.7043 17.5207 10.663 16.562C8.62167 15.6033 6.81333 14.3367 5.238 12.762C3.66267 11.1873 2.396 9.379 1.438 7.337C0.48 5.295 0.000666667 3.19933 0 1.05C0 0.75 0.0999999 0.5 0.3 0.3C0.5 0.0999999 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0749999 5.725 0.225C5.90833 0.375 6.01667 0.566667 6.05 0.8L6.7 4.3C6.73333 4.53333 6.729 4.746 6.687 4.938C6.645 5.13 6.54933 5.30067 6.4 5.45L3.975 7.9C4.675 9.1 5.55433 10.225 6.613 11.275C7.67167 12.325 8.834 13.2333 10.1 14L12.45 11.65C12.6 11.5 12.796 11.3873 13.038 11.312C13.28 11.2367 13.5173 11.216 13.75 11.25L17.2 11.95C17.4333 12 17.625 12.1127 17.775 12.288C17.925 12.4633 18 12.6673 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18ZM3.025 6L4.675 4.35L4.25 2H2.025C2.10833 2.68333 2.225 3.35833 2.375 4.025C2.525 4.69167 2.74167 5.35 3.025 6ZM11.975 14.95C12.625 15.2333 13.2877 15.4583 13.963 15.625C14.6383 15.7917 15.3173 15.9 16 15.95V13.75L13.65 13.275L11.975 14.95Z" fill="white"/>
                            </svg>
                        </div>
                        <div className="item_text">
                            <h4>
                                Support 24 / 7
                            </h4>
                            <p>
                                Elevate your experience. Our online support system redefines efficiency, online service appointments, inquiries.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                2023 Motozing © All right reserve
            </footer>
        </div>
    )
}

export default Home