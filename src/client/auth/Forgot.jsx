import { sendPasswordResetEmail } from 'firebase/auth'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authentication } from '../../lib/firebase'

const Forgot = () => {
    
    const emailRef = useRef()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)


    function handleSubmit(e) {
        e.preventDefault()
        
        setLoading(true)
        sendPasswordResetEmail(authentication,emailRef.current.value)
        .then(res => {
            setMessage("")
            setError("")
            setMessage("Check your inbox for further instructions")
        })
        .catch(err => {

            setError("Email not register/found")
        })
        setLoading(false)

    }

    return (
        <div className="forgot-component">
            <img
                className='transparent-background' 
                src="./img/bg.jpg" alt="" 
            />
            <div className="login-subcomponent">
                <div className='signin-component'>
                    <form onSubmit={handleSubmit}>
                        <div className="input-form">
                            <div className="logo">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.809 30.714C17.654 29.714 22.367 29.8 29.221 30.749C29.7174 30.821 30.1709 31.0701 30.4979 31.4504C30.8249 31.8307 31.0033 32.3165 31 32.818C31 33.298 30.835 33.764 30.537 34.128C30.0176 34.7626 29.4855 35.3868 28.941 36H31.582C31.748 35.802 31.915 35.6 32.084 35.395C32.6772 34.6676 33.0007 33.7576 33 32.819C33 30.794 31.522 29.049 29.495 28.769C22.479 27.798 17.575 27.705 10.52 28.736C8.472 29.035 7 30.807 7 32.846C7 33.751 7.295 34.646 7.854 35.371C8.019 35.585 8.182 35.795 8.344 36.001H10.921C10.4144 35.3945 9.92032 34.7777 9.439 34.151C9.15296 33.7758 8.99866 33.3168 9 32.845C9 31.768 9.774 30.865 10.809 30.714ZM20 21C20.7879 21 21.5681 20.8448 22.2961 20.5433C23.0241 20.2417 23.6855 19.7998 24.2426 19.2426C24.7998 18.6855 25.2417 18.0241 25.5433 17.2961C25.8448 16.5681 26 15.7879 26 15C26 14.2121 25.8448 13.4319 25.5433 12.7039C25.2417 11.9759 24.7998 11.3145 24.2426 10.7574C23.6855 10.2002 23.0241 9.75825 22.2961 9.45672C21.5681 9.15519 20.7879 9 20 9C18.4087 9 16.8826 9.63214 15.7574 10.7574C14.6321 11.8826 14 13.4087 14 15C14 16.5913 14.6321 18.1174 15.7574 19.2426C16.8826 20.3679 18.4087 21 20 21ZM20 23C22.1217 23 24.1566 22.1571 25.6569 20.6569C27.1571 19.1566 28 17.1217 28 15C28 12.8783 27.1571 10.8434 25.6569 9.34315C24.1566 7.84285 22.1217 7 20 7C17.8783 7 15.8434 7.84285 14.3431 9.34315C12.8429 10.8434 12 12.8783 12 15C12 17.1217 12.8429 19.1566 14.3431 20.6569C15.8434 22.1571 17.8783 23 20 23Z" fill="white"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20 38C29.941 38 38 29.941 38 20C38 10.059 29.941 2 20 2C10.059 2 2 10.059 2 20C2 29.941 10.059 38 20 38ZM20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40Z" fill="white"/>
                                </svg>
                            </div>
                            <div className="email-input">
                                <input type="text" placeholder='Email'
                                    ref={emailRef}
                                />
                                <h6>
                                    {error.length > 0 ? error : message}      
                                </h6>
                            </div>
                        </div>
                        <div className="button-form opener">
                            <button disabled={loading} className="login">
                                Reset Password
                            </button>
                        </div>
                        <div className="button-form slash">
                            <div className="text">
                            Have an account?
                            </div>
                            <button className="fg-pass">
                                <Link to="/login">
                                    Login
                                </Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Forgot