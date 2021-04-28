import React from 'react';
import {FilePond, File, registerPlugin} from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import logo from '../assets/logo-white.svg';

import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

import '../css/style.css';


import 'filepond/dist/filepond.min.css';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageCrop, FilePondPluginImageResize, FilePondPluginImageExifOrientation, FilePondPluginFilePoster, FilePondPluginFileMetadata, FilePondPluginImageTransform);



class FileUploader extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    files: []
  }
}

componentDidMount() {
  //if (!this.state.files.length) {
    this.setState({
      files: this.props.imagesUrls.map((imageUrl)=> {
        
        const newImageUrl =  imageUrl.replace('/', '%2F');
        return ({
        source: `${imageUrl}`,
        options: {
           type: 'local', 
          metadata: {
            poster: `https://firebasestorage.googleapis.com/v0/b/objects-media/o/${newImageUrl}?alt=media`,
        }
      } 
      })})
    })
 // }
}




    render() {
      
      const fileMetadataObject = {
        /* The `markup` property is how we define our watermark */
        markup: [
      /*     We'll draw a 60ox rectangle aligned with
          the bottom of the image */
          [
            "rect",
            {
              left: 0,
              right: 0,
              bottom: "350px",
              height: "300px",
              width: "1500px",
              backgroundColor: "rgba(0,0,0,.3)",
            },
          ],
          [
            "image",
            {
              right: "550px",
              bottom: "350px",
              width: "400px",
              height: "300px",
              src: logo,
              fit: "contain",
            },
          ],
        ]
      }
    return (
        <>
<FilePond
ref={ref => this.pond = ref}
files={this.state.files}

allowMultiple={true}
allowReorder={true}
filePosterHeight={100}
imagePreviewHeight={100}
dropOnPage

onpreparefile = {(file, output) => {
  const result = new Image();
  result.src = URL.createObjectURL(output);
  console.log(result.src)
}}
status={(st)=> (console.log(st))}
allowFilePoster={true}
allowFileMetadata = {true}
allowImageCrop={true} 
imageCropAspectRatio={'3:2'} 
imageResizeTargetHeight={'1000px'}
imageResizeTargetWidth={'1500px'}
allowImageResize = {true}
allowImageTransform={true}

fileMetadataObject = {fileMetadataObject}


 onprocessfile={(file) => {
  this.props.handleSetImages(this.state.files);
}}  
server={{
            process: {
              url: `/api/object/${this.props.objectId}/images`,
               headers: {
                 'Authorization': localStorage.getItem('AuthToken'),
               },
             /*   ondata: (formData) => {
                   
               formData.append('imageId', files[i].id);
               i++;
               return formData;
               }, */
                onload: (response) =>  {
            
                 return response;
                 
                },
            
            },
            
            load: `https://firebasestorage.googleapis.com/v0/b/objects-media/o/`
            

           }}
/* //Onprocess doesn't work so far when there are local images
           onprocessfiles={() => {
            console.log('files were processed');
          // Set current file objects to this.state.
          this.props.handleSetImages(this.state.files);
          }} 
            */
    onreorderfiles={(fileItems, origin, target) => {
      // Set current file objects to this.state
      this.setState({
          files: fileItems.map(fileItem => fileItem)
      });
      this.props.handleSetImages(this.state.files);
      console.log(this.state.files.map((fileOne)=>(fileOne.serverId)))
    }}
name="files"
credits={false}

onupdatefiles={(fileItems) => {
  // Set current file objects to this.state
  this.setState({
      files: fileItems.map(fileItem => fileItem)
  });
  this.props.handleSetImages(this.state.files);
  
}}

/>        </>
        
    )
  }
  
}
export default FileUploader;
