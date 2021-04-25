const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const cors = require('cors');
/* const corsOptions ={
    origin: true
} */
app.use(cors());

// Users API
const { loginUser, signUpUser, uploadProfilePhoto, getUserDetails, updateUserDetails} = require('./api/users');
app.post('/api/login', loginUser);
app.post('/api/signup', signUpUser);
app.post('/api/user/image', auth, uploadProfilePhoto);
app.get('/api/user', auth, getUserDetails);
app.post('/api/user', auth, updateUserDetails);


// Objects API
const { getAllObjects, postOneObject, deleteOneObject, editOneObject, uploadObjectPhoto } = require('./api/objects');

app.get('/api/objects', auth, getAllObjects);
app.post('/api/object', auth, postOneObject);
app.post('/api/object/:objectId/images', auth, uploadObjectPhoto);
app.delete('/api/object/:objectId', auth, deleteOneObject);
app.put('/api/object/:objectId', auth, editOneObject);



exports.api = functions.https.onRequest(app);

