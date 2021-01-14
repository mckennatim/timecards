import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'

class Active extends React.Component{
  active='mabibi'
  componentDidMount=()=>{
    this.getActive()
  }  
  getActive=()=>{
    console.log('dog')
  }
  render=()=>{
    return(
      <div style={style.he}>
        <h3> Active is {this.active}</h3>
      </div>
    )
  }
}
Active = mapClass2Element(Active)

export {Active}

const style = {
  he:{
    overflow:'hidden',
    margin: '2px 10px 10px 10px',
    padding: '4px',
    background: '#C4A265'
  }
}