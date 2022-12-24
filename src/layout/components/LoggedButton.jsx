import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { login, setUserLoading } from "../../clases/user/actions";

const LoggedButton = ({ children = null, onClick = () => {}, className }) => {
	const dispatch = useDispatch();
	const isLogged = useSelector((state) => state.user.isLogged);

	const loginResponse = (response) => {
		if (response.googleId) {
			const newUserDate = {
				id: response.profileObj.googleId,
				name: response.profileObj.name,
				email: response.profileObj.email,
				imageUrl: response.profileObj.imageUrl,
				accessToken: response.accessToken,
			};
			dispatch(login(newUserDate));
			onClick(newUserDate);
		} else {
			dispatch(setUserLoading(false));
		}
	};

	return isLogged ? (
		<div
			className={className}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{children}
		</div>
	) : (
		<GoogleLogin
			clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com"
			buttonText="Iniciar Sesion"
			onSuccess={loginResponse}
			onFailure={loginResponse}
			// cookiePolicy={"single_host_origin"}
			render={(renderProps) => (
				<div
					onClick={renderProps.onClick}
					// disabled={renderProps.disabled}
					className={className}
				>
					{children}
				</div>
			)}
		/>
	);
};
export default LoggedButton;
