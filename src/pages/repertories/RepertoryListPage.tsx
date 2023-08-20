import { Fragment } from "react";
import LoginLogoutBtn from "../../layout/components/LoginLogoutBtn";
import { useNavigate } from "react-router";
import RepertoryList from "./components/RepertoryList";
import { login } from "../../classes/user/actions";
import { useRepertoryListPage } from "./hooks/useRepertoryListPage";
import { Header } from "../../styles/styles";
import { TUserGoogle } from "../../classes/user/types";
import ButtonLink from "../components/ButtonLink";
import { useAppDispatch, useAppSelector } from "../../store";

const RepertoryListPage = () => {
	const {
		repertoryList,
		loading: loadingRepertoryList,
		error: errorRepertoryList,
	} = useRepertoryListPage();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const isLogged = useAppSelector((state) => state.user.isLogged);

	const loginAddSong = (userData: TUserGoogle) => {
		dispatch(login(userData));
		navigate("/create-repertory", { state: { from: "Repertorios" } });
	};

	return (
		<Fragment>
			<Header>
				<h4>Repertorios</h4>
				{isLogged ? (
					// <Link
					// 	to={{
					// 		pathname: "/create-repertory",
					// 		state: { from: "Repertorios" },
					// 	}}
					// 	className="btn waves-effect waves-light blue darken-2 right"
					// >
					// 	<i className="material-icons right">add</i>Crear
					// </Link>
					<ButtonLink pathname="/create-repertory" from="Repertorios">
						<i className="material-icons right">add</i>Crear
					</ButtonLink>
				) : (
					<LoginLogoutBtn update={loginAddSong}>
						<div className="btn waves-effect waves-light blue darken-2 right">
							<i className="material-icons right">add</i>Crear
						</div>
					</LoginLogoutBtn>
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
