import React, { useReducer, useEffect } from 'react';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const reducer = (state, action) => {
	switch (action.type) {
	case 'UPDATE_CHARACTERS':
		return { ...state, charsHaveLoaded: true, results: action.payload };
	case 'UPDATE_SPECIES':
		return { ...state, speciesHaveLoaded: true, results: action.payload };
	case 'SET_PAGE':
		return { ...state, page: action.payload, speciesHaveLoaded: false, charsHaveLoaded: false };
	case 'ERROR':
		return { ...state, error: action.payload };
	default:
		return { ...state, error: 'ACTION TYPE NOT SPECIFIED' };
	}
};

export default () => {
	const [state, dispatch] = useReducer(reducer, {
		results: [],
		page: 1,
		error: null,
		charsHaveLoaded: false,
		speciesHaveLoaded: false
	});

	useEffect(() => (
		ajax({
			url: `https://swapi.dev/api/people/?page=${state.page}`
		}).pipe(map(({ response }) => response))
			.subscribe(
				({ results }) => dispatch({ type: 'UPDATE_CHARACTERS', payload: results }),
				err => dispatch({ type: 'ERROR', payload: err })
			)
	), [state.page]);

	useEffect(() => {
		if (state.results.length && !state.speciesHaveLoaded) {
			const newResults = [...state.results];

			for (let i = 0; i < newResults.length; i++) {
				if (newResults[i].species[0]) {
					ajax(newResults[i].species[0])
						.pipe(map(({ response }) => response))
						.subscribe(
							species => {
								newResults[i] = { ...newResults[i], species };
							},
							err => dispatch({ type: 'ERROR', payload: err })
						);
				}
			}
			dispatch({ type: 'UPDATE_SPECIES', payload: newResults });
		}
	}, [state.results, state.speciesHaveLoaded]);

	const setPage = page => dispatch({ type: 'SET_PAGE', payload: page });

	const makeCharacterRow = character => {
		console.log(character);
		return state.speciesHaveLoaded ? <tr key={`${character?.name}}`}>
			<td>{character.name}</td>
			<td>{character.species.name || 'Human'}  {`${state.speciesHaveLoaded}`}</td>
		</tr> : null;
	};

	console.log(state.speciesHaveLoaded);
	return (
		<div>
			<h3>Star Wars Characters</h3>
			{state.error?.response ? <h4>{state.error.message}: {state.error.response.detail}</h4> :
				!state.charsHaveLoaded || !state.speciesHaveLoaded ? <div>Loading...</div> :
					<>
						<Table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Species</th>
								</tr>
							</thead>
							<tbody>
								{/* {state.results.map((character, ix) => {
									console.log(state.results);
									return <tr key={`${character?.name}-${ix}`}>
										<td>{character.name}</td>
										<td>{character.species?.name || 'Human'}</td>
									</tr>;
								})} */}
								{state.speciesHaveLoaded ? state.results.map(character => makeCharacterRow(character)) : null}
							</tbody>
						</Table>
						<Pagination aria-label='Star Wars Table pagination'>
							<PaginationItem>
								<PaginationLink previous onClick={() => setPage(state.page - 1 > 0 ? state.page - 1 : 1)} />
							</PaginationItem>

							<PaginationItem>
								<PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
							</PaginationItem>

							<PaginationItem>
								<PaginationLink onClick={() => setPage(2)}>2</PaginationLink>
							</PaginationItem>

							<PaginationItem>
								<PaginationLink onClick={() => setPage(3)}>3</PaginationLink>
							</PaginationItem>

							<PaginationItem>
								<PaginationLink onClick={() => setPage(4)}>4</PaginationLink>
							</PaginationItem>

							<PaginationItem>
								<PaginationLink next onClick={() => setPage(state.page + 1)} />
							</PaginationItem>
						</Pagination>
					</>
			}
		</div>
	);
};
