import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Buttom } from '../../layout/button/Button';
import { LayoutProvider } from '../../layout/LayoutProvider';
import './TokenDetail.css';

function Description() {
    return (
        <div id="description">
            {/* TODO: change value dynamically later */}
            <div id="text">
                <span>No: 1</span>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Architecto, ipsum fugit eaque deserunt nemo maxime.
                </p>
            </div>
            <div id="image">
                <img src="https://i.ibb.co/Qchvsh4/metamask-logo.webp" alt="" />
            </div>
        </div>
    );
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
                <Buttom text="bid" />
            </div>
        </div>
    );
}

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
        <LayoutProvider>
            <div className="asunMintComponent" id="tokenDetail">
                <Description />
                <CurrentBid />
                <BidHistory />
            </div>
        </LayoutProvider>
    );
}
