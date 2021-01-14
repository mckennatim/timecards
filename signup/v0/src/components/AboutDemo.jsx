import React from 'react'// eslint-disable-line no-unused-vars
//import {mapClass2Element} from '../hoc/mapClass2Element'
import {ls, cfg} from '../utilities/getCfg'



const AboutDemo = () =>{
  if(ls.getItem()){
    //location='#/registered'
  }
  return(
    <div style={style.he}>
      <h3> Demo</h3>
      <p>The Demo System will run for 20 minutes and then get reset. You can mess it up as much as you want. </p> 
        <br/><p>
        In order to run the Demo System you first you will need to register via Facebook, Twitter, Google Github or your email address. This gives us some assurance you are who you say you are. They will provide us with your email. That will be your id.
        </p>
        <br/><p>
         That id will set you up with the highest level of access, the 'partner' level. (We will collect your email address and might use it a couple of times to try to lure you back to sign up for real.)</p><br/>
      <p>As 'partner' in company 'demoXX' you are ready to create timecards,calculate payroll and track job costs.</p><br/>
      <p>Ready? Click 'register'</p><br/>
      <a style={style.a} href={cfg.url.authqry}>register</a>
    </div>
  )
}

export{AboutDemo}

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