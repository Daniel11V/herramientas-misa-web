import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import axios from '../../axios';
import SongList from '../../songs/components/SongList';
import fullLabels from '../../data/fullLabels';


const Suggestion = () => {
    const [ base, setBase ] = useState('EvDom');
    const [ input, setInput ] = useState('');
    const [ topSongs, setTopSongs ] = useState([])

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
        setTopSongs(res.data);
        M.toast({ html: 'Readings Updated' });
        // fetchTopSongs();
    }

    return (
        <div className="row">
            <form onSubmit={searchSongs} style={{margin: '25px 0'}}>
                <header>
                    <h3 style={{marginBottom: '40px'}}>Solicitar Recomendación</h3>
                </header>
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

            {/* Suggested Songs */}
            <table className="indications">
                <thead>
                    <tr>
                        <th>Canciónes Recomendadas</th>
                        <th style={{textAlign: 'right'}}>Elegir</th>
                    </tr>
                </thead>
            </table>
            {(topSongs)?
                Object.keys(fullLabels[4].lbs).map(moment => (
                    <div className="moment" key={moment}>
                        <table>
                            <thead>
                                <tr>
                                    <th>{fullLabels[4].lbs[moment]}</th>
                                </tr>
                            </thead>
                        </table>
                        <SongList songs={topSongs} labelsStart={[moment]} checking={true}/>
                    </div>
                ))
                :null
            }
        </div>
    );
}

export default Suggestion;


