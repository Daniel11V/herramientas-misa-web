import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import M from 'materialize-css';
import axios from '../axios';

const AddSong = () => {
    const { id } = useParams();
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');

    const addSong = async(e) => {
        e.preventDefault();
        if (id) {
            const res = await axios.put(`/api/songs/${id}`, {title, description, _id: id});
            console.log(res.data);
            M.toast({ html: 'Song Updated' });
        } else {
            const res = await axios.post('/api/songs', {title, description});
            console.log(res.data);
            M.toast({ html: 'Song Saved' });
        }
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
    //                 description: data.description,
    //                 _id: data._id
    //             })
    //         });
    // }

    return (
        <div className="row">
            <div className="card">
                <div className="card-content">
                    <form onSubmit={addSong}>
                        <h5 style={{marginBottom: '40px'}}>Añadir Canción</h5>
                        <div className="row">
                            <div className="input-field">
                                <input id="title" name="title" onChange={(e)=>setTitle(e.target.value)} type="text" value={title} />
                                <label htmlFor="title">Titulo</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field">
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    className="materialize-textarea" 
                                    onChange={(e)=>setDescription(e.target.value)} 
                                    value={description}>
                                    </textarea>
                                <label htmlFor="description">Letra y acordes</label>
                            </div>
                        </div>
                        <button type="submit" className="btn light-blue darken-4">
                            {id ? 'Actualizar' : 'Guardar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddSong;