import React from 'react'// eslint-disable-line no-unused-vars
import {Day} from './Day'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'

class TimeCard extends React.Component{
  state={selectedDay:9}

  constructor(props){
    super(props)
  }
  componentDidMount(){
    // console.log('this.props: ', this.props)
  }   
  setStatBkg=()=>{
    let sta ={...style.he.st.txtsp}
    if(this.props.tcard.showsub || 
      (this.props.tcard.wstat &&(this.props.tcard.wstat.status=='submitted' 
      || this.props.tcard.wstat.status=='approved' 
      || this.props.tcard.wstat.status=='paid'
      || this.props.tcard.wstat.status=='ready'
      ))){
      sta.background ='#9eea9d'
    }
    return sta
  }

  chwk=(e)=>{
    let wk =e.target.value
    console.log('e.target.value: ', e.target.value)
    //if(wk>0 && wk<=52){
      this.props.weekChanged(wk)
    //}
  }

  chyr=(e)=>{
    this.props.yearChanged(e.target.value)
  }

  handleDayChanges = (cmd, newdata)=>{
    this.props.tcardChanges(cmd,newdata)
  }

  clickSubmit =()=>{
    this.props.tcardChanges('submit',{showsub: false,status:'submitted', blabel:this.props.blabel})
    //console.log('this.props.blabel: ', this.props.blabel)
  }

  handleClick=(idx)=>()=>{
    this.setState({selectedDay:idx})
  }

  getHelp=(ho)=>()=>{
    console.log('ho: ', ho)
    const{allhelp}=this.props.help
    const rh = allhelp.filter((h)=>h.howto.includes(ho))[0]
    if(rh && rh.howto){
      window.alert(`How to ${rh.howto}? \n\nHere's how: \n${rh.hereshow}`)
    }
  }

  alertPaid=()=>{
    const{status}=this.props
    console.log('this.props.status ', status)
    if(status=='paid'){
      window.alert('You have already been paid for this weeks timecard so you cannot make any more changes to it')
    }
  }

  ckIfNotPaid=()=>{
    const{status}=this.props
    return status!='paid' ? true : false   
  }

  renderDays=()=>{
    const {week}=this.props;
    const {wkarr, jobs}=this.props.tcard;
    const rd = wkarr.map((d)=>{
      const isselected=d.idx==this.state.selectedDay
      return(
        <Day 
        key={d.idx} 
        data={d} 
        ismobile={this.props.ismobile} 
        week={week} hayjobs={this.props.hayjobs} 
        jobs={jobs} dayChanges={this.handleDayChanges} 
        gotClicked={this.handleClick(d.idx)} 
        isselected={isselected}
        status={this.props.status}
        />
      )
    })
    return rd
  }

  render(){
    if(this.props.tcard){  
      const{week, yr, showsub, blabel, tcard}=this.props
      const {wstat, hrs, emailid}=tcard;
      const status= wstat ? wstat.status : "unsaved" 
      const statstyle = this.setStatBkg()
      //const np=this.ckIfNotPaid()
      // unsaved, inprocess, ready, submitted, approved, paid
      const thrs=drnd(hrs.reduce((t,h)=>t+h,0))
      const renderedDays = this.renderDays()
      return(
    <div>
        <div style={style.he}>
          <div style={style.he.st}>
            <span style={statstyle}> {status} </span><br/>
            <span style={style.he.st.but}>
              {showsub && <button onClick={this.clickSubmit}>{blabel}</button> }
            </span><br/>
            <span onClick={this.getHelp('submit')} style={style.info.span}>&#9432;</span>
          </div>
          <div style={style.inp}>
            <span><input type="tel" value={yr} onChange={this.chyr} style={style.yr}/> </span>
            <span>week             
              <input type="tel" value={week} onChange={this.chwk} style={{width:"30px"}}/> {emailid}
            </span>
          </div>
          <div style={style.thrs}>
            {drnd(thrs)}
          </div>
        </div>
        <div style={style.daydiv}  onClick={this.alertPaid}>
          {renderedDays}
        </div>
      </div> 
      )
    }else{
    return(
        <div>yeah you dont seem to be logged in here, try register</div>
      )
    }
  }
}

TimeCard = mapClass2Element(TimeCard)

export {TimeCard}

const drnd=(n)=>{
  return Math.round(n*100)/100
}

let style = {
  he:{
    height:'70px', 
    background:'#99CCFF',
    st:{
      float:'left',
      but: {
        width:'70px'
      },
      txtsp: {
        width:'70px',
        background: '#efe869',
      }
    }
  },
  inp:{
    margin:'auto',
    width: '33%'
  },
  thrs:{
    fontSize: '20px',
    float:'right'
  },
  daydiv:{
    overflow:'hidden',
    width:'100%'
  },
  info:{
    div:{
      float:'right',
      textAlign:'right'
    },
    span:{
      fontSize: '200%',
      color: 'orange'
    }
  },
  yr:{
    width: "34px",
    backgroundColor: "#99CCFF",
    border: 'none'
  }
}