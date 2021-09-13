import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import axios from '../axios';
import ListSongs from './ListSongs.jsx';


const Suggestion = () => {
    const [ base, setBase ] = useState('EvDom');
    const [ gospel, setGospel ] = useState('');
    const [ topSongs, setTopSongs ] = useState([]);

    // const fetchTopSongs = async() => {
    //     const res = await axios.get('/api/readings');
    //     console.log(res.data);
    //     setTopSongs([]);
    // }

    useEffect(() => {
        let elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }) 
    
    const searchSongs = async(e) => {
        e.preventDefault();
        const res = await axios.post('/api/readings', { base, gospel });
        console.log(res.data);
        setTopSongs(res.data);
        M.toast({ html: 'Readings Updated' });
        // fetchTopSongs();
    }

    return (
        <div className="row">
            <div className="card">
                <div className="card-content">
                    <form onSubmit={searchSongs} >
                        <h5 style={{marginBottom: '40px'}}>Solicitar Recomendación</h5>
                        <div className="input-field">
                            <select value={base} onChange={(e)=>setBase(e.target.value)}>
                                <option value="EvDom">Evangelio del Domingo</option>
                                <option value="EvHoy">Evangelio de hoy</option>
                                <option value="EvInput">Palabras clave</option>
                            </select>
                            <label>En base a: </label>
                        </div>
                        {   (base === 'EvInput')?(
                                <div className="input-field">
                                    <textarea 
                                        id="gospel" 
                                        name="gospel" 
                                        className="materialize-textarea" 
                                        onChange={(e)=>setGospel(e.target.value)} 
                                        value={gospel}/>
                                    <label htmlFor="gospel">Texto / Palabras clave</label>
                                </div>
                            ):null
                        }
                        <div className="input-field row">
                            <input type="submit" className="btn light-blue darken-4 col s12" value="Buscar" />
                        </div>
                    </form>
                </div>
            </div>

            {/* Suggested Songs */}
            <table>
                <thead>
                    <tr>
                        <th>Canciónes Recomendadas</th>
                    </tr>
                </thead>
            </table>
            {(topSongs)?
                <ListSongs songs={topSongs} />
                :null
            }
        </div>
    );
}

export default Suggestion;


