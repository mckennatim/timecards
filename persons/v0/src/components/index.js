import React from 'react'// eslint-disable-line no-unused-vars
import {router} from '../app'
import {App} from './App'
import {Persons} from './Persons.jsx'
import {AddPerson} from './AddPerson.jsx'
import {Nav} from './Nav.jsx'
import {Help} from '../../../../common/v0/src/components/Help.jsx'
import {pStyle} from '../styles'
import {loadGithubFollowers} from '../actions/test';
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
    ['About', 'Help'],
    ['About', 'Help', 'Home'],
    ['About','Help', 'About', 'Home']
    ]
  },
  {pri:'Persons', mul:[
    ['Persons', 'Help'],
    ['Persons', 'Help', 'AddPerson'],
    ['Persons','Help', 'AddPerson', 'Home']
    ]
  },
  {pri:'AddPerson', mul:[
    ['AddPerson', 'Help'],
    ['AddPerson', 'Help', 'Persons'],
    ['AddPerson','Help', 'Persons', 'Home']
    ]
  },
  {pri:'Cat', mul:[
    ['Cat', 'About']
    ]}
  ]

//['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop']
const panes= [1,1,2,2,3,3,4]

export {Persons, AddPerson, Cat, About, Home, App, Help, Nav, multi, panes}
