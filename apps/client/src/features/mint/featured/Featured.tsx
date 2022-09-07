import * as React from 'react';
import { Card } from '../../layout/card/Card';
import './Featured.css';

export interface IFeaturedProps {}

export function Featured(props: IFeaturedProps) {
    return (
        <div className="asunMintComponent" id="featured">
            <div className="featuredItem" id="introduction">
                <span className="asunMintComponentTitle">Featured</span>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Voluptas dolorem, earum reprehenderit illum nemo ad aut
                    consectetur vero possimus tenetur. Laudantium repellat odit
                    magnam tempore tenetur mollitia accusamus excepturi sit?
                </p>
            </div>

            {/* Featured item is up to 3 */}
            <div className="featuredItem" id="featuredGallery">
                <Card
                    description={'Lorem ipsum, dolor sit amet consectetur'}
                    bid="2"
                    text="Place a bid"
                />
                <Card
                    description={'vero possimus tenetur. Laudantium'}
                    bid="3"
                    text="Place a bid"
                />
                <Card
                    description={'tenetur mollitia accusamus excepturi sit?'}
                    bid="1.4"
                    text="Place a bid"
                />
            </div>
        </div>
    );
}
