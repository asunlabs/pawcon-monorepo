import * as React from 'react';
import { Link } from 'react-router-dom';
import { Buttom } from '../button/Button';
import './Card.css';

export interface ICardProps {
    title?: string;
    description?: string | string[];
    image?: string;
    bid?: string;
    text?: string;
    linkTo?: string;
}

export function Card({
    description,
    title,
    image,
    bid,
    text,
    linkTo,
}: ICardProps) {
    return (
        <div className="card">
            {image !== undefined ? (
                <img
                    className="cardImage"
                    src={image}
                    alt="card"
                    loading="lazy"
                />
            ) : (
                ''
            )}

            <div className="cardDetails">
                <h3 className="title">{title}</h3>
                <span className="bid">{bid}</span>
                <p className="description">{description}</p>
            </div>

            {linkTo !== undefined ? (
                <Link to={linkTo}>
                    <Buttom text={text} />{' '}
                </Link>
            ) : (
                <Buttom text={text} />
            )}
        </div>
    );
}
