import React from 'react' // eslint-disable-line no-unused-vars
import {makeHref} from '../utilities/getCfg'
import { setKeyVal } from '../actions/jobacts';

const Nav = () =>{
  const setU=()=>{
    setKeyVal({update:false, clearjc:true})
  }
  const host =window.location.hostname
  const href = makeHref(host, 'signup', '#urapps')
  return (
    <div style={style} id="menu"> 
      <ul>
        {/*
        <li style={style.li}><a style={style.a} href={cfg.url.authqry}>register</a></li>
        */}

      <li style={style.li}><a style={style.a} href={href}>apps</a></li>
      <li style={style.li}><a style={style.a} href="about" data-navigo>about</a></li>
      <li style={style.li}><a style={style.a} href="help" data-navigo>help</a></li>
      <li style={style.li}><a style={style.a} href="jobs" data-navigo>jobs</a></li>
      <li style={style.li}><a style={style.a} href="sortjob" data-navigo>sortjobs</a></li>
      <li style={style.li}><a style={style.a} href="addjob"  onClick={setU}data-navigo>addjob</a></li>
        <div></div>
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

// import React from 'react' // eslint-disable-line no-unused-vars
// import {cfg} from '../utilities/getCfg'
// import { setKeyVal } from '../actions/jobacts';

// console.log('cfg.url.authqry: ', cfg.url.authqry)

// const Nav = () =>{

//   const setU=()=>{
//     setKeyVal({update:false, clearjc:true})
//   }
//   return (
//     <div style={style} id="menu"> 
//       <ul>
//         <li style={style.li}><a style={style.a} href={cfg.url.authqry}>register</a></li>
//         <li style={style.li}><a style={style.a} href="about" data-navigo>about</a></li>
//         <li style={style.li}><a style={style.a} href="jobs" data-navigo>jobs</a></li>
//         <li style={style.li}><a style={style.a} href="sortjobs" data-navigo>sortjobs</a></li>
//         <li style={style.li}><a style={style.a} href="addjob"  onClick={setU}data-navigo>admojob</a></li>
//       </ul>
//     </div>
//   )
// }
// export {Nav}

// let style={
//   background: 'white',
//   li:{
//     display: 'inline',
//     padding: '2px',
//     paddingRight: '4px',
//     background: 'whitesmoke'
//   },
//   a:{
//     textDecoration: 'none',
//     color: 'green'    
//   }
// }