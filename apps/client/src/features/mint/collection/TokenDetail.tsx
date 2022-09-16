import * as React from 'react';
import { useParams } from 'react-router-dom';
import { APIContext } from '../../../app/context/APIContext';
import { Buttom } from '../../layout/button/Button';
import './TokenDetail.css';

function Description() {
    const { title } = useParams();
    const apiData = React.useContext(APIContext);
    return (
        <div id="description">
            <div id="text">
                <span>No: 1</span>
                <p>
                    {apiData
                        ? apiData.map(({ name, description }: any) => {
                              if (title === name) {
                                  return <p>{description}</p>;
                              }
                              return '';
                          })
                        : 'fetch failed'}
                </p>
            </div>
            <div id="image">
                {apiData
                    ? apiData.map(({ name, image }: any) => {
                          if (title === name) {
                              return <img src={image} alt="token detail" />;
                          }
                          return '';
                      })
                    : 'fetch failed'}
            </div>
        </div>
    );
}

// TODO
function invokeContractBid() {
    console.log('invoke smart contract bid function here');
}

function CurrentBid() {
    const { title } = useParams();

    return (
        <div id="currentBid">
            <span id="title">NFT: {title}</span>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
                explicabo nisi beatae commodi eligendi ducimus, pariatur
                expedita! Voluptatem perferendis obcaecati minus asperiores
                alias expedita cumque provident consequatur officiis, fugit
                tempora.
            </p>
            <div id="bid">
                {/* TODO: change price later */}
                <span>Current: 1 ETH</span>
                <Buttom
                    text="bid"
                    id="bidButton"
                    callback={invokeContractBid}
                />
            </div>
        </div>
    );
}

// TODO set dynamic value from API later
function BidHistory() {
    return (
        <div id="bidHistory">
            <div id="title">
                <span>Bid History</span>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Cum consequatur et aspernatur doloremque illo veritatis
                    nihil, explicabo porro corporis perferendis. Velit quia
                    accusamus sit est nostrum animi eligendi, suscipit
                    repellendus.
                </p>
            </div>

            <table id="transactions" style={{ borderStyle: 'solid' }}>
                <thead>
                    <tr>
                        <th>TX HASH</th>
                        <th>METHOD</th>
                        <th>AGE</th>
                        <th>FROM</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>TEMP</td>
                        <td>21 sec ago</td>
                        <td>my address</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>TEMP</td>
                        <td>40 sec ago</td>
                        <td>my address</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>TEMP</td>
                        <td>59 sec ago</td>
                        <td>my address</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export interface ITokenDetailProps {}

export function TokenDetail(props: ITokenDetailProps) {
    return (
        <div className="asunMintComponent" id="tokenDetail">
            <Description />
            <CurrentBid />
            <BidHistory />
        </div>
    );
}
