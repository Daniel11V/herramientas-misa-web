import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { login, logout, setUserLoading } from "../../classes/user/actions";
import { TUserGoogle } from "../../classes/user/types";

const LoginLogoutBtn = (p: {
	children?: any,
	isLogged?: boolean,
	update?: (p2: TUserGoogle|void) => {},
}) => {
	const {
		children = null,
		isLogged = false,
		update = () => {},
	} = p
	const dispatch = useDispatch();

	const loginResponse = (response: any) => {
		if (response.googleId) {
			const newUserDate: TUserGoogle = {
				id: response.profileObj.googleId,
				name: response.profileObj.name,
				email: response.profileObj.email,
				imageUrl: response.profileObj.imageUrl,
				accessToken: response.accessToken,
			};
			dispatch(login(newUserDate));
			update(newUserDate);
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
				// Arreglar Type
				render={(renderProps) => (
					// <div onClick={renderProps.onClick} disabled={renderProps.disabled}>
					<div onClick={renderProps.disabled ?()=>{} : renderProps.onClick} >
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

export default LoginLogoutBtn;
