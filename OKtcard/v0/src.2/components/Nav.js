import React from 'react' // eslint-disable-line no-unused-vars
import {mStyle} from '../styles'
import {cfg} from '../utilities/getCfg'


const Nav = () =>(
    <div id="menu"> 
    <ul>
      <li style={mStyle.li}><a style={mStyle.a} href={cfg.url.authqry}>register</a></li>
      <li style={mStyle.li}><a style={mStyle.a} href="about" data-navigo>about</a></li>
      <li style={mStyle.li}><a style={mStyle.a} href="oktcard" data-navigo>OKtcard</a></li>
      <li style={mStyle.li}><a style={mStyle.a} href={cfg.url.jobs}>jobs</a></li>
    </ul>
    </div>
  )
export {Nav}

