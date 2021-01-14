import React from 'react'// eslint-disable-line no-unused-vars
import {Nav} from '../components'
import {responsivePage} from '../showRWD'

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
    //const {ejob}= this.props
    return(
      <div>
        <div className="header">
        <span>ReRoo Payroll  </span>
          {this.loadNav()}
        </div>
        <div className="container">
        {this.showPage().map((el,i)=>{
          return <div className="content  " key={i}>{el}</div>
        })}
        </div>
      </div>
      )
  }
}
export{App}
