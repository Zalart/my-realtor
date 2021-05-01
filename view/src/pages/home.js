import React, { Component } from 'react';
import axios from 'axios';

import Account from '../components/account';
import Listing from '../components/object';

import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { authMiddleWare } from '../util/auth';

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
/* 	appBar: {
		[theme.breakpoints.up('sm')]: {
		  width: `calc(100% - ${drawerWidth}px)`,
		  marginLeft: drawerWidth,
		},
	  }, */
	  menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
		  display: 'none',
		},
	  },
	drawer: {
		[theme.breakpoints.up('sm')]: {
		  width: drawerWidth,
		  flexShrink: 0,
		},
	},
	drawerPaper: {
		width: drawerWidth,
	  },
	  // necessary for content to be below app bar
	  toolbar: theme.mixins.toolbar,
	drawerContainer: {
		overflow: 'auto',
	  },
	  drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	  },
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		  }),
		  marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
		  easing: theme.transitions.easing.easeOut,
		  duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	  },
	avatar: {
		height: 100,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '40px',
		width: '40px',
		right: '45%',
		top: '35%'
	}
});

class home extends Component {
	state = {
		render: false
	};

	loadAccountPage = (event) => {
		this.handleDrawerClose();
		this.setState({ render: true });
	};

	loadListingsPage = (event) => {
		this.handleDrawerClose();
		this.setState({ render: false });
	};

	logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		this.props.history.push('/login');
	};

	handleDrawerOpen = () => {
		this.setState({ mobileOpen: true });
	  };
	handleDrawerClose = () => {
		this.setState({ mobileOpen: false });
	  };

	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			profilePicture: '',
			uiLoading: true,
			imageLoading: false,
			mobileOpen: false
		};
	}


	UNSAFE_componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/api/user')
			.then((response) => {
				console.log(response.data);
				this.setState({
					firstName: response.data.userCredentials.firstName,
					lastName: response.data.userCredentials.lastName,
					email: response.data.userCredentials.email,
					phoneNumber: response.data.userCredentials.phoneNumber,
					uiLoading: false,
					profilePicture: response.data.userCredentials.imageUrl
				});
			})
			.catch((error) => {
				if(error.response.status === 403) {
					this.props.history.push('/login')
				}
				console.log(error);
				this.setState({ errorMsg: 'Error in retrieving the data' });
			});
	};

	render() {
		const { classes, window } = this.props;		
		if (this.state.uiLoading === true) {
			return (
				<div className={classes.root}>
					{this.state.uiLoading && <CircularProgress className={classes.uiProgess} />}
				</div>
			);
		} else {
			const drawer = (
				<div>
					
						<Divider />
						<center>
							<Avatar src={`https://firebasestorage.googleapis.com/v0/b/realtors-profiles/o/${this.state.profilePicture}?alt=media`} className={classes.avatar} />
							<p>
								{' '}
								{this.state.firstName} {this.state.lastName}
							</p>
						</center>
						<Divider />
						<List>
							<ListItem button key="Listings" onClick={this.loadListingsPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Listings" />
							</ListItem>

							<ListItem button key="Account" onClick={this.loadAccountPage}>
								<ListItemIcon>
									{' '}
									<AccountBoxIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Account" />
							</ListItem>

							<ListItem button key="Logout" onClick={this.logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
				</div>
			);
			const container = window !== undefined ? () => window().document.body : undefined;

			return (
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
						<IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={this.handleDrawerOpen}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
							<Typography variant="h6" noWrap>
								My realtor
							</Typography>
						</Toolbar>
					</AppBar>
					<nav className={classes.drawer} aria-label="mailbox folders">
					<Hidden smUp implementation="css">
					<Drawer
					container = {container}
						/* className={classes.drawer} */
						variant="temporary" 
						anchor="left"
						open={this.state.mobileOpen}
						onClose={this.handleDrawerClose}
						classes={{
						  paper: classes.drawerPaper,
						}}
						ModalProps={{
						  keepMounted: true, // Better open performance on mobile.
						}}
					>        <div className={classes.drawerHeader}>
					<IconButton onClick={this.handleDrawerClose}>
					  <ChevronLeftIcon />
					</IconButton>
				  </div>
						{drawer}
						</Drawer>
						</Hidden>
						<Hidden xsDown implementation="css">
          			<Drawer
            			classes={{
              			paper: classes.drawerPaper,
            			}}
            			variant="permanent"
            			open
          ><div className={classes.toolbar} />
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

					{this.state.render ? <Account /> : <Listing />}
				</div>
			);
		}
	}
}

export default withStyles(styles)(home);