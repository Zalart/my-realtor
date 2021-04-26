import React, {useState} from 'react';
import { useHistory } from "react-router-dom"

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';

import logoGray from '../../src/assets/logo-gray.svg';
import logo from '../../src/assets/logo-main.svg';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
	backgroundPoster: {
		backgroundImage: 'url(https://source.unsplash.com/collection/38873046/1600x1200)',
		backgroundPosition: 'center center',
		backgroundSize: 'cover',
		margin: 0,
		padding: 0,
		border: 0,
		position: 'relative',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		minHeight: '100vh'
		},
		contentWrapper: {
			paddingTop: theme.spacing(6),
			flex: '1 0 auto',
			flexGrow: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center'
		},
		footerWrapper: {
			maxMidth: 1280
		},
		footerLogoWrapper: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center'
		},
		paper: {
			display: 'flex',
			textAlign: 'center',
			backgroundColor: 'rgba(255, 255, 255, .9)',
			borderRadius: theme.spacing(1),
		},
		avatar: {
			margin: theme.spacing(1, 3),
			backgroundColor: theme.palette.secondary.main
		},
		formContainer: {
			padding: theme.spacing(6, 0, 0, 0)
		},
		formAlign: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		},
		form: {
			width: '100%',
			margin: theme.spacing(0),
			padding: theme.spacing(2),
		},
		submit: {
			margin: theme.spacing(3, 0, 2)
		},
		customError: {
			color: 'red',
			fontSize: '1rem',
			marginTop: 10,
			textAlign: 'center'
		},
		progess: {
			position: 'absolute'
		},
		footer: {
			backgroundColor: '#42444e',
			flex: '0 0 auto'
		},
		secondaryMain:{
			color: theme.palette.secondary.main
		},
		secondaryLight:{
			color: theme.palette.secondary.light
		},
		secondaryDark:{
			color: theme.palette.secondary.dark
		},
		primaryMain:{
			color: theme.palette.primary.main
		},
		primaryLight:{
			color: theme.palette.primary.light
		},
		primaryDark:{
			color: theme.palette.primary.dark
		},
		contrastText:{
			color: '#FFF'
		},
		lightText: {
			color: '#888',
			fontStyle: 'italic'
		},
		progress: {
			position: 'absolute'
		}
}));

const initialState = {
	firstName: '',
	lastName: '',
	phoneNumber: '',
	email: '',
	password: '',
	confirmPassword: '',
	errors: [],
	loading: false
}

const Signup = (props) => {

	const [state, setState] = useState(initialState);
	let history = useHistory();
	const classes = useStyles();

	const handleChange = (event) => {
		setState({
			...state,
			[event.target.name]: event.target.value
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setState({ 
			...state,
			loading: true 
		});
		const newUserData = {
			firstName: state.firstName,
			lastName: state.lastName,
			phoneNumber: state.phoneNumber,
			email:state.email,
			password: state.password,
			confirmPassword: state.confirmPassword
		};
		axios
			.post('/api/signup', newUserData)
			.then((response) => {
				localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
				setState({ 
					...state,
					loading: false,
				});	
				history.push('/');
			})
			.catch((error) => {
				setState({
					...state,
					errors: error.response.data,
					loading: false
				});
			});
	};
		const { errors, loading } = state;
		return (
			<div className={classes.backgroundPoster}>
			 <Box className ={classes.contentWrapper}>
			<Container component="main" maxWidth="md">
				<CssBaseline />

				<div className={classes.paper}>
				<Hidden smDown>
                <Container minWidth="sm" maxWidth="sm" className={classes.primaryMain}>
                <Grid item xs>
                <Box component={'img'}
                  width={300}
                  src={logo}
                  mt={6}
                   alt='My realtor'
                  />
                  <Box py={2}>
                <Typography component="h2" variant="h4" color="primary" style={{ fontWeight: 600 }}>
                    Save, store, distribute 
                </Typography>
                </Box>
                <Box pt={4}>
                <Typography component="h2" variant="h5" className={classes.lightText} >
                    Easy listing integration solution 
                </Typography>
                </Box>
                </Grid>
                </Container>
                </Hidden>

				<Container maxWidth="xs" className={classes.formContainer}>
                <Grid item xs className={classes.formAlign}>
                <Hidden smDown>
                 <Avatar className={classes.avatar}>
                
                    <LockOutlinedIcon />
                   
                </Avatar>
                </Hidden>
				<Hidden mdUp>
        <Box component={'img'} src={logo} height={70} width={130}/>
                </Hidden>

					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="firstName"
									label="First Name"
									name="firstName"
									autoComplete="firstName"
									helperText={errors.firstName}
									error={errors.firstName ? true : false}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="lastName"
									helperText={errors.lastName}
									error={errors.lastName ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="phoneNumber"
									label="Phone Number"
									name="phoneNumber"
									autoComplete="phoneNumber"
									pattern="[7-9]{1}[0-9]{9}"
									helperText={errors.phoneNumber}
									error={errors.phoneNumber ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									helperText={errors.email}
									error={errors.email ? true : false}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									helperText={errors.password}
									error={errors.password ? true : false}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="confirmPassword"
									label="Confirm Password"
									type="password"
									id="confirmPassword"
									autoComplete="current-password"
									onChange={handleChange}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={handleSubmit}
                            disabled={loading || 
                                !state.email || 
                                !state.password ||
                                !state.firstName || 
                                !state.lastName ||
                                !state.phoneNumber}
						>
							Sign Up
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link href="login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
					</Grid>
					</Container>
				</div>
			</Container>
			</Box>
			 {/*   //Footer */}
			 <Box py={4} className={classes.footer}>
        <Container>
            <Grid container spacing={4} className={classes.footerWrapper}>
                <Grid item xs={12} md={4} lg={3} className={classes.footerLogoWrapper}>
                    <Box component={'img'}
                  width={80}
                  src={logoGray}
                  mx={5}
                  
                   alt='My realtor'
                  />
                  
                  </Grid>
          
                <Grid item xs={12} md={4} lg={3}><Typography variant="body1" className={classes.contrastText}>Footer here</Typography></Grid>
                </Grid>
        </Container>
               
        </Box>
			</div>
		);
	
}

Signup.propTypes = {
    width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
  };
export default withWidth()(Signup);
