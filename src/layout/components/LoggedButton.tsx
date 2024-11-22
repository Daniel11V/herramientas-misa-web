import { useSelector } from "react-redux";
import useLogin from "../hooks/useLogin";
import { TRootState } from "../../store";

const LoggedButton = (p: {
	children: any;
	onClick: () => void;
	className: string;
	style?: any;
}) => {
	const { children = null, onClick = () => {}, className, style } = p;
	
	const { handleLogin } = useLogin()
	
	const isLogged = useSelector((state: TRootState) => state.user.isLogged);

	return isLogged ? (
		<div
			className={className}
			style={style || {}}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{children}
		</div>
	) : (
		<div
			onClick={() => handleLogin()}
			// disabled={renderProps.disabled}
			className={className}
			style={style || {}}
		>
			{children}
		</div>
		// <GoogleLogin
		// 	clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com"
		// 	buttonText="Iniciar Sesion"
		// 	onSuccess={loginResponse}
		// 	onFailure={loginResponse}
		// 	// cookiePolicy={"single_host_origin"}
		// 	render={(renderProps) => (
		// 		<div
		// 			onClick={renderProps.onClick}
		// 			// disabled={renderProps.disabled}
		// 			className={className}
		// 			style={style || {}}
		// 		>
		// 			{children}
		// 		</div>
		// 	)}
		// />
	);
};
export default LoggedButton;
