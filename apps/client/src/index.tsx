import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AsunSwap } from './features/swap/AsunSwap';
import { AsunMint } from './features/mint/AsunMint';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="mint" element={<AsunMint />} />
                <Route path="swap" element={<AsunSwap />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
