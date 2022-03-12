import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import LoginLogout from "../../layout/components/LoginLogout";
import { useUser } from "../../layout/context/UserContext";

const Repertories = () => {
	const [user, setUser] = useUser();
	const history = useHistory();

	const addRepertory = (v) => {
		setUser(v);
		history.push({
			pathname: "/add-song",
			state: { from: "Cancionero" },
		});
	};

	return (
		<Fragment>
			<div className="header">
				<h3>Repertorios</h3>
				{user.name ? (
					<Link
						to={{ pathname: "/add-song", state: { from: "Cancionero" } }}
						className="btn waves-effect waves-light blue darken-2 right"
					>
						<i className="material-icons right">add</i>Crear
					</Link>
				) : (
					<LoginLogout update={(v) => addRepertory(v)}>
						<div className="btn waves-effect waves-light blue darken-2 right">
							<i className="material-icons right">add</i>Crear
						</div>
					</LoginLogout>
				)}
			</div>
			{/* RepertoryList */}
		</Fragment>
	);
};

export default Repertories;
