import { title } from 'process';
import * as React from 'react';

export type BannerType = 'text' | 'image' | 'video';

export interface IBannerProps {
    bannerType: BannerType;
    title?: string;
    description?: string | string[];
    image?: string;
    video?: string;
}

export interface IImageBannerProps {
    image?: string;
}

function ImageBanner({ image }: IImageBannerProps) {
    return (
        <div className="banner" id="imageBanner">
            <img src={image} alt="banner" loading="lazy" />
        </div>
    );
}

export interface IVideoBannerProps {
    video?: string;
    title?: string;
}

function VideoBanner({ video, title }: IVideoBannerProps) {
    return (
        <div className="banner" id="videoBanner">
            <iframe
                title={title}
                src={video}
                frameBorder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}

export interface ITextBanner {
    title?: string;
    description?: string | string[];
}

function TextBanner({ title, description }: ITextBanner) {
    return (
        <div className="banner" id="textBanner">
            <span>{title}</span>
            <p>{description}</p>
        </div>
    );
}

export function Banner({
    bannerType,
    title,
    description,
    image,
    video,
}: IBannerProps) {
    return (
        <section id="banner">
            {bannerType === 'image' ? (
                <ImageBanner image={image} />
            ) : bannerType === 'video' ? (
                <VideoBanner video={video} />
            ) : (
                <TextBanner title={title} description={description} />
            )}
        </section>
    );
}
