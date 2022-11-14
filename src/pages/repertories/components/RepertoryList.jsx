import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/SongList.css";
import { arrayIsEmpty } from "../../../utils";

const RepertoryList = ({
	repertoryList = [],
	loading = false,
	error = "",
	// searcher = false,
	// labelsStart = [],
	checking = false,
}) => {
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
			{repertoryList.map((repertory) => (
				<Link
					to={{
						pathname: `/repertory/${repertory.id}`,
						state: { from: "Repertorios" },
					}}
					key={repertory.id}
					className={`collection-item collection-songs ${
						checking ? "with-check" : ""
					}`}
				>
					<span className="song-item">
						{repertory.title}
						{repertory?.placeTitle && ` - ${repertory.placeTitle}`}
					</span>
				</Link>
			))}
			{/* {!filteredSongs && allSongDetails && (
				<div className="collection-item">
					<span className="song-item">Ninguna canción coincide...</span>
				</div>
			)} */}
			{(arrayIsEmpty(repertoryList) || !!error) && (
				<div className="collection-item">
					<span className="song-item">
						Sin conexión, pruebe recargando la página.
					</span>
				</div>
			)}
		</div>
	);
};

export default RepertoryList;
