import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useParams } from "react-router-dom";
import '../styles/Song.css';


const Song = () => {
    const { id } = useParams();
    const emptySong = {
        _id: id,
        title: '',
        lyric: '',
        creator: '',
        author:'',
        rating:''
    }
    const [song, setSong] = useState(emptySong);

    useEffect(() => {
        const fetchSongs = async() => {
            const res = await axios.get(`/api/songs/${id}`);
            console.log(res.data);
            if(res.data) { 
                setSong(res.data);
            } else {
                console.error("IDs don't match");
            }
        }
        fetchSongs();
    }, [id]);
    
    return (
        <div className="row">
            <div className="card">
                <div className="card-content" style={{fontSize: '1.1em'}}>
                    <h3>{song.title}</h3>
                    <div className="lyrics">
                        <span className="input-field">
                            {song.lyric.replace('{\n}', '\n')}
                        </span>
                    </div>
                    {(song.author)&&(
                        <span>
                            Autor: {song.author}
                        </span>
                    )}
                    {(song.creator)&&(
                        <span>
                            Transcripción hecha por {song.creator}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Song;