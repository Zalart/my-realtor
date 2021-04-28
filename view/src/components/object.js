import React, { Component } from 'react';
import YandexMap from './YandexMap';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LaunchIcon from '@material-ui/icons/Launch';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';
import FileUploader from './FIleUploader';


const styles = ((theme) => ({
     content: {
        flexGrow: 1,
        padding: theme.spacing(2),
    }, 
    toolbar: theme.mixins.toolbar,
    title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		"&:hover, &.Mui-focusVisible": { backgroundColor: theme.palette.secondary.main},
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: theme.mixins.toolbar - 36,
		right: 10, 
		backgroundColor: theme.palette.secondary.light,
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0,
		zIndex: 1
	},
	form: {
		width: '90%',
		marginTop: theme.spacing(3)
	},
	root: {
		minWidth: 320
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '40px',
		width: '40px',
		right: '45%',
		top: '35%'
	},
	dialogStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	},


	formControl: {
		marginLeft: theme.spacing(0),
		minWidth: 80,
		width: '100%'
	  },
	  selectEmpty: {
		marginTop: theme.spacing(0),
	  },
	//card styles
	  cardLayout: {
		display: 'flex',
		flexWrap: 'wrap'
	  },
	  cardDetails: {
		display: 'flex',
		flexDirection: 'column',
		
	  },
	  cardContent: {
		flex: '1 0 auto',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		
	  },	  
	  cardMedia: {
		height: 160,
		width: 230,
		paddingLeft: 0,
	  },
	  cardActionsContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		flex: '1 0 auto',
	  },
	  cardActions: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		marginLeft: 8
	  },
	  inLineIcon: {
		  verticalAlign: 'sub',
	  },
	  secondaryDark: {
		  color: theme.palette.secondary.dark
	  },
	  centeredDialog: {
		display: 'flex',
		flexDirection: 'column',
		  alignItems: 'center'
	  }
    })
);

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class object extends Component {
	constructor(props) {
		super(props);

		this.state = {
			objects: '',
			title: '',
			address: '',
			listingType: '',
			price: '',
			body: '',
			objectId: '',
			errors: [],
			imagesUrls: [],
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false,
			confirmDeleteOpen: false
		};

		this.deleteObjectHandler = this.deleteObjectHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
		this.handleSetImages = this.handleSetImages.bind(this);
		this.handleConfirmDeleteOpen = this.handleConfirmDeleteOpen.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	handleAddressChange = (newAddress) => {
		this.setState({
			address: newAddress
		});
	};

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/api/objects')
			.then((response) => {
				this.setState({
					objects: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	deleteObjectHandler(data) {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		let objectId = this.state.confirmDeleteOpen;
		axios
			.delete(`/api/object/${objectId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}


	handleImageChange = (event) => {
		this.setState({
			image: event.target.files[0]
		});
	};

	 objectPictureHandler = (event) => {
		event.preventDefault();
		this.setState({
			uiLoading: true
		});

		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		let form_data = new FormData();
		form_data.append('image', this.state.image);
		form_data.append('content', this.state.content);
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.post(`/api/object/${this.state.objectId}/images`, form_data, {
				headers: {
					'content-type': 'multipart/form-data'
				}
			})
			.then(() => {
				window.location.reload();
			})
			.catch((error) => {
				if (error.response.status === 403) {
					this.props.history.push('/login');
				}
				console.log(error);
				this.setState({
					uiLoading: false,
					imageError: 'Error in posting the data'
				});
			});
	}; 


	handleEditClickOpen(data) {
		this.setState({
			title: data.object.title,
			address: data.object.address,
			body: data.object.body,
			listingType: data.object.listingType,
			price: data.object.price,
			area: data.object.area,
			bedrooms: data.object.bedrooms,
			floor: data.object.floor,
			objectId: data.object.objectId,
			imagesUrls: data.object.imagesUrls,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
		this.setState({
			title: data.object.title,
			address: data.object.address,
			body: data.object.body,
			listingType: data.object.listingType,
			price: data.object.price,
			area: data.object.area,
			bedrooms: data.object.bedrooms,
			floor: data.object.floor,
			viewOpen: true
		});
	}
	handleSetImages(data) {
		console.log('Image data passed to state.imagesUrl')
		this.setState({
			imagesUrls: data.map((fileOne)=>{
				
				return fileOne.serverId;
			})
		  })
	}
	handleConfirmDeleteOpen = (data) => {
		this.setState({
			confirmDeleteOpen: data,
		});
	}

	render() {
		const DialogTitle = withStyles(styles)((props) => {
			const { children, classes, onClose, ...other } = props;
			return (
				<MuiDialogTitle disableTypography className={classes.root} {...other}>
					<Typography variant="h6">{children}</Typography>
					{onClose ? (
						<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
							<CloseIcon />
						</IconButton>
					) : null}
				</MuiDialogTitle>
			);
		});

		const DialogContent = withStyles((theme) => ({
			viewRoot: {
				padding: theme.spacing(2)
			}
		}))(MuiDialogContent);

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen, confirmDeleteOpen } = this.state;
		
		// открываем форму для добавления новго объекта
		const handleClickOpen = () => {
			this.setState({
				objectId: '',
				listingType: '',
				address: '',
				price: '',
				area: '',
				bedrooms: '',
				floor: '',
				title: '',
				body: '',
				buttonType: '',
				imagesUrls: [],
				open: true
			});
		};


		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userObject = {
				title: this.state.title,
				address: this.state.address,
				body: this.state.body,
				listingType: this.state.listingType,
				price: this.state.price,
				area: this.state.area,
				bedrooms: this.state.bedrooms,
				floor: this.state.floor,

				imagesUrls: this.state.imagesUrls

			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/api/object/${this.state.objectId}`,
					method: 'put',
					data: userObject
				};
			} else {
				options = {
					url: '/api/object',
					method: 'post',
					data: userObject
				};
			}

			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
		};
		const handleConfirmDeleteClose = () => {
			this.setState({ 
				confirmDeleteOpen: '',
			});
		};

		const handleClose = (event) => {
			this.setState({ 
				open: false,
			});
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={40} className={classes.uiProgess} />}
				</main>
			);
		} else {
			return (
			<>
				<main className={classes.content}>
					<div className={classes.toolbar} />

					<IconButton
						className={classes.floatingButton}
						color="secondary"
						aria-label="Add Object"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60}} />
					</IconButton>
					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
						<div className={classes.centeredDialog}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									{this.state.buttonType === 'Edit' ? 'Edit Listing' : 'Add a new listing'}
								</Typography>
								<Button
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
								</Button>
							</Toolbar>
						</AppBar>
						<div className={classes.toolbar} />
						<form className={classes.form} noValidate>
						
							<Grid container spacing={4}>
								<Grid item md={6} xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="objectTitle"
										label="Object Title"
										name="title"
										autoComplete="objectTitle"
										helperText={errors.title}
										value={this.state.title}
										error={errors.title ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>
								<Grid item md={6} xs={12}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="address"
										label="Address"
										name="address"
										autoComplete="address"
										helperText={errors.address}
										value={this.state.address}
										error={errors.address ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>
							</Grid>
					<Grid container spacing={4} direction="row-reverse" justify="space-between">
					{/* <Grid container spacing={4} direction="row-reverse"></Grid> */}

					{/* <Grid container item md={6} xs={12} spacing={0}> */}
						<Grid container item md={6} xs={12}>
							<Grid item xs={12}>
								<YandexMap address={this.state.address} handleAddressChange={this.handleAddressChange} />
							</Grid> 
						</Grid> 
					{/* </Grid> */}
					
						<Grid container item md={6} xs={12} spacing={2} style={{padding: 0, margin: 0}}>
						
							<Grid container item xs={12} spacing={2} style={{padding: 0, width: '100%', margin: 0,}}>
								<Grid item xs={6} style={{padding: 16}}>
										<FormControl variant="outlined" required className={classes.formControl}>
										<InputLabel id="listingType-label">Listing Type</InputLabel>
										<Select
										//variant="outlined"
										labelId="listingType-label"
										id="listingType"
										name="listingType"
										required
										fullWidth
										value={this.state.listingType}
										onChange={this.handleChange}
										label="Listing Type"
										error={errors.listingType ? true : false}
										>
										<MenuItem value="">
											<em>----</em>
										</MenuItem>
										<MenuItem value={'apartments'}>Apartment</MenuItem>
										<MenuItem value={'houses'}>House</MenuItem>
										<MenuItem value={'lots'}>Lot</MenuItem>
										<MenuItem value={'commercial'}>Commercial</MenuItem>
										</Select>
										<FormHelperText >{errors.listingType}</FormHelperText>
										</FormControl>
									
							</Grid>
							<Grid item xs={6} style={{padding: 16}}>
									{/* <TextField
										variant="outlined"
										required
										fullWidth
										id="price"
										label="Price"
										name="price"
										autoComplete="price"
										helperText={errors.price}
										value={this.state.price}
										error={errors.price ? true : false}
										onChange={this.handleChange}
										startAdornment={<InputAdornment position="start">$</InputAdornment>}
									/> */}
									<FormControl fullWidth variant="outlined" required className={classes.formControl}>
          <InputLabel htmlFor="sprice">Price</InputLabel>
          <OutlinedInput
		  required
		  fullWidth
		  autoComplete="price"
            id="price"
			name="price"
			type="number"
			error={errors.price ? true : false}
            value={this.state.price}
            onChange={this.handleChange}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
			labelWidth={60}
          /><FormHelperText >{errors.price}</FormHelperText>
        </FormControl>
							</Grid>
							</Grid>
						

			<Grid container item xs={12} spacing={2} style={{margin:0, padding:0}}>
						<Grid item xs={4} style={{padding: 16}}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="area"
										label="Area m²"
										name="area"
										autoComplete="area"
										helperText={errors.area}
										value={this.state.area}
										error={errors.area ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>

							<Grid item xs={4} style={{padding: 16}}>
							<FormControl variant="outlined" className={classes.formControl}>
         <InputLabel id="bedrooms-label">Rooms</InputLabel>
        <Select
		variant="outlined"
          labelId="bedrooms-label"
          id="bedrooms"
		  label="Rooms"
		  name="bedrooms"
		  required
		  fullWidth
          value={this.state.bedrooms}
          onChange={this.handleChange}
		  error={errors.bedrooms ? true : false}
        >
          <MenuItem value="">
            <em>----</em>
          </MenuItem>
          <MenuItem value={'1'}>1</MenuItem>
          <MenuItem value={'2'}>2</MenuItem>
          <MenuItem value={'3'}>3</MenuItem>
		  <MenuItem value={'4'}>4</MenuItem>
		  <MenuItem value={'5'}>5</MenuItem>
        </Select><FormHelperText>{errors.bedrooms}</FormHelperText>
      </FormControl></Grid>
	  <Grid item xs={4} style={{padding: 16}}>
	<FormControl variant="outlined" className={classes.formControl}>
         <InputLabel id="floor-label">Floor</InputLabel>
        <Select
		variant="outlined"
          labelId="floor-label"
          id="floor"
		  label="Floor"
		  name="floor"
		  required
		  fullWidth
          value={this.state.floor}
          onChange={this.handleChange}
		  error={errors.floor ? true : false}
        >
          <MenuItem value="">
            <em>----</em>
          </MenuItem>
          <MenuItem value={'1'}>1</MenuItem>
          <MenuItem value={'2'}>2</MenuItem>
          <MenuItem value={'3'}>3</MenuItem>
		  <MenuItem value={'4'}>4</MenuItem>
		  <MenuItem value={'5'}>5</MenuItem>
		  <MenuItem value={'6'}>6</MenuItem>
		  <MenuItem value={'7'}>7</MenuItem>
		  <MenuItem value={'8'}>8</MenuItem>
		  <MenuItem value={'9'}>9</MenuItem>
		  <MenuItem value={'10'}>10</MenuItem>
        </Select>
		<FormHelperText>{errors.floor}</FormHelperText>
      </FormControl>
								</Grid>
								
						</Grid>

<Grid item xs={12} style={{padding: 16}}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="objectDetails"
										label="Object Details"
										name="body"
										autoComplete="objectDetails"
										multiline
										rows={5}
										rowsMax={5}
										helperText={errors.body}
										error={errors.body ? true : false}
										onChange={this.handleChange}
										value={this.state.body}
									/>
								</Grid>
					</Grid>
								
				</Grid>
								<Grid container spacing={4}>
								
								
								
					

								
								
								
								<Grid item xs={12}>
									<FileUploader objectId = {this.state.objectId} handleSetImages={this.handleSetImages} imagesUrls={this.state.imagesUrls}/>
									</Grid> 
									</Grid>
									
						</form>
						</div>
					</Dialog>
				{/* Main cards view
				TO add filter we should add a proper filter function based on the state filter property */}
					<Grid container spacing={4}>
						{ !this.state.objects.length ? (
							<Grid item xs={12}>
								<Card className={classes.cardLayout} variant="outlined">
								<CardContent className={classes.cardContent}>
							<Typography component="h1" variant="h3" >
								You have no listings yet...Try to add one
							</Typography>
							</CardContent>
							</Card>
							</Grid>
							) :
						this.state.objects.map((object) => (
							
							<Grid key={object.objectId} item xs={12}>
								<Card className={classes.cardLayout} variant="outlined">
									
								{ object.imagesUrls[0] && 
										object.imagesUrls.length > 0 ? <CardMedia
										key={object.imagesUrls[0]}
										className={classes.cardMedia}
										image={`https://firebasestorage.googleapis.com/v0/b/objects-media/o/${object.imagesUrls[0].replace('/', '%2F')}?alt=media`}
										title={object.title} /> : null
									
										} 
										  
									<div className={classes.cardDetails}>
									<CardContent className={classes.cardContent}>
										<Typography variant="h5" component="h2">
											{object.title}
										</Typography>
										<Typography variant="body1" component="p">
											<LocationOnIcon className={classes.inLineIcon} fontSize="small" color="primary"/>{`${object.address}`}
										</Typography>
										<Typography variant="body2" component="p">
											{`${object.body.substring(0, 65)}`}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											{dayjs(object.createdAt).fromNow()}
										</Typography>
										</CardContent>
									</div>
									<div className={classes.cardActionsContainer}>
									<CardActions className={classes.cardActions}>
									<Tooltip title="View" placement="left">
									<IconButton size="medium" color="primary" onClick={() => this.handleViewOpen({ object })} aria-label="view">
        								<LaunchIcon />
      								</IconButton>
									  </Tooltip>
									  <Tooltip title="Edit" placement="left">
									<IconButton size="medium" color="primary" onClick={() => this.handleEditClickOpen({ object })} aria-label="edit">
        								<EditIcon />
      								</IconButton>
									  </Tooltip>
									{/* <IconButton size="medium" className={classes.secondaryDark} onClick={() => this.deleteObjectHandler({ object })} aria-label="delete"> */}
									<Tooltip title="Delete" placement="left">
									<IconButton size="medium" className={classes.secondaryDark} onClick={() => this.handleConfirmDeleteOpen( object.objectId )} aria-label="delete">
        								<DeleteIcon />
      								</IconButton>
									  </Tooltip>
									</CardActions>
									</div>
								</Card>
								<Dialog
							 open={confirmDeleteOpen}
							 onClose={handleConfirmDeleteClose}
							 aria-labelledby="alert-dialog-title"
							 aria-describedby="alert-dialog-description"
						   >
							 <DialogTitle id="alert-dialog-title">{"Delete the listing?"}</DialogTitle>
							 <DialogContent>
							   <DialogContentText id="alert-dialog-description">
								 The listing {object.title} wil be deleted permanently. Do you want to proceed?
							   </DialogContentText>
							 </DialogContent>
							 <DialogActions>
							   <Button onClick={handleConfirmDeleteClose} color="primary">
								 Cancel
							   </Button>
							   <Button onClick={() => this.deleteObjectHandler()} color="secondary" autoFocus>
								 Confirm
							   </Button>
							 </DialogActions>
						   </Dialog>
							</Grid>
						   
						)) }
					</Grid>
					<div>
     
    </div>

					<Dialog
						onClose={handleViewClose}
						aria-labelledby="customized-dialog-title"
						open={viewOpen}
						fullWidth
						classes={{ paperFullWidth: classes.dialogStyle }}
					>
						<DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
							{this.state.title}
						</DialogTitle>
						<DialogContent dividers>
							<TextField
								fullWidth
								id="objectDetails"
								name="body"
								multiline
								readOnly
								rows={1}
								rowsMax={25}
								value={this.state.body}
								InputProps={{
									disableUnderline: false
								}}
							/>
			
							<TextField
								fullWidth
								id="listingType"
								name="listingType"
								multiline
								readOnly
								rows={1}
								rowsMax={25}
								value={this.state.listingType}
								InputProps={{
									disableUnderline: false
								}}
							/>
							<TextField
							fullWidth
							id="price"
							name="price"
							multiline
							readOnly
							rows={1}
							rowsMax={25}
							value={this.state.price}
							InputProps={{
								disableUnderline: true
							}}
						/>
						</DialogContent>
					</Dialog>
				</main>
				</>
			);
		}
	}
}

export default withStyles(styles)(object);