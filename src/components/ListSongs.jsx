import React, { useState, useEffect } from 'react';
import { Link  } from "react-router-dom";
import '../styles/ListSongs.css';
import { useSongs } from '../songs-context';
import LabelsInput from './LabelsInput.jsx';

const ListSong = ({ searcher = false }) => {
    const { songs, isLoading } = useSongs();
    const [ filteredSongs, setFilteredSongs ] = useState(songs);
    const [ showFiltros, setShowFiltros ] = useState(false);
    const [ labels, setLabels ] = useState([]);
    const [ search, setSearch ] = useState('');

    useEffect(() => {
        if(songs) {
            let startsTitle = [];
            let includesTitle = [];
            let includesLyric = [];
            songs.forEach(song => {
                if (labels.every(elem => song.labels.includes(elem))) {
                    if (search === '' || song.title.toLowerCase().startsWith(search.toLowerCase())) {
                        startsTitle.push(song);
                    } else if (song.title.toLowerCase().includes(search.toLowerCase())) {
                        includesTitle.push(song);
                    } else if (song.lyric.toLowerCase().includes(search.toLowerCase())) {
                        includesLyric.push(song);
                    }
                }
            })
    
            setFilteredSongs([
                ...startsTitle,
                ...includesTitle,
                ...includesLyric
            ]);
        }

    }, [songs, search, labels])

    if (isLoading) return (
        <div className="progress" style={{backgroundColor: '#9cd1ff'}}>
            <div className="indeterminate" style={{backgroundColor: '#1976d2'}}></div>
        </div>
    )

    return (
    <div className="collection songs">
        {searcher&&(
            <div className="nav-wrapper collection-item searcher">
                <div className="search-line">
                    <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                    <input onChange={(e)=>setSearch(e.target.value)} id="search" type="search" placeholder="Buscar canción..." value={search} />
                    <div className="label-icon btn-icon" onClick={()=>setShowFiltros(!showFiltros)}>
                        Filtros
                        <i className="material-icons">
                            {showFiltros?'keyboard_double_arrow_up':'keyboard_double_arrow_down'}
                        </i>
                    </div>
                </div>
                {showFiltros&&(
                    <div className="labelsInput">
                        <LabelsInput labels={labels} updateLabels={(lb)=>setLabels(lb)}/>
                    </div>
                )}
            </div>
            
        )}
        {
            filteredSongs.map(song => (
                <Link 
                    to={{ pathname: `/song/${song._id}`, state: { from: 'Cancionero' } }}
                    key={song._id} className="collection-item">
                    <span className="song-item" >
                        {song.title}
                        {song.author&&` - ${song.author}`}
                    </span>
                </Link>
            ))
        }
        {
            (!filteredSongs && songs)&&
            <div className="collection-item" >
                <span className="song-item" >
                    Ninguna canción coincide...
                </span>
            </div>
        }
    </div>
);}


export default ListSong;