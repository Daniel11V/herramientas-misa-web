import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useSelector } from "react-redux";
import styled from "styled-components";
import LoginLogout from "./components/LoginLogout";

const Navigation = () => {
	const history = useHistory();
	const [lastPage, setLastPage] = useState("");
	const user = useSelector((state) => state.user.google);
	const isDesktop = window.screen.width >= 1280;

	useEffect(() => {
		let elem = document.querySelector(".sidenav");
		let instance = M.Sidenav.init(elem);

		return () => {
			instance.destroy();
		};
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
						<Icon
							data-target="mobile-demo"
							className="sidenav-trigger hide-on-large-only"
						>
							<i className="material-icons">menu</i>
						</Icon>
						{lastPage && (
							<BackIcon onClick={history.goBack} className="brand-logo">
								<i className="material-icons">chevron_left</i>
								{lastPage}
							</BackIcon>
						)}
						<ul className="right hide-on-med-and-down">
							<li>
								<Link to="/repertories">Repertorios</Link>
							</li>
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
							{isDesktop &&
								(user.name ? (
									<UserProfileNavbar>
										<div>
											<UserName>{user.name}</UserName>
											<LoginLogout isLogged />
										</div>
										<img
											src={user.imageUrl}
											alt="profile"
											className="circle"
											onError={(e) => {
												e.target.onerror = null;
												e.target.src =
													"https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png";
											}}
										/>
									</UserProfileNavbar>
								) : (
									<UserAnonymousNavbar>
										<LoginLogout />
									</UserAnonymousNavbar>
								))}
						</ul>
					</div>
				</nav>
			</div>
			<ul className="sidenav sidenav-close" id="mobile-demo">
				<li>
					{!isDesktop &&
						(user.name ? (
							<UserProfileSidebar>
								<div className="background">
									<img
										alt="background"
										src="https://images.freecreatives.com/wp-content/uploads/2016/02/Abstract-Bright-Blue-Geometric-Background.jpg"
									/>
								</div>
								<UserImage
									src={user.imageUrl}
									alt="profile"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src =
											"https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png";
									}}
								/>
								<UserName>{user.name}</UserName>
								<LoginLogout isLogged />
							</UserProfileSidebar>
						) : (
							<UserAnonymousSidebar>
								<div className="background">
									<img
										alt="background"
										src="https://images.freecreatives.com/wp-content/uploads/2016/02/Abstract-Bright-Blue-Geometric-Background.jpg"
									/>
								</div>
								<img
									src="https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png"
									alt="profile"
									className="circle"
								/>
								<LoginLogout />
							</UserAnonymousSidebar>
						))}
				</li>
				<li>
					<i>
						<a href="/" className="subheader" style={{ paddingLeft: "20px" }}>
							Herramientas para misa
						</a>
					</i>
				</li>
				<li>
					<Link to="/repertories">Repertorios</Link>
				</li>
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
const Icon = styled.div`
	cursor: pointer;
	flexwrap: nowrap;
`;
const BackIcon = styled(Icon)`
	fontsize: 25px;
	paddingleft: 10px;
	display: flex;
`;
const UserImage = styled.img.attrs({
	className: "circle",
})`
	padding: 0 !important;
	width: 100px !important;
	height: 100px !important;
`;
const UserName = styled.span.attrs({
	className: "white-text",
})``;
const UserProfileNavbar = styled.li`
	display: flex;
	align-items: center;
	padding-left: 18px;
	margin-left: 10px;
	font-size: 20px;
	border-left: 4px solid #49a2ff;
	cursor: default;

	div {
		display: flex;
		flex-direction: column;
	}

	${UserName} {
		line-height: normal;
		margin-top: 2px;
		font-size: 23px;
	}

	.googleLogout {
		font-size: 17px;
		height: auto;
		padding: 0 5px 0 !important;
		margin-top: 3px !important;
		margin-bottom: 2px !important;
		transform: scale(0.8) translate(-17px, 0px);
	}

	img {
		height: 45px;
		width: 45px;
		margin: 0 15px;
	}
`;
const UserAnonymousNavbar = styled.li`
	.googleLogin {
		transform: scale(0.9) translate(-10px, 2px) !important;
		margin-left: 15px !important;
	}

	.googleLogin > * {
		padding-top: 7px !important;
		padding-bottom: 4px !important;
		margin: 0 !important;
		font-size: 16px !important;
	}
`;
const UserAnonymousSidebar = styled.div.attrs({
	className: "user-view",
})`
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding-bottom: 16px !important;

	.googleLogin {
		border-radius: 7px !important;
		padding: 0 6px !important;
		font-size: 18px !important;
	}

	.googleLogin > div {
		padding: 2px 11px 0 8px !important;
		margin: 0 !important;
	}
`;
const UserProfileSidebar = styled(UserAnonymousSidebar).attrs({
	className: "user-view",
})`
	flex-direction: column;

	.googleLogout {
		margin-top: 15px !important;
		height: 30px;
	}

	${UserName} {
		margin: 10px 20px 0 !important;
		font-size: 25px !important;
	}
`;

export default Navigation;
