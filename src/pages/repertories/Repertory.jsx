import React, { useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/Song.css";
import { useRepertory } from "../../clases/repertory/useRepertory.js";

const Repertory = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const { id } = useParams();
	const [repertory, loading] = useRepertory(id);

	const user = useSelector((state) => state.user.google);

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
		M.toast({ html: "Repertory Deleted" });
		// refetchRepertorys();
		history.goBack();
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
		<div className="repertory">
			<h3 className="header-repertory">
				{repertory.title}{" "}
				{repertory.author?.name && ` - ${repertory.author.name}`}
			</h3>

			<br />
			{repertory.creator?.name && (
				<span style={{ fontStyle: "italic" }}>
					Transcripción hecha por {repertory.creator.name}
				</span>
			)}
			<div className="btns">
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
			</div>

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
		</div>
	);
};

export default Repertory;
