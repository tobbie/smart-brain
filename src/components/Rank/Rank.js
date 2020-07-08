import React from 'react';
import {httpRequest} from '../../util/httpClient'
import httpMethods from '../../util/httpMethods'

class Rank extends React.Component{
// = ({ name, entries }) => {
  constructor(){
    super();
    this.state = {
      emoji: ''
    }
  }
  
  componentDidMount() {
    this.generateEmoji(this.props.entries);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState)
    console.log(prevProps)

    if(prevProps.entries === this.props.entries)
    {
      return null
    }
    this.generateEmoji(this.props.entries)
  }
 
  generateEmoji = (entries)=>{
    httpRequest(`https://gezdc1smsb.execute-api.eu-west-2.amazonaws.com/prod/rank?rank=${entries}`,
                httpMethods.GET)
                .then(data  => this.setState({emoji : data.input}))
                .catch(err => console.log(err))
  }
  render(){
  return (
    <div>
      <div className='white f3'>
        {`${this.props.name}, your current entry count is...`}
      </div>
      <div className='white f1'>
        {this.props.entries}
      </div>
      <div className='white f3'>
        {`Rank Badge: ${this.state.emoji}`}
      </div>
    </div>
   );
  }
}

export default Rank;