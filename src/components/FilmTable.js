import React, { useState, useEffect } from 'react';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Table } from 'reactstrap';

import { setError } from '../helpers';

export default () => {
	const [state, setState] = useState({ movies: [], error: null });

	useEffect(() => (
		ajax({
			url: 'https://swapi.dev/api/films'
		}).pipe(map(({ response }) => response))
			.subscribe(
				({ results }) => setState(s => ({ ...s, movies: results })),
				setError(setState)
			)
	), []);

	return (
		<div>
			<h3>Star Wars Movies</h3>
			{state.error?.response ? <h4>{state.error.message}: {state.error.response.detail}</h4> :

				<Table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Release Date</th>
							<th>Director</th>
						</tr>
					</thead>
					<tbody>
						{state.movies.length ? state.movies.map((movie, ix) => (
							<tr key={`${movie.episode_id}-${ix}`}>
								<td>{movie.title}</td>
								<td>{(new Date(movie.created)).toDateString()}</td>
								<td>{movie.director}</td>
							</tr>
						)) : null}
					</tbody>
				</Table>
			}
		</div>
	);
};
