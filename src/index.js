import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { SongsProvider } from './songs-context';

render((
    <SongsProvider>
        <App />
    </SongsProvider>
), document.getElementById('app'));
