import React from 'react';
import { render } from 'react-dom';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import { SongsProvider } from './songs/context/SongsContext';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
// const queryClient = new QueryClient();
// <QueryClientProvider client={queryClient} >
// </QueryClientProvider>

//     <SongsProvider>
//     </SongsProvider>

render((
    <Provider store={store} >
        <App />
    </Provider>
), document.getElementById('app'));
