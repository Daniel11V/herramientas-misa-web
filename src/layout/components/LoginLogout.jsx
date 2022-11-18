import React from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { login, logout, setUserLoading } from "../../clases/user/actions";

const LoginLogout = ({ children = null, isLogged = false }) => {
	const dispatch = useDispatch();

	const loginResponse = (response) => {
		if (response.googleId) {
			dispatch(
				login({
					id: response.profileObj.googleId,
					name: response.profileObj.name,
					email: response.profileObj.imageUrl,
					imageUrl: response.profileObj.imageUrl,
					accessToken: response.accessToken,
				})
			);
		} else {
			dispatch(setUserLoading(false));
		}
	};

	const logoutResponse = () => {
		dispatch(logout());
	};

	if (children) {
		return (
			<GoogleLogin
				clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com"
				buttonText="Iniciar Sesion"
				onSuccess={loginResponse}
				onFailure={loginResponse}
				cookiePolicy={"single_host_origin"}
				render={(renderProps) => (
					<div onClick={renderProps.onClick} disabled={renderProps.disabled}>
						{children}
					</div>
				)}
			/>
		);
	} else if (isLogged) {
		return (
			<GoogleLogoutStyled
				clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
				buttonText="Cerrar Sesión"
				onLogoutSuccess={logoutResponse}
				className="googleLogout"
			/>
		);
	} else {
		return (
			<GoogleLogin
				clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com"
				buttonText="Iniciar Sesion"
				onSuccess={loginResponse}
				onFailure={loginResponse}
				cookiePolicy={"single_host_origin"}
				isSignedIn={true}
				className="googleLogin"
			/>
		);
	}
};
const GoogleLogoutStyled = styled(GoogleLogout)`
	border-radius: 4px !important;
	/* margin-top: 15px !important; */
	display: flex;
	align-items: center;
	padding: 0 8px !important;

	* {
		padding: 0 !important;
	}

	div {
		margin-right: 6px;
		padding-top: 3px !important;
	}
`;

export default LoginLogout;
