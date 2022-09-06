import * as React from 'react';
import { LayoutProvider } from '../layout/LayoutProvider';

export interface IAsunSwapProps {}

export function AsunSwap(props: IAsunSwapProps) {
    return (
        <div id="asunSwap">
            <LayoutProvider />
            swap page
        </div>
    );
}
