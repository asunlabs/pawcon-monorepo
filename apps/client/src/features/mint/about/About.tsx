import * as React from 'react';
import { Banner } from '../../layout/banner/Banner';
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
                <Banner
                    bannerType="video"
                    video="https://www.youtube.com/embed/Y1ediZp-SE0"
                    title="Dev promotion"
                />
                <Card
                    title="Dev promotion"
                    description={'Lorem ipsum, dolor sit amet consectetur'}
                    // TODO set image later
                    image=""
                    text="Check Github"
                />
            </div>
        </div>
    );
}
