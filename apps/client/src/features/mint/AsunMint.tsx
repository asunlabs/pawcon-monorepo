import * as React from 'react';
import './AsunMint.css';
import { LayoutProvider } from '../layout/LayoutProvider';
import { Welcome } from './welcome/Welcome';
import { Collection } from './collection/Collection';
import { Featured } from './featured/Featured';
import { About } from './about/About';

export interface IAsunMintProps {}

export function AsunMint(props: IAsunMintProps) {
    return (
        <LayoutProvider>
            <div id="asunMint">
                <h1 id="pageTitle">AsunMint</h1>
                <Welcome />
                <Collection />
                <Featured />
                <About />
            </div>
        </LayoutProvider>
    );
}
