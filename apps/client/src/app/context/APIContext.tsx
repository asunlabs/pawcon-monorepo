import axios from 'axios';
import React from 'react';

export const APIContext = React.createContext<unknown[]>([]);
export const baseDockerServerURL = 'http://localhost:3001';
export const apiV1CollectionURL = '/api/collection/';

export interface IAPIContextProviderProps {
    children?: React.ReactNode;
}

// share API context for collection component and featured component
export function APIContextProvider({ children }: IAPIContextProviderProps) {
    const [APIdata, setAPIData] = React.useState<unknown[]>([]);

    React.useEffect(() => {
        (async () => {
            const response = await axios.get(
                baseDockerServerURL.concat(apiV1CollectionURL, 'all.json')
            );
            // TODO add error handling
            if (response.status === 200) {
                const data = response.data;
                setAPIData(data);
            }
        })();
    }, []);
    return (
        <APIContext.Provider value={APIdata}>{children}</APIContext.Provider>
    );
}
