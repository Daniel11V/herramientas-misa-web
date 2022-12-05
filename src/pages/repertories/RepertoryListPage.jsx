import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import LoginLogout from "../../layout/components/LoginLogout";
import { useHistory } from "react-router";
import RepertoryList from "./components/RepertoryList";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../clases/user/actions";
import { useRepertoryListPage } from "./hooks/useRepertoryListPage";
import { Header } from "../../styles/styles";

const RepertoryListPage = () => {
	const [repertoryList, loadingRepertoryList, errorRepertoryList] =
		useRepertoryListPage();
	const history = useHistory();
	const dispatch = useDispatch();
	const isLogged = useSelector((state) => state.user.isLogged);

	const loginAddSong = (userData) => {
		dispatch(login(userData));
		history.push({
			pathname: "/create-repertory",
			state: { from: "Repertorios" },
		});
	};

	return (
		<Fragment>
			<Header>
				<h3>Repertorios</h3>
				{isLogged ? (
					<Link
						to={{ pathname: "/create-repertory", state: { from: "Repertorios" } }}
						className="btn waves-effect waves-light blue darken-2 right"
					>
						<i className="material-icons right">add</i>Crear
					</Link>
				) : (
					<LoginLogout update={(v) => loginAddSong(v)}>
						<div className="btn waves-effect waves-light blue darken-2 right">
							<i className="material-icons right">add</i>Crear
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

export default RepertoryListPage;
