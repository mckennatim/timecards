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
      <li style={style.li}><a style={style.a} href="about" data-navigo>about</a></li>
      <li style={style.li}><a style={style.a} href="oktcard" data-navigo>OKtcard</a></li>
      <li style={style.li}><a style={style.a} href="help" data-navigo>help</a></li>
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