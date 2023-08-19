import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { login, setUserLoading } from "../../classes/user/actions";
import { TStoreState } from "../../store";
import { TUserGoogle } from "../../classes/user/types";

const LoggedButton = (p: { children: any, onClick: () => void, className: string }) => {
	const { children = null, onClick = () => {}, className } = p;
	const dispatch = useDispatch();
	const isLogged = useSelector((state: TStoreState) => state.user.isLogged);

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
			onClick();
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
