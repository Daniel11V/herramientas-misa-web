import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useDispatch } from "react-redux";
// import { useRepertoryPage } from "./hooks/useRepertoryPage.js";
import SongCollection from "../components/SongCollection";
import { useRepertoryPage2 } from "./hooks/useRepertoryPage2.js";
import { Header } from "../../styles/styles";

const RepertoryPage = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { id } = useParams();
	const [repertory, isLoading, error] = useRepertoryPage2(id);

	// const [tone, setTone] = useState(null);
	// const [currentChords, setCurrentChords] = useState({});
	// const [showChords, setShowChords] = useState(true);
	// const [hasChords, sethasChords] = useState(false);
	// const [chordLang, setChordLang] = useState("en");
	// const [onlyLyric, setOnlyLyric] = useState("");

	useEffect(() => {
		const elems = document.querySelectorAll(".modal");
		M.Modal.init(elems);
	}, []);

	const deleteRepertory = async () => {
		// await axios.delete(`/api/songs/${id}`).catch((err) => console.error(err));
		dispatch(deleteRepertory(id));
		M.toast({ html: "Repertorio eliminado." });
		// refetchRepertorys();
		history.goBack();
	};

	if (isLoading)
		return (
			<div className="progress" style={{ backgroundColor: "#9cd1ff" }}>
				<div
					className="indeterminate"
					style={{ backgroundColor: "#1976d2" }}
				></div>
			</div>
		);

	return (
		<>
			<Header>
				<h4>
					{repertory.title}{" "}
					{repertory.author?.name && ` - ${repertory.author.name}`}
				</h4>
			</Header>
			{Object.keys(repertory?.songs || {})?.map((list) => (
				<div key={list}>
					<h6>{list}</h6>
					<SongCollection
						songList={repertory?.songs?.[list]}
						isLoading={isLoading}
						error={error}
						pageName="Repertorio"
					/>
				</div>
			))}
			{/* {repertory.creator?.name && (
				<span style={{ fontStyle: "italic" }}>
					Transcripción hecha por {repertory.creator.name}
				</span>
			)} */}
			{/* <div className="btns">
				<Link
					to={{ pathname: `/edit-repertory/${id}`, state: { from: "Canción" } }}
					className="btn btn-repertory waves-effect waves-light blue darken-2"
				>
					<i className="material-icons right">edit</i>Editar
				</Link>
				{(repertory.creator?.name === user.name ||
					user.googleId === "111418653738749034139") && (
					<a
						href="#modal1"
						className="btn btn-repertory waves-effect blue darken-2 modal-trigger"
					>
						<i className={`material-icons ${"right"}`}>delete</i>Eliminar
					</a>
				)}
			</div> */}

			<div id="modal1" className="modal">
				<div className="modal-content">
					<h4>¿Esta seguro que desea eliminar esta canción?</h4>
					<p>
						Esta acción no se puede deshacer y se eliminará para todos los
						usuarios.
					</p>
				</div>
				<div className="modal-footer">
					<div
						onClick={deleteRepertory}
						className="modal-close waves-effect waves-light-blue btn-flat"
					>
						Confirmar
					</div>
					<div className="modal-close waves-effect waves-light-blue btn-flat">
						Cancelar
					</div>
				</div>
			</div>
		</>
	);
};

export default RepertoryPage;
