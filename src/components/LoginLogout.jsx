import React from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const LoginLogout = ({children = null, logout = false, update}) => {    

    const loginResponse = (response) => {
        if(response.googleId) {
            update({
                googleId: response.profileObj.googleId,
                name: response.profileObj.name,
                imageUrl: response.profileObj.imageUrl              
            });
        }
    }

    const logoutResponse = () => {
        update(null);
    }
    
    if (children) {
        return (
            <GoogleLogin
                clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com"
                buttonText="Iniciar Sesion"
                onSuccess={loginResponse}
                onFailure={loginResponse}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                  <div onClick={renderProps.onClick} disabled={renderProps.disabled}>{children}</div>
                )}
                />     
        )
    } else if (!logout) {
        return (
            <GoogleLogin
                clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com"
                buttonText="Iniciar Sesion"
                onSuccess={loginResponse}
                onFailure={loginResponse}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                className="googleLogin"
                />   
        )
    } else {
        return (
            <GoogleLogout
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Cerrar Sesión"
                onLogoutSuccess={logoutResponse}
                className="googleLogout"
                />
        )
    }
}

export default LoginLogout;