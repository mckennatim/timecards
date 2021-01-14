import React from 'react'// eslint-disable-line no-unused-vars
import {router} from '../app'
import {App} from './App'
import {TimeCardJar} from './TimeCardJar'
import {Nav} from './Nav'
import {Dog} from './Dog'
import {Registered} from './Registered'
import {pStyle} from '../styles'
import {loadGithubFollowers} from '../actions/test';// eslint-disable-line no-unused-vars
// import { render } from '../utilities/wfuncs';
import {mapClass2Element} from '../hoc/mapClass2Element'

const About = () =>{
  const style = {
    ...pStyle, outer: {...pStyle.outer, background: '#99CCCC'}
  }
  return(
    <div style={style.outer}>
      <h3> ReRoo Help</h3>

    </div>
  )
}

class Cat extends React.Component{
  cat='mabibi'
  render(){
    return(
      <h3> Cat is {this.cat}</h3>
    )
  }
}
Cat = mapClass2Element(Cat)

const Home = () =>{
  function goprod(){
    console.log("in home goprod")
    router.navigate('/about');
  }
    const style = {
    ...pStyle, outer: {...pStyle.outer, background: '#CC66CC'}
  }
  return(
    <div style={style.outer}>
      <h3> Home </h3>
      <button id="but" onClick={goprod}>goto about</button>
    </div>
  )
}
//const multi=[] //multi delared but empty defaults to single panel

const multi =[{
    pri:'About', 
    mul:[
      ['About', 'Cat'],
      ['About', 'Cat', 'Home'],
      ['About','Cat', 'About', 'Home']
    ]
  },{
    pri:'Cat',
    mul:[
      ['Cat', 'About']
    ]
  }]

//['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop']
const panes= [1,1,2,2,3,3,4]

export {TimeCardJar, Cat, About, Home, Dog, App, Nav, Registered, multi, panes}
