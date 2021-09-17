import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import M from 'materialize-css';
import axios from '../axios';

const AddSong = ({ songs }) => {
    const history = useHistory();
    const { id } = useParams();
    const [ title, setTitle ] = useState('');
    const [ author, setAuthor ] = useState('');
    const [ lyric, setLyric ] = useState('');

    useEffect(() => {
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }, []);

    useEffect(() => {
        if (songs) {
            const song = songs.find(song => song._id === id);

            setTitle(song.title);
            setAuthor(song.author);
            setLyric(song.lyric);

            for(const label of song.labels) {
                let opts = document.querySelectorAll('option.label');
                for(let i = 0; i < opts.length;i++){
                    if (opts[i].value === label) {
                        opts[i].selected = true;
                    }
                }
            }
            for(const topic of song.topics) {
                let opts = document.querySelectorAll('option.topic');
                for(let i = 0; i < opts.length;i++){
                    if (opts[i].value === topic) {
                        opts[i].selected = true;
                    }
                }
            }

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

        const selectLabels = document.querySelectorAll('select.label');
        const labels = getSelectedValues(selectLabels);

        const selectTopics = document.querySelectorAll('select.topic');
        const topics = getSelectedValues(selectTopics);

        const songToSend = { title, author, lyric, labels, topics }

        if (id) {
            const res = await axios.put(`/api/songs/${id}`, { ...songToSend, _id: id});
            console.log(res.data);
            M.toast({ html: 'Song Updated' });
        } else {
            const res = await axios.post('/api/songs', songToSend);
            console.log(res.data);
            M.toast({ html: 'Song Saved' });
        }

        history.goBack();
    }

    const getSelectedValues = (select) => {
        let newArray = [];
        for(const label of select[0].options) {
            if(label.selected){
                newArray.push(label.value);
            }
        }
        return newArray;
    }

    // deleteSong(id) {
    //     if (alert('Are you sure you want to delete it?')) {
    //         fetch(`/api/songs/${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //             .then(res => res.json())
    //             .then(data => {
    //                 console.log(data, id);
    //                 M.toast({ html: 'Song Deleted' });
    //             });
    //     }
    // }

    // editSong(id) {
    //     fetch(`api/songs/${id}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log(data)
    //             this.setState({
    //                 title: data.title,
    //                 lyric: data.lyric,
    //                 _id: data._id
    //             })
    //         });
    // }

    

    return (
        <div className="row">
            <div className="card" style={{marginTop: '20px'}}>
                <div className="card-content">
                    <form onSubmit={submitSong}>
                        <h4 style={{marginBottom: '40px',marginTop: 0}}>
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
                            <div className="input-field col s6">
                                <select className="label" multiple>
                                    <option value="" disabled>A quienes se menciona?</option>
                                    <option className="label" value="Maria">María</option>
                                    <option className="label" value="DiosPadre">Dios Padre</option>
                                    <option className="label" value="Jesus">Jesus</option>
                                    <option className="label" value="ES">Espiritu Santo</option>
                                </select>
                                <label>Etiquetas de personas</label>
                            </div>
                            <div className="input-field col s6">
                                <select className="topic" multiple>
                                    <option value="" disabled>Que temas menciona?</option>
                                    <option className="topic" value="SeguirAJesus">Seguir a Jesus</option>
                                    <option className="topic" value="Predicar/Misionar">Predicar/Misionar</option>
                                    <option className="topic" value="Misericordia">Misericordia</option>
                                    <option className="topic" value="Santidad">Santidad</option>
                                </select>
                                <label>Etiquetas de enseñanza</label>
                            </div>
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

export default AddSong;