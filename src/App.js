import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal'
import Profile from './components/Profile/Profile'
import { httpRequest, httpHeaders } from './util/httpClient'
import httpMethods from './util/httpMethods'

import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  faces : [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen:false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount(){
    const token = window.sessionStorage.getItem('token');
    if(token){
      httpRequest(process.env.REACT_APP_API_URL +'/signin', httpMethods.POST, httpHeaders(token))
        .then((data) => {
          if(data && data.id){
             httpRequest(process.env.REACT_APP_API_URL +`/profile/${data.id}`, httpMethods.GET, httpHeaders(token))
             .then(user => {
                if(user){ 
                  this.loadUser(user)
                  this.onRouteChange('home')
                }
          })
        }
      }).catch(error => console.log(error))
    }
   
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
      age: data.age,
      pet: data.pet
    }})
  }

  

  calculateLocationOfFaces = (data) => {
    let clarifaiFaces  = [];
    clarifaiFaces =  data.outputs[0].data.regions;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    let faces = clarifaiFaces.map(this.buildFaceList(width, height));
    console.log(faces);
    return faces;
    
  }
  
  buildFaceList = (width, height) =>{
    
    return function(faceRegion){
      const face = faceRegion.region_info.bounding_box;
     
      return{
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }

    }
   
  }

  

  displayFaces = (faces) => {
    this.setState({faces: faces});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    const token = window.sessionStorage.getItem('token')
      
      httpRequest(process.env.REACT_APP_API_URL +'/imageurl', httpMethods.POST, httpHeaders(token),
       {input : this.state.input})
      .then(response => {
        if (response) {
          httpRequest(process.env.REACT_APP_API_URL +'/image', httpMethods.PUT, httpHeaders(token), {id: this.state.user.id})
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(err => console.log(err))
        }
        this.displayFaces(this.calculateLocationOfFaces(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
     window.sessionStorage.removeItem('token');
     return this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render() {
    const { isSignedIn, imageUrl, route, faces, isProfileOpen, user } = this.state;
    
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}
        toggleModal={this.toggleModal} />
        { isProfileOpen && 
           <Modal>
                <Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleModal}  user={user} loadUser = {this.loadUser}/>
            </Modal>
        }
        { route === 'home'
          ? <div>
              <Logo />
              
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imageUrl={imageUrl} faces = {faces} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
