import * as React from 'react';
import { Buttom } from '../button/Button';
import './Card.css';

export interface ICardProps {
    title?: string;
    description?: string | string[];
    image?: string;
    bid?: string;
    text?: string;
}

export function Card({ description, title, image, bid, text }: ICardProps) {
    return (
        <div className="card">
            <img
                className="cardImage"
                src={image}
                alt="gallery card"
                loading="lazy"
            />
            <div className="cardDetails">
                <h3 className="title">{title}</h3>
                <span className="bid">{bid} ETH</span>
                <p className="description">{description}</p>
            </div>
            <Buttom text={text} />
        </div>
    );
}
