import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import axios from '../axios';
import SongList from '../components/SongList.jsx';


const Suggestion = () => {
    const [ base, setBase ] = useState('EvDom');
    const [ input, setInput ] = useState('');
    const [ topSongs, setTopSongs ] = useState([]);

    // const fetchTopSongs = async() => {
    //     const res = await axios.get('/api/suggestion');
    //     console.log(res.data);
    //     setTopSongs([]);
    // }

    useEffect(() => {
        let elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }, []) 
    
    const searchSongs = async(e) => {
        e.preventDefault();
        const res = await axios.post('/api/suggestion', { base, input })
            .catch((err) => console.error(err));
        console.log(res.data);
        setTopSongs(res.data);
        M.toast({ html: 'Readings Updated' });
        // fetchTopSongs();
    }

    return (
        <div className="row">
            <div className="card" style={{marginTop: '20px'}}>
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
                                        id="input" 
                                        name="input" 
                                        className="materialize-textarea" 
                                        onChange={(e)=>setInput(e.target.value)} 
                                        value={input}/>
                                    <label htmlFor="input">Texto / Palabras clave</label>
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
                <SongList songs={topSongs} />
                :null
            }
        </div>
    );
}

export default Suggestion;


