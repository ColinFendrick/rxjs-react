import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import { Home, PlaceholderTable, CharacterTable, FilmTable } from './components';

export default () => {
	return (
		<>
			<div>
				<nav className='navbar navbar-expand navbar-dark bg-dark'>
					<div className='navbar-nav mr-auto'>
						<li className='nav-item'>
							<Link to={'/'} className='nav-link'>
								Home
							</Link>
						</li>

						<li className='nav-item'>
							<Link to={'/placeholder'} className='nav-link'>
								Default Table
							</Link>
						</li>

						<li className='nav-item'>
							<Link to={'/characters'} className='nav-link'>
								Characters Table
							</Link>
						</li>

						<li className='nav-item'>
							<Link to={'/films'} className='nav-link'>
								Movies Table
							</Link>
						</li>
					</div>
				</nav>
			</div>

			<Container fluid>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/placeholder' component={PlaceholderTable} />
					<Route path='/characters' component={CharacterTable} />
					<Route path='/films' component={FilmTable} />
				</Switch>
			</Container>
		</>
	);
};
