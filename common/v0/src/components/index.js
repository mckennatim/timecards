import React from 'react'// eslint-disable-line no-unused-vars
import {router} from '../app'
import {App} from './App'
import {Active} from './Active'
import {Nav} from './Nav'
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
  {pri:'About', mul:[
    ['About', 'Products'],
    ['About', 'Products', 'Home'],
    ['About','Products', 'About', 'Home']
    ]},
  {pri:'Jobs', mul:[
    ['Jobs', 'SortJobs'],
    ['Jobs', 'SortJobs', 'Home'],
    ['Jobs', 'SortJobs', 'Home', 'About']
    ]},
  {pri:'AddJob', mul:[
    ['Jobs', 'AddJob'],
    ['Jobs', 'AddJob', 'Home'],
    ]},    
  {pri:'SortJobs', mul:[
    ['Jobs', 'SortJobs'],
    ['Jobs', 'SortJobs', 'AddJob'],
    ['Jobs','SortJobs', 'About', 'AddJob']
    ]},  
  {pri:'Products', mul:[
    ['Products', 'About'],
    ['Products', 'Home', 'About']
    ]},
  {pri:'Cat', mul:[
    ['Cat', 'About']
    ]}
  ]

//['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop']
const panes= [1,1,2,2,3,3,4]

export {Active, Cat, About, Home, App, Nav, multi, panes}
