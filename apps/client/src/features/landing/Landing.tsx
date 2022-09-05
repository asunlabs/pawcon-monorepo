import * as React from 'react';
import './Landing.css';
import githubLogo from './github.png';
import { Buttom } from '../layout/button/Button';
import { Link } from 'react-router-dom';

// Wavy landing component migration

function TopCreatorBanner() {
    return (
        <div className="landingBanner" id="top">
            <img
                src={githubLogo}
                id="github"
                alt="github logo"
                loading="lazy"
            />
            <span>
                <a
                    href="https://github.com/developerasun"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    @developerasun
                </a>
            </span>
        </div>
    );
}

function MiddleBody() {
    return (
        <div className="landingBanner" id="middle">
            <h1>Hello Visitor</h1>

            {/* should route to PawCon  */}
            <Link to={'/mint'}>
                <Buttom text="Launch app" className="launchButton" />
            </Link>
        </div>
    );
}

function BottomWavyBanner() {
    return (
        <div className="landingBanner" id="bottom">
            <div className="waves"></div>
            <div className="waves"></div>
            <div className="waves"></div>
            <div className="waves"></div>
        </div>
    );
}

export function Landing() {
    return (
        <>
            <TopCreatorBanner />
            <MiddleBody />
            <BottomWavyBanner />
        </>
    );
}
