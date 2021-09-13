import React from 'react';
import { Link  } from "react-router-dom";
import '../styles/ListSongs.css';


const AddSong = ({ songs }) => (
    <div className="collection songs">
        {
            songs.map(song => (
                <Link 
                    to={{ pathname: `/song/${song._id}`, state: { from: 'Cancionero' } }}
                    key={song._id} className="collection-item">
                    <span className="song-item" >{song.title}</span>
                </Link>
            ))
        }
    </div>
);


export default AddSong;