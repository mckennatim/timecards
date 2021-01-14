import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {pStyle} from '../styles'
const style = {
  ...pStyle, outer: {...pStyle.outer, background: '#C4A265'}
}
pStyle.outer.background='#C4A265'

class Active extends React.Component{
  active='mabibi'
  componentDidMount(){
    this.getActive()
  }  
  getActive(){
    console.log('dog')
  }
  render(){
    return(
      <div style={style.outer}>
        <h3> Active is {this.active}</h3>
      </div>
    )
  }
}
Active = mapClass2Element(Active)

export {Active}
