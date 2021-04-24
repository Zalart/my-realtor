import React from 'react';
import {FilePond, File, registerPlugin} from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';

import 'filepond/dist/filepond.min.css';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation, FilePondPluginFilePoster);


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
        const newImageUrl = imageUrl.replace('/', '%2F');
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

/* componentDidUpdate(){
  this.props.handleSetImages(this.state.files);
} */

/* handleInit() {
  console.log('FilePond instance has initialised', this.pond);
} */

    //const [files, setFiles] = useState([]);
    render() {
      console.log(this.state.files);
    return (
        <>
<FilePond
ref={ref => this.pond = ref}
files={this.state.files}
//oninit={() => this.handleInit() }
allowMultiple={true}
allowReorder={true}
dropOnPage
status={(st)=> (console.log(st))}
allowFilePoster={true}


 onprocessfile={(file) => {
  this.props.handleSetImages(this.state.files);
}}  
server={{
            process: {
              url: `http://localhost:5000/realtor-s-routines/us-central1/api/object/${this.props.objectId}/images`,
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
      console.log('files were reordered')
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