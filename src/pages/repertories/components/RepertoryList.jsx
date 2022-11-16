import React from "react";
import { Link, useHistory } from "react-router-dom";
import "../../../styles/SongList.css";
import { arrayIsEmpty } from "../../../utils";
import Collection from "../../components/Collection";

const RepertoryList = ({
	repertoryList = [],
	loading = false,
	error = "",
	// searcher = false,
	// labelsStart = [],
	checking = false,
}) => {
	const history = useHistory();

	const handleClickRepertory = (id) => {
		history.push({
			pathname: `/repertory/${id}`,
			state: { from: "Repertorios" },
		});
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
		<Collection withCheck={checking}>
			{repertoryList.map((repertory) => (
				<div>
					{repertory.title}
					{repertory?.placeTitle && ` - ${repertory.placeTitle}`}
				</div>
			))}
			{/* {!filteredSongs && allSongDetails && (
				<div className="collection-item">
					<span className="song-item">Ninguna canción coincide...</span>
				</div>
			)} */}
			{(arrayIsEmpty(repertoryList) || !!error) &&
				"Sin conexión, pruebe recargando la página."}
		</Collection>
	);
};

export default RepertoryList;
