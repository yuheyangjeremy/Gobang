import ReactDOM from "react-dom/client";
import React from 'react';

import { Route, Routes, BrowserRouter } from "react-router-dom";

import Login from './client/login';

const APP = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
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