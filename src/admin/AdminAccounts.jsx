import React, { useContext, useEffect, useState } from 'react';
import { useAccount } from '../context/AccountContext';

const useDebounce = (value,delay) => {
    const [debouncedValue,setDebounceValue] = useState(value)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebounceValue(value)
        },delay)

        return () => {
            clearTimeout(timeoutId)
        }
    },[value,delay])

    return debouncedValue
}

const AdminAccounts = () => {
    const { accountList, deleteAccount, updateAccount } = useAccount();

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [updatedAccount, setUpdatedAccount] = useState({emailAcc: '', usernameAcc: '', type: ''});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [search,setSearch] = useState('')
    const [finalUpdate,setFinalUpdate] = useState(false)
    const debouncedSearch = useDebounce(search,750)
    const [errorMessage, setErrorMessage] = useState("");

    const [allAccounts, setAllAccounts] = useState(accountList);
    const [adminAccounts, setAdminAccounts] = useState(accountList.filter((acc) => acc.type === 'admin'));
    const [customerAccounts, setCustomerAccounts] = useState(accountList.filter((acc) => acc.type !== 'admin'));
    const [filteredAdminAccounts, setFilteredAdminAccounts] = useState(adminAccounts);
    const [filteredCustomerAccounts, setFilteredCustomerAccounts] = useState(customerAccounts);

    // This effect updates allAccounts whenever accountList changes
    useEffect(() => {
        setAllAccounts(accountList);
        setAdminAccounts(accountList.filter((acc) => acc.type === 'admin'));
        setCustomerAccounts(accountList.filter((acc) => acc.type !== 'admin'));
        setFilteredAdminAccounts(adminAccounts);
        setFilteredCustomerAccounts(customerAccounts);
    }, [accountList]);

    // This effect updates filteredAdminAccounts whenever allAccounts changes
    useEffect(() => {
        setFilteredAdminAccounts(adminAccounts);
    }, [adminAccounts]);

    // This effect updates filteredCustomerAccounts whenever debouncedSearch or customerAccounts changes
    useEffect(() => {
        if (debouncedSearch.trim() === '') {
            setFilteredCustomerAccounts(customerAccounts);
        } else {
            const lowercasedSearch = debouncedSearch.toLowerCase();
            const results = customerAccounts.filter(
                (account) =>
                account?.emailAcc?.toLowerCase().includes(lowercasedSearch) ||
                account?.usernameAcc?.toLowerCase().includes(lowercasedSearch)
            );
            setFilteredCustomerAccounts(results);
        }
    }, [debouncedSearch, customerAccounts]);

    const handleDelete = (uid) => {
        deleteAccount(uid);
    }

    const handleUpdate = (uid) => {
        setSelectedAccount(uid);
        const account = allAccounts.find(account => account.uid === uid);
        setUpdatedAccount(account);
    }

    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        if (updatedAccount.emailAcc.length > 0 && updatedAccount.usernameAcc.length > 0 && updatedAccount.type.length > 0) {
            updateAccount(selectedAccount, updatedAccount.emailAcc, updatedAccount.usernameAcc, updatedAccount.type);
            setUpdatedAccount({emailAcc: '', usernameAcc: '', type: ''})
            setSelectedAccount(null);
            setFinalUpdate(true);
            setErrorMessage("");
        } else {
            setErrorMessage("All fields must be pass in");
        }
    }

    const handleFinalUpdate = () => {
        setFinalUpdate(false);
    }

    // Get current posts
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentAdminItems = filteredAdminAccounts.slice(indexOfFirstItem, indexOfLastItem);
    const currentAdminItems = filteredAdminAccounts;
    const currentCustomerItems = filteredCustomerAccounts.slice(indexOfFirstItem, indexOfLastItem);

    // Check if you're at the first page
    const isFirstPage = currentPage === 1;

    // Check if you're at the last page
    const isLastPage = currentPage >= Math.ceil(filteredCustomerAccounts.length / itemsPerPage);


    // Change page
    const paginate = (direction) => {
        if (direction === 'next' && currentPage < Math.ceil(customerAccounts.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
        else if (direction === 'previous' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }


    return (
        <div className='admin-accounts'>

            {finalUpdate && 
                <div className="popUpdate">
                    <div className="popCompo">
                        <div className="circle">
                            <svg width="30" height="21" viewBox="0 0 30 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.7203 20.6893L0.290262 10.2693C0.126435 10.078 0.0408293 9.83191 0.0505505 9.58023C0.0602716 9.32856 0.164604 9.08982 0.342699 8.91172C0.520793 8.73363 0.759532 8.6293 1.01121 8.61957C1.26288 8.60985 1.50896 8.69546 1.70026 8.85929L10.7003 17.8593L28.2903 0.289285C28.4816 0.125459 28.7276 0.0398528 28.9793 0.0495739C29.231 0.0592951 29.4697 0.163627 29.6478 0.341722C29.8259 0.519817 29.9303 0.758555 29.94 1.01023C29.9497 1.26191 29.8641 1.50798 29.7003 1.69929L10.7203 20.6893Z" fill="#fff"/>
                            </svg>
                        </div>
                        <button className='btn btn-success' onClick={handleFinalUpdate}>
                            Done
                        </button>   
                    </div>
                </div>
            }

            <h1> Account Management </h1>
            <div className="table-responsive">
                <div className="client-nav">
                    <h5 className="table-title">Admins</h5>
                </div>
                <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Email</th>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAdminItems.map(account => (
                            <tr key={account.uid}>
                                <td>{account.emailAcc}</td>
                                <td>{account.usernameAcc}</td>
                                <td>{account.type}</td>
                                {/* <td><button className="btn btn-primary" onClick={() => handleUpdate(account.uid)}>Update</button></td> */}
                                <td><button className="btn btn-danger" onClick={() => handleDelete(account.uid)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <form onSubmit={handleSubmitUpdate}>
                <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="text" placeholder="Email" value={updatedAccount.emailAcc} onChange={e => setUpdatedAccount({...updatedAccount, emailAcc: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Name</label>
                    <input className="form-control" type="text" placeholder="Username" value={updatedAccount.usernameAcc} onChange={e => setUpdatedAccount({...updatedAccount, usernameAcc: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <input className="form-control" type="text" placeholder="Type" value={updatedAccount.type} onChange={e => setUpdatedAccount({...updatedAccount, type: e.target.value})} />
                </div>
                <div className="form-group button-side">
                    <label htmlFor=""> Update </label>
                    <button className="btn btn-success" type="submit">Confirm Update</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </form>
            
            <div className="table-responsive">
                <div className="client-nav">
                    <h5 className="table-title">Customer Accounts</h5>
                    <input 
                        type="text" 
                        placeholder='Search'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <section>
                        <ul className="pagination">
                            <li className="page-item">
                                <button onClick={() => paginate('previous')} className="page-link" disabled={isFirstPage}>
                                    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.36296 13.6133C8.47884 13.4976 8.57077 13.3603 8.6335 13.209C8.69623 13.0578 8.72852 12.8957 8.72852 12.732C8.72852 12.5683 8.69623 12.4062 8.6335 12.255C8.57077 12.1038 8.47884 11.9664 8.36296 11.8508L3.51296 7.00077L8.36296 2.15077C8.59668 1.91704 8.72799 1.60005 8.72799 1.26952C8.72799 0.938984 8.59668 0.621987 8.36296 0.388265C8.12924 0.154543 7.81224 0.023241 7.48171 0.023241C7.15118 0.023241 6.83418 0.154543 6.60046 0.388265L0.86296 6.12577C0.747081 6.24141 0.655146 6.37877 0.59242 6.52999C0.529693 6.6812 0.497406 6.84331 0.497406 7.00702C0.497406 7.17073 0.529693 7.33283 0.59242 7.48405C0.655146 7.63526 0.747081 7.77262 0.86296 7.88827L6.60046 13.6258C7.07546 14.1008 7.87546 14.1008 8.36296 13.6133Z" fill="black"/>
                                    </svg>
                                </button>
                            </li>
                            <li className="page-item">
                                <button onClick={() => paginate('next')} className="page-link" disabled={isLastPage}>
                                    <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.862626 0.39064C0.746746 0.506282 0.654812 0.643643 0.592085 0.79486C0.529358 0.946077 0.49707 1.10818 0.49707 1.27189C0.49707 1.4356 0.529358 1.5977 0.592085 1.74892C0.654812 1.90014 0.746746 2.0375 0.862626 2.15314L5.71262 7.00314L0.862626 11.8531C0.628904 12.0869 0.4976 12.4039 0.4976 12.7344C0.4976 13.0649 0.628904 13.3819 0.862626 13.6156C1.09635 13.8494 1.41334 13.9807 1.74388 13.9807C2.07441 13.9807 2.3914 13.8494 2.62513 13.6156L8.36263 7.87814C8.47851 7.7625 8.57044 7.62514 8.63317 7.47392C8.69589 7.3227 8.72818 7.1606 8.72818 6.99689C8.72818 6.83318 8.69589 6.67108 8.63317 6.51986C8.57044 6.36864 8.47851 6.23128 8.36263 6.11564L2.62513 0.37814C2.15013 -0.0968599 1.35013 -0.0968596 0.862626 0.39064Z" fill="black"/>
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    </section>
                </div>
                <table className="table table-responsive table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Email</th>
                            <th scope="col">Name</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCustomerItems.map(account => (
                            <tr key={account.uid}>
                                <td>{account.emailAcc}</td>
                                <td>{account.usernameAcc}</td>
                                <td><button className="btn btn-primary" onClick={() => handleUpdate(account.uid)}>Update</button></td>
                                <td><button className="btn btn-danger" onClick={() => handleDelete(account.uid)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminAccounts
