import { Fragment } from "react";
import SongCollection from "../components/SongCollection";
import { useLibraryPage } from "./hooks/useLibraryPage";
// import { Link } from "react-router-dom";
// import LoginLogoutBtn from "../../layout/components/LoginLogoutBtn";
// import { useNavigate } from "react-router";

const Library = () => {
	// const navigate = useNavigate();
	const {
		songList,
		isLoading: loadingSongList,
		songError: errorSongList,
	} = useLibraryPage();

	// const loginAddSong = (v) => {
	// 	setUser(v);
	// 	navigate("/add-song", {state: { from: "Mi Biblioteca" }});
	// };

	return (
		<Fragment>
			<div className="header">
				<h3 className="cancionero">Mi Biblioteca</h3>
				{/* {user.name ? (
					<Link
						to={{ pathname: "/add-song", state: { from: "Mi Biblioteca" } }}
						className="btn waves-effect waves-light blue darken-2 right"
					>
						<i className="material-icons right">add</i>Añadir
					</Link>
				) : (
					<LoginLogoutBtn update={(v) => loginAddSong(v)}>
						<div className="btn waves-effect waves-light blue darken-2 right">
							<i className="material-icons right">add</i>Añadir
						</div>
					</LoginLogoutBtn>
				)} */}
			</div>
			{/* <RepertoryList
				repertoryList={repertoryList}
				loading={loadingRepertoryList}
				error={errorRepertoryList}
				/> */}
			<SongCollection
				searcher={false}
				songList={songList}
				loading={loadingSongList}
				error={errorSongList || undefined}
			/>
		</Fragment>
	);
};

export default Library;
