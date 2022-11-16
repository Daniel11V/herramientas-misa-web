import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import LoginLogout from "../../layout/components/LoginLogout";
import { useHistory } from "react-router";
import RepertoryList from "./components/RepertoryList";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../clases/user/actions";
import { useRepertoryList } from "../../clases/repertory/useRepertoryList";
import { Header } from "../../styles/styles";

const Repertories = () => {
	const [repertoryList, loadingRepertoryList, errorRepertoryList] =
		useRepertoryList();
	const history = useHistory();
	const dispatch = useDispatch();
	const isLogged = useSelector((state) => state.user.isLogged);

	const loginAddSong = (userData) => {
		dispatch(login(userData));
		history.push({
			pathname: "/add-song",
			state: { from: "Cancionero" },
		});
	};

	return (
		<Fragment>
			<Header>
				<h3>Repertorios</h3>
				{isLogged ? (
					<Link
						to={{ pathname: "/add-song", state: { from: "Cancionero" } }}
						className="btn waves-effect waves-light blue darken-2 right"
					>
						<i className="material-icons right">add</i>Añadir
					</Link>
				) : (
					<LoginLogout update={(v) => loginAddSong(v)}>
						<div className="btn waves-effect waves-light blue darken-2 right">
							<i className="material-icons right">add</i>Añadir
						</div>
					</LoginLogout>
				)}
			</Header>
			<RepertoryList
				repertoryList={repertoryList}
				loading={loadingRepertoryList}
				error={errorRepertoryList}
			/>
		</Fragment>
	);
};

export default Repertories;
