import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useSongs } from '../songs-context.jsx';
import GoogleLogin from 'react-google-login';
import M from 'materialize-css';


const Navigation = () => {
    const history = useHistory();
    const [ lastPage, setLastPage ] = useState('');
    const { user, setUser } = useSongs();

    useEffect(() => {
        let elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems);
    }, []);

    useEffect(() => {
        history.listen((location) => {
            setLastPage((location.state?location.state.from:''));
            window.scrollTo(0, 0);
        });
    }, [history, setLastPage]);

    const responseGoogle = (response) => {
        if(response.googleId && !user) {
            setUser({
                googleId: response.profileObj.googleId,
                name: response.profileObj.name,
                imageUrl: response.profileObj.imageUrl              
            });
        }
    }

    return (
        <div>
            <div className="navbar-fixed">
                <nav className="blue darken-2" style={{ marginBottom: '20px' }}>
                <div className="nav-wrapper">
                    {(!lastPage)&&
                        <Link to="/" className="brand-logo hide-on-med-and-down" style={{ paddingLeft: '20px' }}>Herramientas para Misa</Link>
                    }
                    <div data-target="mobile-demo" className="sidenav-trigger hide-on-large-only noselect" style={{ cursor: 'pointer' }}><i className="material-icons noselect">menu</i></div>
                    {(lastPage) &&
                        <div onClick={history.goBack} className="brand-logo" style={{cursor: 'pointer', fontSize: '25px', paddingLeft: '10px'}}>
                            <i className="material-icons">chevron_left</i>
                            {lastPage}
                        </div>
                    }
                    <ul className="right hide-on-med-and-down">
                    <li><Link to="/songs">Cancionero</Link></li>
                    <li><Link to="/suggestion">Recomendación</Link></li>
                    {user?(
                        <li className="profile">
                            <span className="white-text name">{user.name}</span>
                            <img className="circle" src={user.imageUrl} alt="profile" onError={()=>{this.onerror=null;this.src='https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png';}} />
                        </li>
                        ):(
                        <li>
                            <GoogleLogin
                            clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com"
                            buttonText="Iniciar Sesion"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            />
                        </li>
                        )
                    }
                    </ul>
                </div>
                </nav>
            </div>


            <ul className="sidenav sidenav-close" id="mobile-demo">
                <li>
                {(user) ? (
                    <div className="user-view profile-side">
                        <div className="background">
                            <img alt="background"src="https://images.freecreatives.com/wp-content/uploads/2016/02/Abstract-Bright-Blue-Geometric-Background.jpg" />
                        </div>
                        <img className="circle" src={user.imageUrl} key={user.imageUrl} alt="profile" onError={()=>{this.onerror=null;this.src='https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png';}} />
                        <span className="white-text name">{user.name}</span>
                    </div>
                ) : (
                    <div className="user-view">
                        <div className="background">
                            <img alt="background"src="https://images.freecreatives.com/wp-content/uploads/2016/02/Abstract-Bright-Blue-Geometric-Background.jpg" />
                        </div>
                        <img className="circle" src="https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png" alt="profile" />
                        <GoogleLogin
                        clientId="270166148168-cu4pvav4r2s5pps6b8t8chqdratnklgs.apps.googleusercontent.com"
                        buttonText="Iniciar Sesion"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        />
                    </div>
                )
                }
                </li>
                <li><i><a href="/" className="subheader" style={{ paddingLeft: '20px' }}>Herramientas para misa</a></i></li>
                <li><Link to="/songs" >Cancionero</Link></li>
                <li><Link to="/suggestion" >Recomendación para misa</Link></li>
            </ul>
        </div>
    );
}


export default Navigation;