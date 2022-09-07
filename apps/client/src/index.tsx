import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AsunSwap } from './features/swap/AsunSwap';
import { AsunMint } from './features/mint/AsunMint';
import { Page404 } from './features/layout/page404/Page404';
import { TokenDetail } from './features/mint/collection/TokenDetail';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />

                <Route path="mint" element={<AsunMint />} />
                <Route path="nft">
                    <Route path=":title" element={<TokenDetail />} />
                </Route>

                <Route path="swap" element={<AsunSwap />} />
                <Route path="*" element={<Page404 bannerType="image" />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
