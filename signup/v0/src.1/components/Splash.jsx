import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {ls, cfg} from '../utilities/getCfg'
class Splash extends React.Component{
  active='mabibi'
  state={isreg:false}
  componentDidMount(){
    this.getActive()
  }  
  getActive(){
    console.log('dog')
    console.log('ls.getItem(): ', ls.getItem())
    if(ls.getItem()){
      this.setState({isreg:true})
    }
  }

  gotoUrApps=()=>{
    location='#urapps'
  }
  
  goSignUp=()=>{
    location='#about'
  }

  goRegister=()=>{
    location=cfg.url.authqry
  }

  renderGoTo=()=>{
    if(this.state.isreg){
      return(
        <button onClick={this.gotoUrApps}>this machine is registerd,go to your apps</button>
      )
    }else{
      return(
        <div>
        <button onClick={this.goSignUp}>be a really early beta butta tester</button><br/><br/>
        <button onClick={this.goRegister}>already registered, just not on this machine</button><br/>

        </div>
     )      
    }
  }

  render(){
    const rendergoto = this.renderGoTo()

    return(
      <div style={style.outer}>
        <h3> Splash is {this.active}</h3>
        <p>Typical JS snobbery in these comments. Everyone knows a huge proportion of JavaScript on the web is written on jQuery, so it is perfectly acceptable to provide a solution here for jQuery if it already has a built-in method for testing objects. It's likely that thousands of developers looking for help will find this answer helpful. Nobody said it's the only way to do it. I notice how nobody acts all elitist about the guy who posted a solution to use underscore.js</p>

        <h2>timecards splash</h2>
        <span>Landing page for an incredible application that will change the way you run your business. Beta testing will start soon.</span><br/>
        
        {rendergoto}
      </div>
    )
  }
}
Splash = mapClass2Element(Splash)

export {Splash}

const style = {
  outer:{
    overflow:'hidden',
    padding: '4px',
    margin: '2px 10px 10px 10px'
  }
}