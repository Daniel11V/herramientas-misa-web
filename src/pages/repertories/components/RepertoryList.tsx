import { useNavigate } from "react-router-dom";
import "../../../styles/SongList.css";
import { Collection, CollectionItem } from "../../../styles/styles";
import { arrayIsEmpty } from "../../../utils/lyricsAndChordsUtils";

const RepertoryList = ({ repertoryList = [], loading = false, error = "" }) => {
	const navigate = useNavigate();

	const handleClickRepertory = (id) => {
		navigate(`/repertory/${id}`, { state: { from: "Repertorios" } });
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

	if (!!error) return <div>Error - {error}</div>;

	if (arrayIsEmpty(repertoryList))
		return (
			<Collection>
				<CollectionItem>Ningun repertorio encontrado...</CollectionItem>
			</Collection>
		);

	return (
		<Collection>
			{repertoryList.map((repertory) => (
				<CollectionItem
					key={repertory.id}
					onClick={() => handleClickRepertory(repertory.id)}
				>
					{repertory.title}
					{repertory?.placeTitle && ` - ${repertory.placeTitle}`}
				</CollectionItem>
			))}
		</Collection>
	);
};

export default RepertoryList;
