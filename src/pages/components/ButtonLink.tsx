import { useNavigate } from "react-router-dom";

// Definición de tipos para las ubicaciones y el estado
type Path = {
	pathname: string;
};

type To = Path & {
	state?: {
		from: string;
	};
};

const ButtonLink: React.FC<{
	children: any;
	pathname: string;
	from: string;
}> = ({ children, pathname, from }) => {
	const navigate = useNavigate();

	const navigateTo = (to: To) => {
		navigate(to);
	};

	const handleClick = () => {
		const destination: To = {
			pathname,
			state: {
				from,
			},
		};

		navigateTo(destination);
	};

	return (
		<div
			className="btn waves-effect waves-light blue darken-2 right"
			onClick={handleClick}
		>
			{children}
		</div>
	);
};

export default ButtonLink;
