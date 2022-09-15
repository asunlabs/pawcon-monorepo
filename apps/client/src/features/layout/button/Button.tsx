import * as React from 'react';
import './Button.css';

export interface ButtonProps {
    callback?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    id?: string;
    text?: string;
}

export function Buttom({ callback, text, className, id }: ButtonProps) {
    return (
        <button onClick={callback} className={className} id={id} type="submit">
            {text}
        </button>
    );
}
