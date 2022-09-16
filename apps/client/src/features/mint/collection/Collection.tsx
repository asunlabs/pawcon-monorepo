import * as React from 'react';
import axios from 'axios';
import { v4 } from 'uuid';
import {
    APIContext,
    apiV1CollectionURL,
    baseDockerServerURL,
} from '../../../app/context/APIContext';
import { Buttom } from '../../layout/button/Button';
import { Card } from '../../layout/card/Card';
import './Collection.css';

interface ILoadMoreCollection {
    count: number;
}

async function LoadMoreCollection({ count }: ILoadMoreCollection) {
    let data: unknown[] = [];

    const response = await axios.get(
        baseDockerServerURL.concat(apiV1CollectionURL, `${count}.json`)
    );

    const OK = 200;

    if (response.status === OK) {
        data = response.data;
        console.log(data);
        count++;
    }

    // TODO set error handling for end of data
    const ErrEndOfResource = 404;

    if (response.status === ErrEndOfResource) {
        data = ['END OF API DATA'];
    }

    return { data };
}

export function Collection() {
    const baseReactRouterURL = '/nft';

    const apiData = React.useContext(APIContext);
    const [collectionAPIData, setCollectionAPIData] = React.useState(apiData);
    const [count, setCount] = React.useState(1);

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

            <div className="collectionItem" id="gallery">
                {collectionAPIData ? (
                    collectionAPIData.map(
                        ({ image, name, description }: any, index) => {
                            // render 6 collections at once

                            return (
                                <Card
                                    key={v4()}
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
                    )
                ) : (
                    <p>Image fetching failed</p>
                )}
                <Buttom
                    text="Load more"
                    callback={async () => {
                        const { data } = await LoadMoreCollection({ count });
                        setCollectionAPIData([...collectionAPIData, ...data]);
                        setCount(count + 1);
                    }}
                    id="loadMoreButton"
                />
            </div>
        </div>
    );
}
