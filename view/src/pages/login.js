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
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import FacebookIcon from '@material-ui/icons/Facebook';


import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

const useStyles = makeStyles((theme) =>({

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
        maxMidth: 1280,
        alignItems: 'flex-start'

    },
    footerColWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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
        padding: theme.spacing(6, 0, 0, 0),
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
    footer: {
        backgroundColor: '#42444e',
        flex: '0 0 auto',
        marginTop: theme.spacing(3),
        padding: theme.spacing(4, 2)
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
        color: '#888'
    },
    lightItalicText: {
        color: '#888',
        fontStyle: 'italic'
    },
    progress: {
		position: 'absolute'
	},
    customHoverFocus: {
        "&:hover, &.Mui-focusVisible": { backgroundColor: 'rgba(255, 255, 255, .2)'},
        margin: theme.spacing(0, 1)
       
      }

}));

const initialState = {
    email: '',
    password: '',
    errors: [],
    loading: false,
};

const Login = (props) => {

const [state, setState] = useState(initialState);
let history = useHistory();
const classes = useStyles();
const { width } = props;


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
    const userData = {
        email: state.email,
        password: state.password
    };
    axios
        .post('/api/login', userData)
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
                <Typography component="h2" variant="h5" className={classes.lightItalicText} >
                    A no-fuss listing integration solution 
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
                    Login
                </Typography>
                <form className={classes.form} noValidate>
                {errors.general && (
                        <Typography variant="body2" className={classes.customError}>
                            {errors.general}
                        </Typography>
                    )}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        type="email"
                        autoFocus
                        helperText={errors.email}
                        error={errors.email ? true : false}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                        disabled={loading || !state.email || state.password.length < 6}
                    >
                        Sign In
                        {loading && <CircularProgress size={30} className={classes.progress} />}
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="signup" variant="body2">
                                {"Don't have an account? Sign up"}
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
      <Box width={'100%'}>
        <Box className={classes.footer}>
        <Container>
            <Grid container spacing={1} className={classes.footerWrapper}>
                <Grid item xs={12} md={4} lg={4} className={classes.footerColWrapper}>
                    <Box component={'img'}
                  width={120}
                  src={logoGray}
                 
                  
                   alt='My realtor'
                  /> 
                 <Typography variant="body2" className={classes.contrastText}>© My realtor, Belarus</Typography>
                  </Grid>
                <Grid item xs={12} md={4} lg={4} className={classes.footerColWrapper}>
                    <Typography variant="body2" className={classes.contrastText}>Created with ❤️ In Belarus</Typography>  <Typography variant="body2" className={classes.contrastText}>for © WildCodeSchool Demo Day</Typography>
                    <Box className={classes.lightText} py={1}>
                        <IconButton color="primary" className={classes.customHoverFocus} aria-label="Github">
                        <GitHubIcon onClick={event =>  window.location.href='https://github.com/Zalart/my-realtor'}/>
                        </IconButton>
                        <IconButton color="primary" className={classes.customHoverFocus} aria-label="LinkedIn">
                        <LinkedInIcon onClick={event =>  window.location.href='https://www.linkedin.com/in/zalart/'}/>
                        </IconButton>
                        <IconButton color="primary" className={classes.customHoverFocus} aria-label="Facebook">
                        <FacebookIcon onClick={event =>  window.location.href='https://www.facebook.com/profile.php?id=100003622561803'}/>
                        </IconButton>
                    </Box>
                    </Grid>
                <Grid item xs={12} md={4} lg={4} className={classes.footerColWrapper}>
                <Box className={classes.lightText}>Collaborated by:</Box>
                <Box p={1} className={classes.contrastText}>Artur Zalewski</Box>
                <Box className={classes.contrastText}>Aliaksei Fokin</Box>
                </Grid>
                
                </Grid>
                
        </Container>
               
        </Box>
        </Box>
        </div>
    );


}


Login.propTypes = {
    width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
  };
export default withWidth()(Login);