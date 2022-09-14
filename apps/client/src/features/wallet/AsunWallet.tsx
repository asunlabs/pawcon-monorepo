import * as React from 'react';
import './AsunWallet.css';

/**
 * * AsunWallet
 * Cloned and modifiedConsensys Academy's ethereum-address-generator-js
 * see here for details:https://github.com/ConsenSys-Academy/ethereum-address-generator-js
 * * Deps
 *  "bip39": "^2.5.0",
    "ethereumjs-tx": "^1.3.7",
    "ethereumjs-wallet": "^0.6.5",
    "js-sha3": "^0.8.0",
    "reload": "^3.0.5",
    "watchify": "^3.11.0"
 * * Funcs
    // Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
        function generateMnemonic() {
          return BIP39.generateMnemonic();
        }

        function generateHexSeed(mnemonic) {
          return BIP39.mnemonicToSeedHex(mnemonic);
        }

        function generatePrivKey(mnemonic) {
          const seed = generateHexSeed(mnemonic);
          return hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0`).getWallet().getPrivateKey();
        }

        function derivePubKey(privKey) {
          const wallet = Wallet.fromPrivateKey(privKey);
          return wallet.getPublicKey();
        }

        function deriveEthAddress(pubKey) {
          const address = keccak256(pubKey); // keccak256 hash of  publicKey
          // Get the last 20 bytes of the public key
          return "0x" + address.substring(address.length - 40, address.length);
        }

        function signTx(privKey, txData) {
          const tx = new EthereumTx(txData);
          tx.sign(privKey);
          return tx;
        }

        function getSignerAddress(signedTx) {
          return "0x" + signedTx.getSenderAddress().toString("hex");
        }

 */

export interface IAsunWalletProps {}

export function AsunWallet(props: IAsunWalletProps) {
    return (
        <div>
            <div id="app">
                <div>
                    <div>
                        <button v-on:click="generateNew">
                            Generate New Mnemonic
                        </button>
                    </div>
                    Mnemonic: <textarea v-model="mnemonic"></textarea>
                    <p>
                        **Note that in this demonstration application, this
                        mnemonic will generate different sets of keys than
                        <a href="https://metamaks.io">Metamask</a>
                        or{' '}
                        <a href="https://myetherwallet.com">My Ether Wallet.</a>
                        **
                    </p>
                </div>
                <div v-if="privKey !== ''">
                    {/* <p>Private Key: {{privKey.toString('hex')}}</p>
        <p>Public Key:  {{pubKey.toString('hex')}}</p>
        <p>Ethereum address: {{ETHaddress}}</p>
        <button v-on:click="signSampleTx">Sign sample transaction</button> */}
                </div>
                <div v-if="recoveredAddress !== ''">
                    <h3>Transaction</h3>
                    {/* <code>
            { nonce: '0x00',
            gasPrice: '0x09184e72a000', 
            gasLimit: '0x2710',
            to: '0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6', 
            value: '0x10', 
            data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
            chainId: 1 }
        </code> */}
                    <div>
                        {/* <code>Signed raw tx: {
                nonce: '0x00',
                gasPrice: '0x09184e72a000',
                gasLimit: '0x2710',
                to: '0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6',
                value: '0x00',
                data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
                v: {{'0x' + signedSample.v.toString('hex')}},
                r: {{'0x' + signedSample.r.toString('hex')}},
                s: {{'0x' + signedSample.v.toString('hex')}}
              }</code> */}
                    </div>
                    {/* <p>Recovered address: {{recoveredAddress}}</p> */}
                </div>
            </div>
        </div>
    );
}
