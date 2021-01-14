import React from 'react' // eslint-disable-line no-unused-vars
import {cfg} from '../utilities/getCfg'
import { setClearJc, setUpdate } from '../actions/jobacts';



const Nav = () =>{

  const setU=()=>{
    setClearJc({clearjc:true}),
    setUpdate({update:false})
  }
  return (
    <div style={style} id="menu"> 
      <ul>
        <li style={style.li}><a style={style.a} href={cfg.url.authqry}>register</a></li>
        <li style={style.li}><a style={style.a} href="about" data-navigo>about</a></li>
        <li style={style.li}><a style={style.a} href="jobs" data-navigo>jobs</a></li>
        <li style={style.li}><a style={style.a} href="sortjobs" data-navigo>sortjobs</a></li>
        <li style={style.li}><a style={style.a} href="addjob"  onClick={setU}data-navigo>admojob</a></li>
      </ul>
    </div>
  )
}
export {Nav}

let style={
  background: 'white',
  li:{
    display: 'inline',
    padding: '2px',
    paddingRight: '4px',
    background: 'whitesmoke'
  },
  a:{
    textDecoration: 'none',
    color: 'green'    
  }
}