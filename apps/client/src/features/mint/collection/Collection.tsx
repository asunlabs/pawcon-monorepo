import { title } from 'process';
import * as React from 'react';
import { Card } from '../../layout/card/Card';
import './Collection.css';

// TODO set server API
const cardsAPI = [];

const CollectionContext = React.createContext('');

interface ICollectionContextProviderProps {
    children?: React.ReactNode;
}

function CollectionContextProvider({
    children,
}: ICollectionContextProviderProps) {
    return (
        <CollectionContext.Provider value="">
            {children}
        </CollectionContext.Provider>
    );
}

export interface ICollectionProps {}

export function Collection(props: ICollectionProps) {
    const baseReactRouterURL = '/nft';
    return (
        <div className="asunMintComponent" id="collection">
            <div className="collectionItem" id="introduction">
                <span className="asunMintComponentTitle">Collection</span>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Voluptas dolorem, earum reprehenderit illum nemo ad aut
                    consectetur vero possimus tenetur. Laudantium repellat odit
                    magnam tempore tenetur mollitia accusamus excepturi sit?
                </p>
            </div>
            {/* 
                TODO: 
             1) change to dynamic rendering with API
             2) Infinite scroll gallery
            */}

            <div className="collectionItem" id="gallery">
                <Card
                    title="test"
                    description={'Lorem ipsum, dolor sit amet consectetur'}
                    bid="2 ETH"
                    text="Place a bid"
                    linkTo={baseReactRouterURL.concat('/', 'test')}
                />
                <Card
                    description={'vero possimus tenetur. Laudantium'}
                    bid="3 ETH"
                    text="Place a bid"
                />
                <Card
                    description={'tenetur mollitia accusamus excepturi sit?'}
                    bid="1.4 ETH"
                    text="Place a bid"
                />
                <Card
                    description={'Lorem ipsum, dolor sit amet consectetur'}
                    bid="2 ETH"
                    text="Place a bid"
                />
                <Card
                    description={'vero possimus tenetur. Laudantium'}
                    bid="3 ETH"
                    text="Place a bid"
                />
                <Card
                    description={'tenetur mollitia accusamus excepturi sit?'}
                    bid="1.4 ETH"
                    text="Place a bid"
                />
            </div>
        </div>
    );
}
