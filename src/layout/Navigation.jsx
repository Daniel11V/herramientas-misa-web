import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import LoginLogout from "./components/LoginLogout.jsx";
import { useSelector } from "react-redux";

const Navigation = () => {
	const history = useHistory();
	const [lastPage, setLastPage] = useState("");
	const user = useSelector((state) => state.user.google);

	useEffect(() => {
		let elems = document.querySelectorAll(".sidenav");
		M.Sidenav.init(elems);
	}, []);

	useEffect(() => {
		history.listen((location) => {
			setLastPage(location.state ? location.state.from : "");
			window.scrollTo(0, 0);
		});
	}, [history, setLastPage]);

	return (
		<div>
			<div className="navbar-fixed">
				<nav className="blue darken-2" style={{ marginBottom: "20px" }}>
					<div className="nav-wrapper">
						{!lastPage && (
							<Link
								to="/"
								className="brand-logo hide-on-med-and-down"
								style={{ paddingLeft: "20px" }}
							>
								Herramientas para Misa
							</Link>
						)}
						<div
							data-target="mobile-demo"
							className="sidenav-trigger hide-on-large-only noselect"
							style={{ cursor: "pointer" }}
						>
							<i className="material-icons noselect">menu</i>
						</div>
						{lastPage && (
							<div
								onClick={history.goBack}
								className="brand-logo noselect"
								style={{
									cursor: "pointer",
									fontSize: "25px",
									paddingLeft: "10px",
									display: "flex",
									flexWrap: "nowrap",
								}}
							>
								<i className="material-icons">chevron_left</i>
								{lastPage}
							</div>
						)}
						<ul className="right hide-on-med-and-down">
							{/* <li>
								<Link to="/repertories">Repertorios</Link>
							</li> */}
							<li>
								<Link to="/songs">Cancionero</Link>
							</li>
							{user.name && (
								<li>
									<Link to="/myLibrary">Mi Biblioteca</Link>
								</li>
							)}
							{/* <li>
								<Link to="/suggestion">Recomendación</Link>
							</li> */}
							{user.name ? (
								<li className="profile">
									<div style={{ display: "flex", flexDirection: "column" }}>
										<span
											className="white-text name"
											style={{
												lineHeight: "normal",
												marginTop: "2px",
												fontSize: "23px",
											}}
										>
											{user.name}
										</span>
										<LoginLogout logout />
									</div>
									<img
										className="circle"
										src={user.imageUrl}
										alt="profile"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src =
												"https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png";
										}}
									/>
								</li>
							) : (
								<li className="sessionLi">
									<LoginLogout />
								</li>
							)}
						</ul>
					</div>
				</nav>
			</div>

			<ul className="sidenav sidenav-close" id="mobile-demo">
				<li>
					{user.name ? (
						<div className="user-view profile-side">
							<div className="background">
								<img
									alt="background"
									src="https://images.freecreatives.com/wp-content/uploads/2016/02/Abstract-Bright-Blue-Geometric-Background.jpg"
								/>
							</div>
							<img
								className="circle"
								src={user.imageUrl}
								key={user.imageUrl}
								alt="profile"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src =
										"https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png";
								}}
							/>
							<span className="white-text name">{user.name}</span>
							<LoginLogout logout className="logout" />
						</div>
					) : (
						<div className="user-view">
							<div className="background">
								<img
									alt="background"
									src="https://images.freecreatives.com/wp-content/uploads/2016/02/Abstract-Bright-Blue-Geometric-Background.jpg"
								/>
							</div>
							<img
								className="circle"
								src="https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png"
								alt="profile"
							/>
							<LoginLogout />
						</div>
					)}
				</li>
				<li>
					<i>
						<a href="/" className="subheader" style={{ paddingLeft: "20px" }}>
							Herramientas para misa
						</a>
					</i>
				</li>
				{/* <li>
					<Link to="/repertories">Repertorios</Link>
				</li> */}
				<li>
					<Link to="/songs">Cancionero</Link>
				</li>
				{user.name && (
					<li>
						<Link to="/mylibrary">Mi Biblioteca</Link>
					</li>
				)}
				{/* <li>
					<Link to="/suggestion">Recomendación para misa</Link>
				</li> */}
			</ul>
		</div>
	);
};

export default Navigation;
