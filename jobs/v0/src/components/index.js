import React from 'react'// eslint-disable-line no-unused-vars
import {router} from '../app'
import {App} from './App'
import {Active} from './Active'
import {Jobs} from './Jobs'
import {AddJob} from './AddJob'
import {SortJobs} from './SortJobs'
import {Nav} from './Nav'
import {Help} from '../../../../common/v0/src/components/Help.jsx'
// import {Dog} from './Dog'
// import {Products} from './Products'
// import {Registered} from './Registered'
import {pStyle} from '../styles'
import {loadGithubFollowers} from '../actions/test';
//import { render } from '../utilities/wfuncs';
import {mapClass2Element} from '../hoc/mapClass2Element'

const About = (props) =>{
  const { isLoading, followers} = props.responsive;
  const style = {
    ...pStyle, outer: {...pStyle.outer, background: '#99CCCC'}
  }
  function handleGetFollowers(){
    console.log("in get github followers")
    loadGithubFollowers('mckennatim')
  }
  function renderFollowers(followers) {
    if (!followers) return;
    return (
      <ul>{ followers.map((follower, index) => <li key={index}>{follower}</li>) }</ul>
    );
  }
  return(
    <div style={style.outer}>
      <h3> About</h3>
      <button id="but" onClick={handleGetFollowers}>get github followers</button>
      { isLoading ?
        <p>Loading...</p> :
        "dog" }
      { renderFollowers(followers) }
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
  {pri:'Jobs', mul:[
    ['Jobs', 'Help'],
    ['Jobs', 'Help', 'SortJobs'],
    ['Jobs', 'Help', 'SortJobs', 'AddJob']
    ]},
  {pri:'AddJob', mul:[
    ['AddJob', 'Help'],
    ['AddJob', 'Help', 'Jobs'],
    ]},    
  {pri:'SortJobs', mul:[
    ['SortJobs', 'Help'],
    ['SortJobs', 'Help', 'Jobs'],
    ['SortJobs', 'Help', 'Jobs',  'AddJob']
    ]}
  ]

//['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop']
const panes= [1,1,2,2,3,3,4]

export {Active, Jobs, AddJob, SortJobs, Cat, About,Home, Help, App, Nav, multi, panes}
