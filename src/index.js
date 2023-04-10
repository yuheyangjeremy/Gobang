import ReactDOM from "react-dom/client";
import React from 'react';

import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from './client/home';
import Login from './client/login';
import User from './client/user';
import Admin from './client/admin';

const APP = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/index" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(
    <React.StrictMode>
        <APP />
    </React.StrictMode>
);