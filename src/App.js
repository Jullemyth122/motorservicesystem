import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Navbar from "./client/Navbar";
import Home from "./client/Home";
import './scss/nav.scss'
import './scss/home.scss'
import './scss/auth.scss'
import './scss/admin/dashboard.scss'
import './scss/admin/services.scss'
import './scss/admin/brands.scss'
import './scss/admin/inventory.scss'
import './scss/admin/books.scss'
import './scss/client/shop.scss'
import './scss/client/card.scss'
import './scss/client/book.scss'
import './scss/client/info.scss'
import './scss/client/servicesclient.scss'
import './scss/admin/accounts.scss'

import Register  from "./client/auth/Register";
import Login from "./client/auth/Login";
import Forgot from "./client/auth/Forgot";
import AdminLogin from "./admin/auth/AdminLogin";
import { useAccount } from "./context/AccountContext";
import Dashboard from "./admin/Dashboard";
import AdminServices from "./admin/AdminServices";
import AdminBooks from "./admin/AdminBooks";
import AdminInventory from "./admin/AdminInventory";
import AdminBrands from "./admin/AdminBrands";
import Shop from "./client/dashboard/Shop";
import Card from "./client/dashboard/Card";
import ServiceClient from "./client/dashboard/Service";
import BookDash from "./client/dashboard/BookDash";
import Info from "./client/dashboard/Info";
import AdminAccounts from "./admin/AdminAccounts";
import About from "./client/About";
import Contact from "./client/Contact";

function App() {

  const { user,owner } = useAccount()

  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          {owner?.type == 'admin' && user?.email.length > 0 ? 
          <>
            <Route path="/" element={<Dashboard/>}></Route>
            <Route path="/services" element={<AdminServices/>}></Route>
            <Route path="/booking" element={<AdminBooks/>}></Route>
            <Route path="/inventory" element={<AdminInventory/>}></Route>
            <Route path="/brands" element={<AdminBrands/>}></Route>          
            <Route path="/accounts" element={<AdminAccounts/>}></Route>          
          </>
          :
          <>          
            <Route path="/*" element={<Home/>}></Route>
            <Route path="/info" element={<Info/>}></Route>
            <Route path="/service" element={<ServiceClient/>}></Route>
            <Route path="/shop" element={<Shop/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/contact" element={<Contact/>}></Route>          
            <Route path="/about" element={<About/>}></Route>          
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/forgot" element={<Forgot/>}></Route>
            <Route path="/adminpanel" element={<AdminLogin/>}></Route>
            <Route path="/book" element={<BookDash/>}></Route>
            <Route path="/card/:id" element={<Card />} /> {/* Add the Card route */}
          </>
          }
        </Routes>
      </Router>
    </div>
  );
}

export default App;
