import React from 'react'// eslint-disable-line no-unused-vars
//import {mapClass2Element} from '../hoc/mapClass2Element'
import {ls, cfg} from '../utilities/getCfg'



const About = () =>{

  if(ls.getItem()){
    //location='#/registered'
  }
  return(
    <div style={style.he}>
      <p>If you don't need to read below just <a style={style.a} href={cfg.url.authqry}>register</a></p>
      <h3> How to sign up</h3>
      <p>It is pretty easy to set up JobCost-PayTime to work for your business. First you will register via Facebook, Twitter, Google, Github or your email address. This gives us some assurance you are who you say you are. They will provide us with your email. That will be your id. </p><br/>
      <p>After that you will select a unique id for your business. Your email id and company id will be used to set you up as a beta tester with you in the role as 'partner' in your business. Partners is the highest level of access. </p><br/>
      <p>Beta testers will have access to the apps for at least 30 days but if you give us feedback your free access will be extended. Any data you enter into the system is yours and you will be able to download it whenever you want, even if your access expires.</p><br/>
      <p>With email id and company id your company will be set up on JobCost-PayTime. Next you will add some information AboutDemo your company: the state you are located in, your overtime policy and a few other things</p><br/>
      <p>Now you can enter some employees, starting with yourself, assigning them to roles that determine their level of access. OK, you are ready to create timecards,calculate payroll and track job costs.</p><br/>
      <p>Ready? Click 'register'</p><br/>
      <a style={style.a} href={cfg.url.authqry}>register</a>
    </div>

  )
}

export{About}

const style = {
  he:{
    overflow:'hidden',
    padding: '4px',
    margin: '2px 10px 10px 10px',
    
    yw:{
      padding: '1px 1px 10px 1px'
    },
    yr:{
      width: '45px',
      background: 'silver'
    },
    wk:{
      width:'36px',
      background: 'whitesmoke'
    },
    img:{
      
      float:'right',
      width: '30px'
    },
    act:{
      float: 'right'
    },
    get:{
      float:'left'
    },
    but:{
      ac:{
        margin: '4px',
        padding: '4px'
      },
      ia:{
        margin: '4px',
        padding: '4px'
      },
      al:{
        margin: '4px',
        padding: '4px'
      }
    },
  }
}