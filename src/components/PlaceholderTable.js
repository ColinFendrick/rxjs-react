import React, { useState, useEffect } from 'react';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Table } from 'reactstrap';

export default () => {
	const [state, setState] = useState({ data: [] });

	useEffect(() =>
		ajax('https://jsonplaceholder.typicode.com/users')
			.pipe(map(({ response }) => response))
			.subscribe(data => setState({ data })), []);

	return (
		<div>
			<h3>Using RxJS with ReactJS</h3>
			<Table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					{state.data && state.data.map((el, ix) => (
						<tr key={`${el.name}-${ix}`}>
							<td>{el.id}</td>
							<td>{el.name}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};
