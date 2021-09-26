import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import LoginLogout from '../components/LoginLogout'
import { useSongs } from '../songs-context'
import { useHistory } from 'react-router'

const Coros = () => {
    const { user, setUser } = useSongs();
    const history = useHistory();

    const loginAddCoro = (v) => {
        setUser(v);
        history.push({
        pathname: '/add-song', state: { from: 'Cancionero' }
        });
    }

    return (
        <Fragment>
            <div className="header">
              <h3>Coros</h3>
              {user.name ? (
                <Link
                  to={{ pathname: '/add-song', state: { from: 'Cancionero' } }}
                  className="btn waves-effect waves-light blue darken-2 right">
                  <i className="material-icons right">add</i>Crear
                </Link>
              ) : (
                <LoginLogout update={(v) => loginAddCoro(v)}>
                  <div
                    className="btn waves-effect waves-light blue darken-2 right">
                    <i className="material-icons right">add</i>Crear
                  </div>
                </LoginLogout>
              )}
            </div>
            {/* CoroList */}

        </Fragment>
    )
}

export default Coros

