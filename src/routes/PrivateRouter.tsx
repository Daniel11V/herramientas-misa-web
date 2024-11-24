import { Route, Navigate } from "react-router-dom";
import { RoutesWithNotFound } from "./RoutesWithNotFound";

export const PrivateRouter = () => {
	return (
		<RoutesWithNotFound>
			<Route path="/" element={<Navigate to="/profile" />} />
			<Route path="/profile" element={<div></div>} />
			<Route path="/profile1" element={<div></div>} />
			<Route path="/profile2" element={<div></div>} />
		</RoutesWithNotFound>
	);
};
