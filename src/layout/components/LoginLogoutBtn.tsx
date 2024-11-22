import styled from "styled-components";
import { TUserGoogle } from "../../classes/user/types.d";
import useLogin from '../hooks/useLogin';


const LoginLogoutBtn = (p: {
	children?: any;
	isLogged?: boolean;
	update?: (userData: TUserGoogle) => void;
}) => {
	const { children = null, isLogged = false, update = () => {} } = p;
	
	const { handleLogin, handleLogout } = useLogin({update})

	if (children) {
		return (
			<div onClick={() => handleLogin()}>
				{children}
			</div>
			// <GoogleLogin
			// 	// buttonText="Iniciar Sesion"
			// 	onSuccess={loginResponse}
			// 	onError={loginResponse}
			// 	cookiePolicy={"single_host_origin"}
			// 	// Arreglar Type
			// 	render={(renderProps) => (
			// 		// <div onClick={renderProps.onClick} disabled={renderProps.disabled}>
					
			// 	)}
			// />
		);
	} else if (isLogged) {
		return (
			<GoogleLogoutStyled
				// buttonText="Cerrar Sesión"
				onClick={() => handleLogout()}
				className="googleLogout"
			/>
		);
	} else {
		return (
			<button
				// buttonText="Iniciar Sesion"
				// cookiePolicy={"single_host_origin"}
				onClick={() => handleLogin()}
				// isSignedIn={true}
				className="googleLogin"
			/>
		);
	}
};
const GoogleLogoutStyled = styled.div`
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
