import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from '../axios';
import '../styles/Song.css';


const Song = () => {
    const { id } = useParams();
    const emptySong = {
        _id: id,
        title: '',
        lyric: '',
        creator: '',
        author: '',
        rating: [],
        labels: [],
        topics: []
    }
    const [song, setSong] = useState(emptySong);
    const [finalLyric, setFinalLyric] = useState('');

    useEffect(() => {
        const fetchSongs = async() => {
            const res = await axios.get(`/api/songs/${id}`);
            //console.log(res.data);
            if(res.data) { 
                setSong(res.data);
                setFinalLyric(res.data.lyric.replace('{\n}', '\n'));
            } else {
                console.error("IDs don't match");
            }
        }
        fetchSongs();
    }, [id]);

    return (
        <div className="song">
            <h3>{song.title}</h3>
            {song.author && (
                <span>
                    Autor: {song.author}
                </span>
            )}
            <div className="lyrics">
                <span className="input-field">
                    {finalLyric}
                </span>
            </div>
            {song.creator && (
                <span>
                    Transcripción hecha por {song.creator}
                </span>
            )}
            {song.title && (
                <div className="btns">
                    <Link 
                        to={{ pathname: `/edit-song/${id}`, state: { from: 'Canción' } }} 
                        className="btn btn-song waves-effect waves-light light-blue darken-4">
                        <i className="material-icons right">edit</i>Editar
                    </Link>
                    <Link to={`/edit-song/${id}`} className="btn btn-song waves-effect waves-light light-blue darken-4">
                        <i className={`material-icons ${'right'}`}>delete</i>Eliminar
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Song;