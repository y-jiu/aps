import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Monitoring from './pages/monitoring'
import Planning from './pages/planning'
import Sales from './pages/sales'
import System from './pages/system'
import RouteToInformation from './pages';
import DefaultLayout from './layouts/DefaultLayout';
import Information from './pages/information';
import Delivery from './pages/delivery';
import Performance from './pages/performance';
import Login from './pages/login';

function App() {
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<DefaultLayout />}>
            <Route index element={<RouteToInformation />} />
            <Route path="/information/*" element={<Information />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/delivery/*" element={<Delivery />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/performance/*" element={<Performance />} />
            <Route path="/monitoring/*" element={<Monitoring />} />
            <Route path="/system" element={<System />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
