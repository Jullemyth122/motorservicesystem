import { signInWithEmailAndPassword, } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { authentication } from '../../lib/firebase'

const AdminLogin = () => {

    const [errors,setErrors] = useState({
        email_:'',
        pass_:'',
    })
    
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        signInWithEmailAndPassword(authentication,email,password)
        .then(res => {
            setErrors({
                email_:'',
                pass_:''
            })
            setTimeout(() => {
                navigate("/")
            },500)

        })
        .catch(err => {
            const errorCode = err.code;
            console.log(errorCode)
            if ('auth/wrong-password' == errorCode) {
                setErrors({
                    email_:'',
                    pass_:'Wrong Password'
                })            
            } else if ('auth/user-not-found' == errorCode) {
                setErrors({
                    email_:'Email not found',
                    pass_:''
                })               
            } else if ('auth/invalid-email' == errorCode) {
                setErrors({
                    email_:"Invalid Email",
                    pass_:'',
                })
            }
        })
    }

    return (
        <div className="login-component">
            <img
                className='transparent-background' 
                src="./img/bg.jpg" alt="" 
            />
            <div className="login-subcomponent">
                <div className='signin-component'>
                    <form onSubmit={handleSubmit}>
                        <div className="row d-flex align-items-center justify-content-center">
                            <div className="login-header col-5">
                                <p>
                                Admin
                                </p>
                            </div>
                        </div>
                        <div className="input-form">
                            <div className="logo">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.809 30.714C17.654 29.714 22.367 29.8 29.221 30.749C29.7174 30.821 30.1709 31.0701 30.4979 31.4504C30.8249 31.8307 31.0033 32.3165 31 32.818C31 33.298 30.835 33.764 30.537 34.128C30.0176 34.7626 29.4855 35.3868 28.941 36H31.582C31.748 35.802 31.915 35.6 32.084 35.395C32.6772 34.6676 33.0007 33.7576 33 32.819C33 30.794 31.522 29.049 29.495 28.769C22.479 27.798 17.575 27.705 10.52 28.736C8.472 29.035 7 30.807 7 32.846C7 33.751 7.295 34.646 7.854 35.371C8.019 35.585 8.182 35.795 8.344 36.001H10.921C10.4144 35.3945 9.92032 34.7777 9.439 34.151C9.15296 33.7758 8.99866 33.3168 9 32.845C9 31.768 9.774 30.865 10.809 30.714ZM20 21C20.7879 21 21.5681 20.8448 22.2961 20.5433C23.0241 20.2417 23.6855 19.7998 24.2426 19.2426C24.7998 18.6855 25.2417 18.0241 25.5433 17.2961C25.8448 16.5681 26 15.7879 26 15C26 14.2121 25.8448 13.4319 25.5433 12.7039C25.2417 11.9759 24.7998 11.3145 24.2426 10.7574C23.6855 10.2002 23.0241 9.75825 22.2961 9.45672C21.5681 9.15519 20.7879 9 20 9C18.4087 9 16.8826 9.63214 15.7574 10.7574C14.6321 11.8826 14 13.4087 14 15C14 16.5913 14.6321 18.1174 15.7574 19.2426C16.8826 20.3679 18.4087 21 20 21ZM20 23C22.1217 23 24.1566 22.1571 25.6569 20.6569C27.1571 19.1566 28 17.1217 28 15C28 12.8783 27.1571 10.8434 25.6569 9.34315C24.1566 7.84285 22.1217 7 20 7C17.8783 7 15.8434 7.84285 14.3431 9.34315C12.8429 10.8434 12 12.8783 12 15C12 17.1217 12.8429 19.1566 14.3431 20.6569C15.8434 22.1571 17.8783 23 20 23Z" fill="white"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M20 38C29.941 38 38 29.941 38 20C38 10.059 29.941 2 20 2C10.059 2 2 10.059 2 20C2 29.941 10.059 38 20 38ZM20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40Z" fill="white"/>
                            </svg>
                            </div>
                            <div className="email-input">
                                <input type="text" placeholder='Email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <h6>
                                    {errors.email_}      
                                </h6>
                            </div>
                        </div>
                        <div className="input-form">
                            <div className="logo">
                            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.99996 35.6667C3.08329 35.6667 2.29885 35.3406 1.64663 34.6884C0.993292 34.035 0.666626 33.25 0.666626 32.3334V15.6667C0.666626 14.75 0.993292 13.965 1.64663 13.3117C2.29885 12.6595 3.08329 12.3334 3.99996 12.3334H5.66663V9.00002C5.66663 6.69446 6.4794 4.72891 8.10496 3.10335C9.7294 1.47891 11.6944 0.666687 14 0.666687C16.3055 0.666687 18.2711 1.47891 19.8966 3.10335C21.5211 4.72891 22.3333 6.69446 22.3333 9.00002V12.3334H24C24.9166 12.3334 25.7016 12.6595 26.355 13.3117C27.0072 13.965 27.3333 14.75 27.3333 15.6667V32.3334C27.3333 33.25 27.0072 34.035 26.355 34.6884C25.7016 35.3406 24.9166 35.6667 24 35.6667H3.99996ZM3.99996 32.3334H24V15.6667H3.99996V32.3334ZM14 27.3334C14.9166 27.3334 15.7016 27.0072 16.355 26.355C17.0072 25.7017 17.3333 24.9167 17.3333 24C17.3333 23.0834 17.0072 22.2984 16.355 21.645C15.7016 20.9928 14.9166 20.6667 14 20.6667C13.0833 20.6667 12.2988 20.9928 11.6466 21.645C10.9933 22.2984 10.6666 23.0834 10.6666 24C10.6666 24.9167 10.9933 25.7017 11.6466 26.355C12.2988 27.0072 13.0833 27.3334 14 27.3334ZM8.99996 12.3334H19V9.00002C19 7.61113 18.5138 6.43058 17.5416 5.45835C16.5694 4.48613 15.3888 4.00002 14 4.00002C12.6111 4.00002 11.4305 4.48613 10.4583 5.45835C9.48607 6.43058 8.99996 7.61113 8.99996 9.00002V12.3334ZM3.99996 32.3334V15.6667V32.3334Z" fill="white"/>
                            </svg>
                            </div>
                            <div className="pass-input">
                                <input type="password" placeholder='Password'
                                    value={password}
                                    onChange={e=> setPassword(e.target.value)}
                                />
                                <h6>
                                    {errors.pass_}      
                                </h6>
                            </div>
                        </div>
                        <div className="button-form">
                            <button className="login">
                            Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin