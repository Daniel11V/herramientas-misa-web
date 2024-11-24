import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

type TProps = {
	children: ReactNode;
};

export const RoutesWithNotFound = ({ children }: TProps) => {
	return (
		<Routes>
			{children}
			<Route path="/404" element={<h3>Página no encontrada.</h3>} />
			<Route path="*" element={<Navigate to="/404" />} />
		</Routes>
	);
};
