import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import LabelsInput from "./LabelsInput.jsx";
import "../../../styles/SongList.css";
import { useDispatch, useSelector } from "react-redux";
import { objIsEmpty } from "../../../utils";
import {
	getPrivateSongTitles,
	getPublicSongTitles,
	setLoading,
} from "../../../store/actions/community";

const SongList = ({ searcher = false, labelsStart = [], checking = false }) => {
	const dispatch = useDispatch();
	const { publicSongTitles, privateSongTitles, loading } = useSelector(
		(state) => state.community
	);
	const userId = useSelector((state) => state.user.google.id);

	// const [filteredSongs, setFilteredSongs] = useState(allSongDetails);
	const [showFiltros, setShowFiltros] = useState(false);
	const [labels, setLabels] = useState(labelsStart);
	const [search, setSearch] = useState("");
	const [filterSelectors, setFilterSelectors] = useState(null);
	const [songChoose, setSongChoose] = useState(null);
	const collapse = useRef(null);

	useEffect(() => {
		if (objIsEmpty(publicSongTitles)) {
			dispatch(setLoading(true));
			dispatch(getPublicSongTitles());
		}
	}, [publicSongTitles, dispatch]);

	useEffect(() => {
		if (userId && objIsEmpty(privateSongTitles)) {
			dispatch(setLoading(true));
			dispatch(getPrivateSongTitles(userId));
		}
	}, [userId, privateSongTitles, dispatch]);

	useEffect(() => {
		if (collapse.current && !filterSelectors) {
			let inst = M.Collapsible.init(collapse.current);
			setFilterSelectors(inst);
		}
	}, [showFiltros, filterSelectors]);

	useEffect(() => {
		if (filterSelectors) {
			if (showFiltros) {
				filterSelectors.open(0);
			} else {
				filterSelectors.close(0);
			}
		}
	}, [showFiltros, filterSelectors]);

	// useEffect(() => {
	// 	if (allSongDetails) {
	// 		// Filter
	// 		let startsTitle = [];
	// 		let includesTitle = [];
	// 		let includesLyric = [];
	// 		if (songChoose) {
	// 			startsTitle.push(allSongDetails.find((song) => song.id === songChoose));
	// 			// filterById(songChoose)
	// 		} else {
	// 			allSongDetails.forEach((song) => {
	// 				if (labels.every((elem) => song.labels.includes(elem))) {
	// 					if (
	// 						search === "" ||
	// 						song.title.toLowerCase().startsWith(search.toLowerCase())
	// 					) {
	// 						startsTitle.push(song);
	// 					} else if (
	// 						song.title.toLowerCase().includes(search.toLowerCase())
	// 					) {
	// 						includesTitle.push(song);
	// 					} else if (
	// 						song.lyric.toLowerCase().includes(search.toLowerCase())
	// 					) {
	// 						includesLyric.push(song);
	// 					}
	// 				}
	// 			});
	// 		}

	// 		setFilteredSongs([...startsTitle, ...includesTitle, ...includesLyric]);
	// 	}
	// }, [allSongDetails, search, labels, songChoose]);

	const handleCheck = (e, songId) => {
		e.preventDefault();
		e.stopPropagation();

		if (songId === songChoose) {
			setSongChoose(null);
			document.getElementById(songId).checked = false;
		} else {
			setSongChoose(songId);
			document.getElementById(songId).checked = true;
		}
	};

	if (loading)
		return (
			<div className="progress" style={{ backgroundColor: "#9cd1ff" }}>
				<div
					className="indeterminate"
					style={{ backgroundColor: "#1976d2" }}
				></div>
			</div>
		);

	return (
		<div className="collection songs">
			{searcher && (
				<div className="nav-wrapper collection-item searcher">
					<div
						className="search-line"
						style={showFiltros ? { borderBottom: "1px solid #e0e0e0" } : {}}
					>
						<label className="label-icon" htmlFor="search">
							<i className="material-icons">search</i>
						</label>
						<input
							onChange={(e) => setSearch(e.target.value)}
							id="search"
							type="search"
							placeholder="Buscar canción..."
							value={search}
						/>
						<div
							className="label-icon btn-icon"
							onClick={() => setShowFiltros(!showFiltros)}
						>
							Filtros
							<i className="material-icons">
								{showFiltros
									? "keyboard_double_arrow_up"
									: "keyboard_double_arrow_down"}
							</i>
						</div>
					</div>
					<ul
						className="collapsible"
						ref={collapse}
						style={{ border: "none", boxShadow: "none", margin: "0" }}
					>
						<li>
							<div className="collapsible-body labelsInput">
								<LabelsInput
									labels={labels}
									updateLabels={(lb) => setLabels(lb)}
								/>
							</div>
						</li>
					</ul>
				</div>
			)}
			{/* {filteredSongs.map((song) => (
				<Link
					to={{ pathname: `/song/${song.id}`, state: { from: "Cancionero" } }}
					key={song.id}
					className={`collection-item ${checking ? "with-check" : ""}`}
				>
					<span className="song-item">
						{song.title}
						{song.author && ` - ${song.author}`}
					</span>
					{checking && (
						<label onClick={(e) => handleCheck(e, song.id)}>
							<input
								type="checkbox"
								id={song.id}
								className="filled-in checkbox-blue"
							/>
							<span />
						</label>
					)}
				</Link>
			))} */}
			{Object.values(publicSongTitles || {}).map((song) => (
				<Link
					to={{ pathname: `/song/${song.id}`, state: { from: "Cancionero" } }}
					key={song.id}
					className={`collection-item collection-songs ${
						checking ? "with-check" : ""
					}`}
				>
					<span className="song-item">
						{song.title}
						{song?.author?.name && ` - ${song.author.name}`}
					</span>
					{userId && song?.creator?.id === userId && (
						<div className="levelIcon">
							<i className="material-icons">favorite</i>
							<span>{song?.level?.main}</span>
						</div>
					)}
					{/* <div className="levelIcon">
							<i className="material-icons" style={{ color: "#5a5a5a" }}>
								favorite_border
							</i>
						</div> */}
					{checking && (
						<label onClick={(e) => handleCheck(e, song.id)}>
							<input
								type="checkbox"
								id={song.id}
								className="filled-in checkbox-blue"
							/>
							<span />
						</label>
					)}
				</Link>
			))}
			{/* {!filteredSongs && allSongDetails && (
				<div className="collection-item">
					<span className="song-item">Ninguna canción coincide...</span>
				</div>
			)} */}
			{(objIsEmpty(publicSongTitles) || !!publicSongTitles?.error) && (
				<div className="collection-item">
					<span className="song-item">
						Sin conexión, pruebe recargando la página.
					</span>
				</div>
			)}
		</div>
	);
};

export default SongList;
