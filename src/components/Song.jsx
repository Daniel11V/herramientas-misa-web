import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useParams } from "react-router-dom";
import '../styles/Song.css';


const Song = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchSongs = async() => {
            const res = await axios.get(`/api/songs/${id}`);
            console.log(res.data);
            if(res.data) { 
                setTitle(res.data.title);
                setDescription(res.data.description);
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
                    <h3>{title}</h3>
                    <div className="lyrics">
                        <span className="input-field">{description}</span>
                    </div>
                    {(1)&&(
                        <span>
                            Transcripción hecha por {"Usuario"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Song;