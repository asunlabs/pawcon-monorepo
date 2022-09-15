import * as React from 'react';
import './Modal.css';
import { v4 } from 'uuid';

function LoginMethod() {
    return (
        <div id="login">
            <form id="loginForm" name="loginForm">
                <fieldset>
                    <legend>Email address</legend>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="abcd@gmail.com"
                        required
                    />
                    <p className="validationMsg"></p>
                </fieldset>
                <fieldset>
                    <legend>Password</legend>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="more than 8 characters"
                        required
                    />
                    <p className="validationMsg"></p>
                </fieldset>
                <u>
                    {/* TODO fix href later */}
                    <i>
                        <a href="www.google.com">Forgot password?</a>
                    </i>
                </u>
            </form>
        </div>
    );
}

export interface IModalContentProps {
    image?: string;
    content?: string;
}

export interface IModalProps {
    titles?: string[];
    contents?: IModalContentProps[];
}

export function Modal({ titles, contents }: IModalProps) {
    return (
        <div id="modal">
            <div id="title">
                {titles?.map((title) => {
                    return <span key={v4()}>{title}</span>;
                })}
            </div>
            <div id="content">
                {contents?.map((content) => {
                    return (
                        <div key={v4()}>
                            <img src={content.image} alt="thumnail" />
                            <span>{content.content}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
