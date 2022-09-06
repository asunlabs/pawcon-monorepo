import * as React from 'react';
import { Banner } from '../../layout/banner/Banner';
import { Buttom } from '../../layout/button/Button';
import './Welcome.css';

const welcomeImageURL = 'https://i.ibb.co/R9pX6Zz/home-be-curious.png';

export interface ICounterProps {
    title: string;
    count: number;
}

function Counter({ title, count }: ICounterProps) {
    return (
        <div className="content">
            <span>{title}</span>
            <span>{count}</span>
        </div>
    );
}

export interface IWelcomeProps {}

export function Welcome(props: IWelcomeProps) {
    return (
        <div className="asunMintComponent" id="welcome">
            <div id="title">
                <span className="asunMintComponentTitle">
                    Simple yet powerful
                </span>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Quaerat nulla nihil corrupti perspiciatis saepe,
                    necessitatibus quis recusandae id dolores natus aperiam
                    architecto exercitationem, error alias tempora tempore
                    nostrum omnis eum?
                </p>
                <Buttom text="Explore" />
                <div id="counter">
                    <Counter title="Artwork" count={99} />
                    <Counter title="Contributor" count={99} />
                </div>
            </div>
            <div id="image">
                <Banner bannerType="image" image={welcomeImageURL} />
            </div>
        </div>
    );
}
