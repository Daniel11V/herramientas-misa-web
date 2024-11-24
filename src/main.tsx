import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>
	);
} else {
	console.error("El elemento root no se encontró en el DOM.");
}
