import { Fragment } from "react";
import { Link } from "react-router-dom";
import LoginLogoutBtn from "../../layout/components/LoginLogoutBtn";
import { useNavigate } from "react-router";
import RepertoryList from "./components/RepertoryList";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../classes/user/actions";
import { useRepertoryListPage } from "./hooks/useRepertoryListPage";
import { Header } from "../../styles/styles";
import { IStoreState } from "../../store";

const RepertoryListPage = () => {
	const [repertoryList, loadingRepertoryList, errorRepertoryList] =
		useRepertoryListPage();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLogged = useSelector((state: IStoreState) => state.user.isLogged);

	const loginAddSong = (userData) => {
		dispatch(login(userData));
		navigate("/create-repertory", { state: { from: "Repertorios" } });
	};

	return (
		<Fragment>
			<Header>
				<h4>Repertorios</h4>
				{isLogged ? (
					<Link
						to={{
							pathname: "/create-repertory",
							state: { from: "Repertorios" },
						}}
						className="btn waves-effect waves-light blue darken-2 right"
					>
						<i className="material-icons right">add</i>Crear
					</Link>
				) : (
					<LoginLogoutBtn update={(v) => loginAddSong(v)}>
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
