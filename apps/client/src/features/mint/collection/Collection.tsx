import * as React from 'react';
import { Card } from '../../layout/card/Card';
import './Collection.css';

export interface ICollectionProps {}

export function Collection(props: ICollectionProps) {
    return (
        <div className="asunMintComponent" id="collection">
            <div id="introduction">
                <span className="asunMintComponentTitle">Collection</span>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Voluptas dolorem, earum reprehenderit illum nemo ad aut
                    consectetur vero possimus tenetur. Laudantium repellat odit
                    magnam tempore tenetur mollitia accusamus excepturi sit?
                </p>
            </div>
            {/* TODO: infinite scroll gallery */}
            <div id="gallery">
                <Card
                    date="2099.99.99"
                    description={'Temp'}
                    author="Jake Sung"
                />
                <Card
                    date="2099.99.99"
                    description={'Temp'}
                    author="Jake Sung"
                />
                <Card
                    date="2099.99.99"
                    description={'Temp'}
                    author="Jake Sung"
                />
            </div>
        </div>
    );
}
