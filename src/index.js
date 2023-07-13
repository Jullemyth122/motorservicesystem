import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import AccountProvider from './context/AccountContext';
import ServicesProvider from './context/ServicesContext';
import BrandsProvider from './context/BrandsContext';
import InventoryProvider from './context/InventoryContext';
import CustomerProvider from './context/CustomerContext';
import FinalProvider from './context/FinalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <FinalProvider>
      <AccountProvider>
        <ServicesProvider>
          <BrandsProvider>
            <InventoryProvider>
              <CustomerProvider>
                <App />
              </CustomerProvider>
            </InventoryProvider>
          </BrandsProvider>
        </ServicesProvider>
      </AccountProvider>
    </FinalProvider>
  </React.Fragment>
);
