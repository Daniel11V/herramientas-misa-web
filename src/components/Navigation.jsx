import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import M from 'materialize-css';


const Navigation = () => {
    const history = useHistory();
    const [ lastPage, setLastPage ] = useState('');

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

    return (
        <div>
            <div className="navbar-fixed">
                <nav className="blue darken-2" style={{ marginBottom: '20px' }}>
                <div className="nav-wrapper">
                    <Link to="/" className="brand-logo hide-on-med-and-down" style={{ paddingLeft: '20px' }}>Herramientas para Misa</Link>
                    <div data-target="mobile-demo" className="sidenav-trigger hide-on-large-only" style={{ cursor: 'pointer' }}><i className="material-icons">menu</i></div>
                    {(lastPage) &&
                        <div onClick={history.goBack} className="brand-logo hide-on-large-only" style={{cursor: 'pointer', fontSize: '25px'}}>
                            <i className="material-icons">chevron_left</i>
                            {lastPage}
                        </div>
                    }
                    <ul className="right hide-on-med-and-down">
                    <li><Link to="/songs">Cancionero</Link></li>
                    <li><Link to="/suggestion">Recomendación</Link></li>
                    <li><Link to="/profile">Iniciar sesion</Link></li>
                    </ul>
                </div>
                </nav>
            </div>


            <ul className="sidenav sidenav-close" id="mobile-demo">
                <li>
                <div className="user-view">
                    <div className="background">
                    <img src="https://images.freecreatives.com/wp-content/uploads/2016/02/Abstract-Bright-Blue-Geometric-Background.jpg" alt="background" />
                    </div>
                    <Link to="/profile"><img className="circle" src="https://cybergisxhub.cigi.illinois.edu/wp-content/uploads/2020/10/Portrait_Placeholder.png" alt="profile" /></Link>
                    {
                    (0) ? (
                        <Link to="/profile">
                        <span className="white-text name">Daniel Vinet</span>
                        <span className="white-text email">daniel1vinet@gmail.com</span>
                        </Link>
                    ) : (
                        <Link to="/" className="btn-small transparent">
                        <i className="material-icons right">cloud</i>iniciar sesion
                        </Link>
                    )
                    }
                </div>
                </li>
                <li><i><a href="/" className="subheader" style={{ paddingLeft: '20px' }}>Herramientas para misa</a></i></li>
                <li><Link to="/songs" >Cancionero</Link></li>
                <li><Link to="/suggestion" >Recomendación para misa</Link></li>
            </ul>
        </div>
    );
}


export default Navigation;