import * as React from 'react';
import { v4 } from 'uuid';
import './Footer.css';

interface IFooterSectionProps {
    title: string;
    items: string[];
}
function FooterSection({ title, items }: IFooterSectionProps) {
    return (
        <div className="footerSection">
            <span>{title}</span>
            <ul>
                {items.map((item) => {
                    return <li key={v4()}>{item}</li>;
                })}
            </ul>
        </div>
    );
}

export function Footer() {
    return (
        <footer id="footer">
            <FooterSection
                title="AsunLabs"
                items={[
                    'pawcon-monorepo',
                    'learn-blockchain',
                    'courses',
                    'my-assets',
                ]}
            />
            <FooterSection
                title="Contact"
                items={[
                    'Gmail nellow1102@gmail.com',
                    'Phone +82.010.2985.2984',
                    'Linkedin @jakesung',
                ]}
            />
            <FooterSection
                title="Copyright ©"
                items={['2022 DEVELOPERASUN All rights reserved']}
            />
        </footer>
    );
}
