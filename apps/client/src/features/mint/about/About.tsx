import * as React from 'react';
import { Card } from '../../layout/card/Card';
import './About.css';

export interface IAboutProps {}

export function About(props: IAboutProps) {
    return (
        <div className="asunMintComponent" id="about">
            <div className="aboutItem" id="introduction">
                <span className="asunMintComponentTitle">About</span>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Voluptas dolorem, earum reprehenderit illum nemo ad aut
                    consectetur vero possimus tenetur. Laudantium repellat odit
                    magnam tempore tenetur mollitia accusamus excepturi sit?
                </p>
            </div>

            <div className="aboutItem" id="aboutGallery">
                <Card
                    title="Dev promotion"
                    description={'Lorem ipsum, dolor sit amet consectetur'}
                    text="Check Github"
                />
                <Card
                    title="Dev documentation"
                    description={'vero possimus tenetur. Laudantium'}
                    text="Read docs"
                />
            </div>
        </div>
    );
}
