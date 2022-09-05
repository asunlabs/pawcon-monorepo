import * as React from 'react';
import { Navigation } from './navigation/Navigation';

export interface ILayoutProviderProps {}

export function LayoutProvider(props: ILayoutProviderProps) {
    return (
        <>
            <Navigation />
        </>
    );
}
