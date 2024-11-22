import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import store from "./store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google"
// import "./index.css";
console.log("ACCA1")
const rootElement = document.getElementById("root");
console.log("ACCA2")

if(rootElement) {
	console.log("ACCA3")
	ReactDOM.createRoot(rootElement).render(
		<StrictMode>
			<Provider store={store}>
				<GoogleOAuthProvider clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com">
					<App />
				</GoogleOAuthProvider>
			</Provider>
		</StrictMode>
	);
} else {
	console.error("El elemento root no se encontró en el DOM.");
}
