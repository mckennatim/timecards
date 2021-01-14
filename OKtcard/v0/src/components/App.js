import React from 'react'// eslint-disable-line no-unused-vars
import {Nav} from '../components'
import {responsivePage} from '../showRWD'
import{routes} from '../routing'
import {fetchHelp} from '../../../../common/v0/src/services/fetches'
import{setKeyVal} from '../actions/jobacts'

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
    console.log('routes[0].path: ', routes[0].path)
    fetchHelp(routes[0].path)
    .then((res)=>{
      const allhelp = res.results.map((m)=>{
        m.qrankst=0
        m.arankst=0
        m.qedit=false
        m.aedit=false
        return m
      })
      console.log('allhelp: ', allhelp)
      setKeyVal({allhelp:allhelp, routes:routes, appid:'oktcard'})
    })     
  }
  
  loadNav(){
    return Nav()
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
          <span>OKtcard app </span>
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