import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/Scream';
class home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			screams: null
		};
	}

	componentDidMount() {
		axios
			.get('/screams')
			.then((response) => {
				this.setState({
					screams: response.data
				});
			})
			.catch((err) => console.log(err));
	}

	render() {
		let recentSreamsMarkup = this.state.screams ? (
			this.state.screams.map((scream) =>
			<Scream key={scream.screamId} scream={scream} />
			)) : (
			<p>loading...</p>
		);
		return (
			<Grid container spacing={10}>
				<Grid item sm={8} xs={12}>
					{recentSreamsMarkup}
				</Grid>
				<Grid item sm={4} xs={12}>
					<p>Profile</p>
				</Grid>
			</Grid>
		);
	}
}

export default home;
