import * as React from 'react';
import { LayoutProvider } from '../layout/LayoutProvider';

export interface IAsunMintProps {}

export function AsunMint(props: IAsunMintProps) {
    return (
        <div id="asunMint">
            <LayoutProvider>mint page</LayoutProvider>
        </div>
    );
}
