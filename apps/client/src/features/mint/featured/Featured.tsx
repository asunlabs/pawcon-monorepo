import * as React from 'react';
import { APIContext } from '../../../app/context/APIContext';
import { Card } from '../../layout/card/Card';
import './Featured.css';

export function Featured() {
    const apiData = React.useContext(APIContext);
    const baseReactRouterURL = '/nft';

    return (
        <div className="asunMintComponent" id="featured">
            <div className="featuredItem" id="introduction">
                <span className="asunMintComponentTitle">Featured</span>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Voluptas dolorem, earum reprehenderit illum nemo ad aut
                    consectetur vero possimus tenetur. Laudantium repellat odit
                    magnam tempore tenetur mollitia accusamus excepturi sit?
                </p>
            </div>

            {/* Featured item is up to 3 */}
            <div className="featuredItem" id="featuredGallery">
                {apiData ? (
                    apiData.map(({ image, name, description }: any, index) => {
                        // TODO set randomness later
                        if (index < 3) {
                            return (
                                <Card
                                    image={image}
                                    title={name}
                                    description={description}
                                    bid="2 ETH"
                                    text="Place a bid"
                                    linkTo={baseReactRouterURL.concat(
                                        '/',
                                        name
                                    )}
                                />
                            );
                        }
                        return '';
                    })
                ) : (
                    <p>Image fetching failed</p>
                )}
            </div>
        </div>
    );
}
