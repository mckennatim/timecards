import React from 'react' // eslint-disable-line no-unused-vars
import {cfg, makeHref} from '../utilities/getCfg'

console.log('cfg.url.authqry: ', cfg.url.authqry)

const Nav = () =>{
  const host =window.location.hostname
  const href = makeHref(host, 'signup', '#urapps')
  return (
    <div style={style} id="menu"> 
      <ul>
        {/*
        <li style={style.li}><a style={style.a} href={cfg.url.authqry}>register</a></li>
        */}

      <li style={style.li}><a style={style.a} href={href}>apps</a></li>
        <li style={style.li}><a style={style.a} href="help" data-navigo>help</a></li>
        <li style={style.li}><a style={style.a} href="pay" data-navigo>pay</a></li>
        <li style={style.li}><a style={style.a} href="taxes" data-navigo>taxes</a></li>
        <li style={style.li}><a style={style.a} href="jobcosts" data-navigo>jobcosts</a></li>
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