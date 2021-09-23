import React, { createContext, useState } from 'react';

const ContextSongs = createContext();

export function SongsProvider({ children }) {
    const [songs, setSongs] = useState([]);
    const [needReload, setNeedReload] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    return (
        <ContextSongs.Provider value={{ 
            songs, setSongs, 
            needReload, setNeedReload,
            isLoading, setIsLoading, 
            user, setUser 
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