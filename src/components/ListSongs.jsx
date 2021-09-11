import React, { useEffect, useState } from 'react';
import { Link  } from "react-router-dom";
import axios from '../axios';
import '../styles/ListSongs.css';

// const api = axios.create({
//   baseURL: (process.env.REACT_APP_LOCAL_SERVER | '')
// });

const AddSong = () => {
    const [ songs, updateSongs ] = useState([]);

    useEffect(() => {
        fetchSongs();
    }, []);
    
    const fetchSongs = async() => {
        const res = await axios.get('/api/songs');
        console.log(res.data);
        if(res.data) { updateSongs(res.data); }
    }

    return (
        <div className="collection songs">
            {
                songs.map(song => (
                    <Link to={`/song/${song._id}`} key={song._id} className="collection-item">
                        <span className="song-item" >{song.title}</span>
                    </Link>
                ))
            }
        </div>
    )
}

export default AddSong;