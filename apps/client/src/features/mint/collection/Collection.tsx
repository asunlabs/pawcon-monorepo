import * as React from 'react';
import { APIContext } from '../../../app/context/APIContext';
import { Card } from '../../layout/card/Card';
import './Collection.css';

export function Collection() {
    const apiData = React.useContext(APIContext);
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
                TODO: add infinite scroll
            */}
            <div className="collectionItem" id="gallery">
                {apiData ? (
                    apiData.map(({ image, name, description }: any) => {
                        return (
                            <Card
                                image={image}
                                title={name}
                                description={description}
                                bid="2 ETH"
                                text="Place a bid"
                                linkTo={baseReactRouterURL.concat('/', name)}
                            />
                        );
                    })
                ) : (
                    <p>Image fetching failed</p>
                )}
            </div>
        </div>
    );
}
