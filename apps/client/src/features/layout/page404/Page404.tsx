import * as React from 'react';
import { Banner, IBannerProps } from '../banner/Banner';
import './Page404.css';

const page404ImageAsset = 'https://i.ibb.co/RbRD6Fr/page404.png';

export function Page404({ bannerType }: IBannerProps) {
    return <Banner bannerType="image" image={page404ImageAsset} />;
}
