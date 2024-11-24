import "materialize-css/dist/css/materialize.min.css";
import store from "./store";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import "./index.css";

import { useUser } from "./classes/user/useUser";
import { Provider } from "react-redux";
import { AppRouter } from "./routes/AppRouter.js";
// import Suggestion from './pages/suggestions/Suggestion';

const App = () => {
	console.log("AACAAAAAAAAAAAAAAAAAA");
	// const { loading } = useUser();
	return (
		<Provider store={store}>
			<GoogleOAuthProvider clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com">
				<AppRouter />
			</GoogleOAuthProvider>
		</Provider>
	);
};

export default App;
