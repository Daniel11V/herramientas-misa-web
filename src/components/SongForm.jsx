import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import M from 'materialize-css';
import axios from '../axios';
import { useSongs } from '../songs-context';
import LabelsInput from './LabelsInput.jsx';

const SongForm = () => {
    const history = useHistory();
    const { id } = useParams();
    const { songs, setNeedReload, user } = useSongs();
    const [ title, setTitle ] = useState('');
    const [ author, setAuthor ] = useState('');
    const [ creator, setCreator ] = useState('');
    const [ lyric, setLyric ] = useState('');
    const [ labels, setLabels ] = useState('');

    useEffect(() => {
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);

        if (id) {
            const song = songs.find(song => song._id === id);

            setTitle(song.title);
            setAuthor(song.author);
            setCreator(song.creator);
            setLyric(song.lyric);
            setLabels(song.labels);
    
            // Autoresize
            let inputs = document.querySelectorAll('.lab');
            for(let i = 0; i < inputs.length;i++){
                inputs[i].classList.add("active");
            }
    
            let textarea = document.querySelector('textarea');
            setTimeout(() => M.textareaAutoResize(textarea), 500);
        }
    }, [songs, id]);


    const submitSong = async(e) => {
        e.preventDefault();

        const creatorSend = (!creator && user)?user.name:creator;

        const songToSend = { title, author, creatorSend, lyric, labels, rating: [] };

        if (id) {
            const res = await axios.put(`/api/songs/${id}`, { ...songToSend, _id: id})
                .catch((err) => console.error(err));
            console.log(res.data);
            M.toast({ html: 'Song Updated' });
        } else {
            const res = await axios.post('/api/songs', songToSend)
                .catch((err) => console.error(err));
            console.log(res.data);
            M.toast({ html: 'Song Saved' });
        }

        setNeedReload(true);
        history.goBack();
    }

    
    
    return (
        <div className="row">
            <div className="card" style={{marginTop: '20px'}}>
                <div className="card-content">
                    <form onSubmit={submitSong}>
                        <h4 style={{marginBottom: '40px',marginTop: 0}} onClick={()=>alert(labels)}>
                            {id?'Editar ':'Añadir '} 
                            Canción
                        </h4>
                        <div className="row">
                            <div className="input-field">
                                <input id="title" name="title" onChange={(e)=>setTitle(e.target.value)} type="text" value={title || ''} />
                                <label htmlFor="title" className="lab">Titulo</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field">
                                <input id="author" name="author" onChange={(e)=>setAuthor(e.target.value)} type="text" value={author || ''} />
                                <label htmlFor="author" className="lab">Autor</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field">
                                <textarea 
                                    id="lyric" 
                                    name="lyric" 
                                    className="materialize-textarea" 
                                    onChange={(e)=>setLyric(e.target.value)} 
                                    value={lyric || ''} />
                                <label htmlFor="lyric" className="lab">Letra y acordes</label>
                            </div>
                        </div>
                        <div className="row">
                            <LabelsInput labels={labels} updateLabels={(lb)=>setLabels(lb)}/>
                        </div>
                        <div className="row"> 
                            <div className="input-field">
                                <button type="submit" className="btn light-blue darken-4 col s12">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SongForm;