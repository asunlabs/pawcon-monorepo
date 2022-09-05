import * as React from 'react';
import './Button.css';

export interface ButtonProps {
    callback?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    text?: string;
}

export function Buttom({ callback, text, className }: ButtonProps) {
    return (
        <button onClick={callback} className={className} type="submit">
            {text}
        </button>
    );
}
