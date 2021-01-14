import React from 'react'// eslint-disable-line no-unused-vars
import {router} from '../app'
import {App} from './App'
import {Tcard} from './Tcard'
import {Nav} from './Nav'
import {Help} from '../../../../common/v0/src/components/Help.jsx'
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
      <h3> Tcard</h3>
      <p>The process: punch in => punch out (repeat)</p>
      <p>If there is a <button>toggle job</button> button then you need to select a job and assign some hours to it </p>
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

const multi =[
  {pri:'Help', mul:[
    ['Help', 'Tcard'],
    ['Help', 'Tcard'],
    ['Help','Tcard',]
  ]},
  {pri:'Tcard', mul:[
    ['Tcard', 'Help'],
    ['Tcard', 'Help'],
    ['Tcard','Help',]
  ]},
  {pri:'Cat', mul:[
    ['Cat', 'Help']
  ]}
]

//['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop']
const panes= [1,1,2,2,3,3,4]

export {Tcard, Help, Cat, About, Home, App, Nav, multi, panes}
