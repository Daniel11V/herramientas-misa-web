import React, { useState } from 'react';
import M from 'materialize-css';
import axios from '../axios';

const Suggestion = () => {
    const [ gospel, setGospel ] = useState('');
    const [ first_readings, setFirst_readings ] = useState('');
    const [ topSongs, setTopSongs ] = useState([]);

    // const fetchTopSongs = async() => {
    //     const res = await axios.get('/api/readings');
    //     console.log(res.data);
    //     setTopSongs([]);
    // }

    const searchSong = async(e) => {
        e.preventDefault();
        const res = await axios.post('/api/readings', { gospel, first_readings });
        console.log(res.data);
        M.toast({ html: 'Readings Updated' });
        // fetchTopSongs();
    }

    return (
        <div className="row">
            <div className="card">
                <div className="card-content">
                    <form onSubmit={searchSong} >
                        <h5 style={{marginBottom: '40px'}}>Solicitar Recomendación</h5>
                        <div className="row">
                            <div className="input-field">
                                <input id="first_readings" name="first_readings" onChange={(e)=>setFirst_readings(e.target.value)} type="text" value={first_readings} />
                                <label htmlFor="first_readings">Primeras Lecturas</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field">
                                <textarea 
                                    id="gospel" 
                                    name="gospel" 
                                    className="materialize-textarea" 
                                    onChange={(e)=>setGospel(e.target.value)} 
                                    value={gospel}/>
                                {/* <input id="gospel" name="gospel" onChange={(e)=>setGospel(e.target.value)} type="text" value={gospel} /> */}
                                <label htmlFor="gospel">Evangelio</label>
                            </div>
                        </div>
                        <input type="submit" className="btn light-blue darken-4" value="Buscar" />
                    </form>
                </div>
            </div>

            {/* Suggested Songs */}
            { topSongs[0]?
                <table>
                    <thead>
                        <tr>
                            <th>Canciónes Recomendadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            topSongs.map(song => {
                                return (
                                    <tr key={song._id}>
                                        <td>{song.title}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>:
                <div></div>
            }
        </div>
    );
}

export default Suggestion;


