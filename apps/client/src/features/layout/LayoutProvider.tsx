import * as React from 'react';
import { Footer } from './footer/Footer';
import { Navigation } from './navigation/Navigation';

export interface ILayoutProviderProps {
    children?: React.ReactNode;
}

export function LayoutProvider({ children }: ILayoutProviderProps) {
    return (
        <div id="layoutProvider">
            <Navigation />
            {children}
            <Footer />
        </div>
    );
}
