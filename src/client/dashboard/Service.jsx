import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import { useFinal } from '../../context/FinalContext';
import { useServices } from '../../context/ServicesContext';

function generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const ServiceClient = () => {

    const { shopList,setShopList } = useFinal()
    
    const navigate = useNavigate()
    const [isAdd,setIsAdd] = useState()
    const { user } = useAccount();
    const { state: { item } } = useLocation();
    const { servicesList } = useServices();

    const [bookControl,setBookControl] = useState(null)
    const [emailUid,setEmailUid] = useState("")

    const [filteredServices,setFilteredServices] = useState([])
    
    // Filter the services based on the selected option
    useEffect(() => {
        const lists = servicesList.filter(service => {
            if (item.mileage === service.mileage && item.brands === service.brand) {
                return true;
            } else if (item.brands === "ALL") {
                return true
            }
            return false;
        });
        setFilteredServices(lists)
    },[item,servicesList])

    useEffect(() => {
        if(user) {
            setEmailUid(user.email.toString() + '-' + generateRandomString(20))
        }
    }, [user]);

    const handleBook = async(service) => {
        setIsAdd(true);
        setBookControl(service);
    }
    
    const handleAddBook1 = async() => {
        const service = {
            itemname:bookControl.servicename,
            image:bookControl.image,
            price:bookControl.price,
            typeofbook:'Service',
            qty:1,
            typeoforder:'buy'
        };

        setShopList([...shopList,service])
        if(user && user.email) {
            service.email = user.email;
        }
        return navigate('/shop')
    }
    
    const handleAddBook2 = () => {
        const service = {
            itemname:bookControl.servicename,
            price:bookControl.price,
            image:bookControl.image,
            typeoforder:'buy',
            typeofbook:'Service',
            qty:1
        };
        setShopList([...shopList,service])
        if(user && user.email) {
            service.emailUid = emailUid;
        }
        return navigate('/info',{ state: { item:{orders:[service]}}  })
    }
    
    return (
        <div className="services-client">
            <div className="services-component">
                <div className="service-leon" style={ isAdd ? {display:'flex'} : {display:'none'}}>
                    <div className="service-open">
                        <div className="service_head">
                            <h5>
                                Add Parts and Accessories
                            </h5>
                        </div>
                        <div className="service_foot">
                            <button onClick={handleAddBook1}>
                                Yes
                            </button>
                            <button onClick={handleAddBook2}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
                <div className="services-flex-items d-flex align-items-center justify-content-center flex-wrap">
                    {filteredServices.map((service, idx) => (
                    <div key={idx} className="service-item">
                        <img src={service.image} alt="" />
                        <div className="button_side">
                            <button onClick={e => handleBook(service)}>
                                Select & Book
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceClient;
