import React from 'react';
import './FaceRecognition.css';
import Face from './Face';

const FaceRecognition = ({ imageUrl, faces }) => {
  const facesArray = faces.map((face, index)=>{
       return  <Face key = {index} box = {face} />
  });
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto'/>
       <div>{facesArray}</div>
      </div>
    </div>
  );
}

export default FaceRecognition;