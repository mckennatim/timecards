import React from 'react'
import {Nav} from '../components'
import {responsivePage} from '../showRWD'
//import {getHelp} from '../actions/sharedact'
import{fetchHelp} from '../services/fetches'
import {setKeyVal} from '../actions/sharedact'
import{routes} from '../routing'


class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      el3: {name: "mcmurry"},
      we: {name: "curtis"},
      otherwise: "dogshit"
    };
  }
  componentDidMount (){
    fetchHelp(routes[0].path)
    .then((res)=>{
      const allhelp = res.results.map((m)=>{
        m.qrankst=0
        m.arankst=0
        m.qedit=false
        m.aedit=false
        return m
      })
      setKeyVal({allhelp:allhelp, routes:routes, appid:'pay'})
    })
  }

  loadNav(){
    return Nav(this.props)
  }

  showRt(rtpg){
    if(typeof rtpg != 'function'){
      return rtpg.pg(rtpg.params)
    }
      return rtpg(this.props)
  }
  showPage(){
    return responsivePage(this.props)
  }

  render(){
    return(
      <div>
        <div style={style.he}>
          <span>timecards - pay for {this.props.eperson.coid}</span>
          {this.loadNav()}
        </div>
        <div style={style.container}>
        {this.showPage().map((el,i)=>{
          return <div style={style.content} key={i}>{el}</div>
        })}
        </div>
      </div>
      )
  }
}
export{App}

let style = {
  he:{
    height: '50px',
    background: 'white',
    flexGrow: 1,
    flexGhrink: 0,
    flexBasis: '98%', 
  },
  container:{
    background: '#CCCCCC',
    display: 'flex',
    flexDirection: 'row', /* generally better */
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'stretch',
    alignItems: 'stretch'
  },
  content:{
    minHeight:'200px',
    background: '#99CCFF',
    flexGrow: 1,
    flexShrink: 1, /*can shrink from 300px*/
    flexBasis: '225px'  
  }
}