import React from 'react';
import { render } from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SongsProvider } from './songs/context/SongsContext';
import { UserProvider } from './layout/context/UserContext';
import App from './App';

const queryClient = new QueryClient();

render((
    <QueryClientProvider client={queryClient} >
        <UserProvider>
            <SongsProvider>
                <App />
            </SongsProvider>
        </UserProvider>
    </QueryClientProvider>
), document.getElementById('app'));
