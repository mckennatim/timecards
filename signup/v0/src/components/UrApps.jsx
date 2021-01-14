import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import{fetchApps} from '../services/fetches'
import {ls, cfg, makeHref} from '../utilities/getCfg'
import  { setKeyVal} from '../actions/shared'
const moment = require('moment')

class UrApps extends React.Component{
  active='mabibi or buttler'
  componentDidMount(){
    this.setState({host:window.location.hostname})
    this.getApps()
  }  
  getApps(){
    // console.log('in getApps')
    fetchApps()
      .then((res)=>{
        console.log('res: ', res[0].role)
        if(res[0].role && res[0].role=='partner'){
          setKeyVal({ispartner:true})
        }
        const apps = res.map((r)=>r.appid)
        this.setState({apps:apps, emailid: res[0].emailid, coid:res[0].coid,role:res[0].role, goodtil:moment(res[0].goodtil).format('MM/DD/YY hh:mm A') }, ()=>console.log('this.state: ', this.state))
        console.log('res: ', res)
      })
  }

  getQuery=()=>{
    const params = this.props.cambio.page.params
    if(params && params.query =='rerender'){
      location.replace('#urapps')
      setTimeout(()=>{
        this.getApps()
      },300)     
    }
  }

  renderApps=()=>{
    const {apps, host}=this.state
    const ra = apps
      .filter((a)=>a!='signup' && a!='books' && a!='co')
      .map((a,i)=>{
      const href = makeHref(host,a)
      // console.log('href: ', href)
      const img = `img/${a}.png`
      return(
        <li  key={i} style={style.myli.li}>
        <a href={href}>
          <div key={i}>
            <img src={img} alt={a} style={style.myli.img}/> 
            <span>
            {a}
            </span>
          </div>
        </a>
        </li>
      )
    })      
    return(
      <ul style={style.myli.ul}>
        {ra}
      </ul>     
    )
  }

  render(){
    // console.log('ls.getToken ? true : false: ', ls.getToken ? true : false)
    if(this.state && this.state.apps && ls.getToken()){
      const {emailid, role, goodtil, coid}=this.state
      const renderedapps = this.renderApps()
      return(
        <div style={style.outer}>
          <h4> JobCost PayTime Apps</h4>
          <h5>Signed in as:</h5>
          <span>id: {emailid}</span><br/>
          <span>co: {coid}</span><br/>
          <span>role: {role}</span><br/>
          <span>until: {goodtil.split('T')[0]}</span><br/>
          <div style={style.myli.od}>
            {renderedapps}
          </div>
          <p>If you are associated with another company, click <a href={cfg.url.authqry}>register</a> to be able to sign into that company </p>
        </div>
      )
    }else{
      return(
        <div style={style.outer}>
        <h4>Re-register</h4>
          <p>There doesn't seeem to be a record of you on this device associated with a company. Did you click on an active coid on the prior screen. Either go back and select a valid coid, start a demo or create a comapany or else re-<a href={cfg.url.authqry}>register</a>  </p>
        </div>
      )
    }
  }
}
UrApps = mapClass2Element(UrApps)

export {UrApps}

const style = {
  outer:{
    overflow:'hidden',
    padding: '4px',
    margin: '2px 10px 10px 10px'
  },
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
    },
    cu:{
      margin: '4px',
      padding: '4px'
    },
    fu:{
      margin: '4px',
      padding: '4px'
    },
    hi:{
      margin: '4px',
      padding: '4px'
    },     
    da:{
      margin: '4px',
      padding: '4px'
    }     
  },
  myli :{
    img:{
      padding:'6px',
      width:'40px'
    },
    od:{
      overflow:'hidden',
      width: '100%',
      border: '1px solid #ccc'
    },
    ul:{
      textAlign: 'left',
      listStyleType: 'none',
      paddingLeft: '0px'
    },
    li:{
      background: '#99CCCC',
      padding: '2px',
      overflow: 'hidden',
      border: 'solid 1px black'
    },
    idx:{
      float: 'left',
      width: '5%',
      padding: '4px'
    },
    icon:{
      fontSize: '18px'
    },
    ck:{
      transform: 'scale(1.5)',
      msTransform: 'scale(1.5)',
      WebkitTransform: 'scale(1.5)',
      padding: '10px',
      border: '2px solid black'
    },
    person:{
      padding: '3px',
      width: '50%',
      float: 'left',
      background: '#99CCCC'
    },
    cat:{
      padding: '3px',
      width: '20%',
      float: 'left',
      background: '#99CCCC'

    },
    act:{
      width: '10%',
      float: 'right',
      background: '#99CCCC'

    }
  }
}