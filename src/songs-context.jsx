import React, { createContext, useState } from 'react';

const ContextSongs = createContext();

export function SongsProvider({ children }) {
    const [songs, setSongs] = useState(null);
    const [needReload, setNeedReload] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <ContextSongs.Provider value={{ 
            songs, setSongs, 
            needReload, setNeedReload,
            isLoading, setIsLoading 
            }}>
            {children}
        </ContextSongs.Provider>
    );
}

export function useSongs() {
    const context = React.useContext(ContextSongs);
    if (!context) {
        throw new Error('useSongs debe estar dentro del proveedor ContextSongs')
    }
    return context;
}