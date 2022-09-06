import * as React from 'react';
import './Card.css';

export interface ICardProps {
    date?: string;
    title?: string;
    description: string | string[];
    image?: string;
    author?: string;
}

export function Card({ description, date, title, image, author }: ICardProps) {
    return (
        <div className="card">
            <img
                className="cardImage"
                src={image}
                alt="gallery card"
                loading="lazy"
            />
            <div className="cardDetails">
                <span className="date">{date}</span>
                <h3 className="title">{title}</h3>
                <span className="author">{author}</span>
                <p className="description">{description}</p>
            </div>
        </div>
    );
}
