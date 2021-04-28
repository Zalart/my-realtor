import React, { Component, useState, useRef } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core';
//import Geocode from "react-geocode";


const initialState = {
    center: [43.686284, 21.837774],
    zoom: 16,
   controls: [],
   behaviors: ["disable('scrollZoom')"],

}


const YandexMap = ({address, handleAddressChange}) => {
    const ymapRef = useRef(null);

const [state, setState] = useState(initialState);

const geoCode = (ymaps) => {
    if (!address) {
        ymaps.geolocation.get().then((result)=> {
            console.log("found geolocation")
            setState({ ...state, center: result.geoObjects.get(0).geometry.getCoordinates() })
            
        }, function (e) {
            // Если местоположение невозможно получить, то просто создаем карту.
           setState({
            center: [43.686284, 21.837774],
            zoom: 16,


        })
        });
    } else {
   return ymaps.geocode(address)
      .then(result => setState({ ...state, center: result.geoObjects.get(0).geometry.getCoordinates() }))
    }
    }

const reverseGeoCode = (e) => {
    ymapRef.current.geocode(e.get('target').geometry.getCoordinates())
    .then((res)=> {
        const firstGeoObject = res.geoObjects.get(0);

/*         const newAddress = [
            firstGeoObject.getLocalities().length
              ? firstGeoObject.getLocalities()
              : firstGeoObject.getAdministrativeAreas(),
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
          ]
            .filter(Boolean)
            .join(", "); */
            handleAddressChange(firstGeoObject.getAddressLine())
    })
   
};

return (
    <YMaps query={{ apikey: '0892d36b-db54-468d-9f18-b1e59fbb4440', lang: 'en', load: 'package.full', ns: 'ymaps' }}>

<Map state={state} 

    onLoad = {ymapsInstance => {
    geoCode(ymapsInstance);
    ymapRef.current = ymapsInstance;
 }} 
    lang={'en_US'}
    
    instanceRef={ymapRef}

    modules={['geocode']} 
    width={'100%'}
    height={314} >

    {
     state.center && <Placemark geometry={state.center} options={{draggable: true}} 
     onDragEnd = {e => reverseGeoCode(e) } />    
            }
</Map>

    </YMaps>
)
}

export default YandexMap;

