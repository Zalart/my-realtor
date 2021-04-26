const config = require('../util/config');
const { response } = require('express');
const { db, admin } = require('../util/admin');
const firebase = require('firebase');
const { v4: uuidv4 } = require('uuid');

exports.getAllObjects = (request, response) => {
	db
		.collection('objects')
		.where('userId', '==', request.user.uid)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let objects = [];
			data.forEach((doc) => {
				objects.push({
                    objectId: doc.id,
					createdAt: doc.data().createdAt,

					listingType: doc.data().listingType,
                    title: doc.data().title,
					address: doc.data().address,
					body: doc.data().body,
					price: doc.data().price,
					area: doc.data().area,
					bedrooms: doc.data().bedrooms,
					floor: doc.data().floor,
					imagesUrls: doc.data().imagesUrls
					
				});
			});
			return response.json(objects);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};


exports.postOneObject = (request, response) => {
	     
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Title can not be empty' });
    }

	if(request.body.address.trim() === '') {
        return response.status(400).json({ address: 'Address can not be empty' });
    }

 	if (request.body.listingType.trim() === '') {
		return response.status(400).json({ listingType: 'You should choose a listing type' });
    }

	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Please, provide some details' });
    }

 	if(request.body.price.trim() === '') {
        return response.status(400).json({ price: 'Price can not be empty' });
    }

	if(request.body.area.trim() === '') {
        return response.status(400).json({ area: 'Area can not be empty' });
    } 

	
    
    const newObject = {
		userId: request.user.uid,
		createdAt: new Date().toISOString(),
		listingType: request.body.listingType,
        title: request.body.title,
		address: request.body.address,
        body: request.body.body,
 		price: request.body.price,
		area: request.body.area,
		bedrooms: request.body.bedrooms,
		floor: request.body.floor,
		imagesUrls: request.body.imagesUrls

    }
    db
        .collection('objects')
        .add(newObject)
        .then((doc)=>{
            const responseObject = newObject;
            responseObject.id = doc.id;
			console.log(responseObject.id);
            return response.json(responseObject);
			
        })
        .catch((err) => {
			response.status(500).json({ error: 'Nah! Something went wrong' });
			console.error(err);
		});
};

exports.editOneObject = (request, response) => {
	if (request.body.createdAt || request.body.userId) {
		return response.status(403).json({message: "You can't edit object id or object creation timestamp"})
	}
	//можно задавать коллекцию явно, а можно в пути ref к doc (как в deleteOneObject() =>>>	const object = db.doc(`objects/${request.params.objectId}`); )
	let object = db.collection("objects").doc(`${request.params.objectId}`)
	
	// we can try verify the filds data, like when we submit new object
	
	object.update(request.body)
	.then(()=> {
		response.json({message: 'Updated successfully'});
	})
	.catch((err) => {
		console.error(err);
		return response.status(500).json({ 
				error: err.code 
		});
	});
	};


exports.uploadObjectPhoto = (request, response) => {
    const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');
	const busboy = new BusBoy({ headers: request.headers });
	let imageID = uuidv4();
	let imageFileName;
	let imageToBeUploaded = {};
	let tempFilePath='';
	
/* 	busboy.on('field', (fieldname, val) => {
	
		console.log(`THis is on field. ${fieldname}: ${val}.`);
		
		fields[fieldname] = val;
		
		//console.log('this is', fields);
	  });  */


	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		console.log('this is in on file');
		
		if (mimetype !== 'image/png' && mimetype !== 'image/jpeg' && mimetype !== 'image/webp' && mimetype !== 'image/gif') {
			return response.status(400).json({ error: `Wrong Object file type submited: ${mimetype}` });
		}
		const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${imageID}.${imageExtension}`;
		const filePath = path.join(os.tmpdir(), imageFileName);
        
		imageToBeUploaded = { filePath, mimetype };
		file.pipe(fs.createWriteStream(filePath));
    });

	busboy.on('finish', () => {
       /*  db.doc(`/objects/${request.params.objectId}`).get()
        .then((userData)=>{ 
             if (userData.data().imageUrl) {
                deleteImage(userData.data().imageUrl, config.objectsStorageBucket) 
              }
        }) 
        .then(()=>{ */
			 tempFilePath = path.join(request.params.objectId, imageFileName);
		admin
			.storage()
			.bucket(config.objectsStorageBucket)
			.upload(imageToBeUploaded.filePath, {
                destination: tempFilePath,
				resumable: false,
				metadata: {
				contentType: imageToBeUploaded.mimetype
				}
			})
        //})
			
/* 	// Здесь будем записывать названия файлов в БД

.then(() => {
				//const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.profilesStorageBucket}/o/${imageFileName}?alt=media`;
                
				return db.doc(`/objects/${request.params.objectId}`).get()})
			.then((imageUrlData) => {
				console.log("URL in base", imageUrlData.data().imageUrl);
				const newImageUrl = imageFileName;
                return db.doc(`/objects/${request.params.objectId}`).update({
					imageUrl: newImageUrl
				});
			}) */
			.then(() => {
				//return response.json({ imageId: imageFileName});
				response.type('text/plain');
				return response.send(tempFilePath);
			})
			.catch((error) => {
				console.error(error);
				return response.status(500).json({ error: error.code });
			});
	});
	busboy.end(request.rawBody);
};

exports.deleteOneObject = (request, response) => {

	//получаем ссылку на объект, который хотим удалить
	const object = db.doc(`objects/${request.params.objectId}`);
	object.get()
	.then((doc)=> {
		if (!doc.exists) {
			return response.status(404).json({error: "Object not found"})
		} 
		if (doc.data().userId !== request.user.uid) {
			return response.status(403).json({error: "Authentication needed"})
		}
		return object.delete();
	})
	.then(()=>{
		response.json({message:"Object deleted successfully"})
	})
	.catch((err)=>{
		console.error(err);
		return response.status(500).json({error: err.code});
	})

};
