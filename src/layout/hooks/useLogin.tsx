import { googleLogout, TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { TUserGoogle } from '../../classes/user/types';
import { logout, setUserLoading } from '../../classes/user/reducers';
import { useAppDispatch } from '../../store';

type TTokenResponse = Omit<TokenResponse, "error" | "error_description" | "error_uri">

const useLogin = ({update = () => {}}: {update?: (userData: TUserGoogle) => void} = {}) => {
	const dispatch = useAppDispatch();
	
	const handleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse: TTokenResponse) => {
			const accessToken = tokenResponse.access_token;

			try {
				// Solicita los datos del perfil usando el token de acceso
				const userProfile = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				});

				// axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userToken}`, {
				// 	headers: {
				// 		Authorization: `Bearer ${userToken}`,
				// 		Accept: 'application/json'
				// 	}
				// })
				
				// Puedes almacenar o utilizar los datos del perfil como necesites
				console.log("ACA LOGGED", userProfile.data)
				// const newUserDate: TUserGoogle = {
				// 	id: res.data.profileObj.googleId,
				// 	name: res.data.profileObj.name,
				// 	email: res.data.profileObj.email,
				// 	imageUrl: res.data.profileObj.imageUrl,
				// 	accessToken: res.data.accessToken,
				// };
				
				// dispatch(login({...res.data}));
				// update?.(res.data);
			} catch (error) {
				console.error('Error al obtener el perfil de usuario', error);
			} finally {
				dispatch(setUserLoading(false))
			}
		},
        onError: (error) => {
			console.log('Login Failed:', error)
			dispatch(setUserLoading(false))
		}
    });
	
	const handleLogout = () => {
        googleLogout();
		dispatch(logout());
    };

	return { handleLogin, handleLogout }
};

export default useLogin;
