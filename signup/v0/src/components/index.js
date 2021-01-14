import React from 'react'// eslint-disable-line no-unused-vars
import {router} from '../app'
import {App} from './App'
import {Active} from './Active'
import {Blank} from './Blank.jsx'
import {AddCompany} from './AddCompany.jsx'
import {GetData} from './GetData.jsx'
import {Splash} from './Splash.jsx'
import {About} from './About.jsx'
import {AboutDemo} from './AboutDemo.jsx'
import {UrApps} from './UrApps.jsx'
import {Company} from './Company.jsx'
import {Nav} from './Nav.jsx'
import {Registered} from './Registered.jsx'
import{Help} from '../../../../common/v0/src/components/Help.jsx'
import {pStyle} from '../styles'
import {loadGithubFollowers} from '../actions/test'// eslint-disable-line no-unused-vars
// import {mapClass2Element} from '../hoc/mapClass2Element'

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
  {pri:'AboutDemo', mul:[
    ['AboutDemo', 'Splash'],
    ['AboutDemo', 'Splash', 'Help'],
    ['AboutDemo','Splash', 'Help', 'Home']
  ]},
  {pri:'About', mul:[
    ['About', 'Splash'],
    ['About', 'Splash', 'AboutDemo'],
    ['About','Splash', 'AboutDemo', 'Home']
  ]},
  {pri:'Help', mul:[
    ['Help', 'Splash'],
    ['Help', 'Splash', 'About'],
    ['Help','Splash', 'About', 'AboutDemo']
  ]},
  {pri:'UrApps', mul:[
    ['UrApps', 'Splash'],
    ['UrApps', 'Splash', 'Help'],
    ['UrApps', 'Splash', 'Help']
  ]}, 
  {pri:'Company', mul:[
    ['Company', 'Help'],
    ['Company', 'Help'],
    ['Company', 'Help']
  ]},
  ]

//['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop']
const panes= [1,1,2,2,3,3,4]

export {Active, UrApps, Blank, GetData, Splash, Company, About, AboutDemo, Home, App, Nav, Registered,  AddCompany, Help, multi, panes}

