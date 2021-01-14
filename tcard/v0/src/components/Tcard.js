import React from 'react';
var moment = require('moment');
import {TimeCard} from './TimeCard'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchTcard, putTcardWk, putTcardJc, fetchSettings} from '../services/fetches'
import {drnd} from '../utilities/wfuncs'
import {ls, makeHref} from '../utilities/getCfg'
import { addPage, removePage } from '../actions/responsive';

class Tcard extends React.Component {
  constructor(props){
    super(props)
  }
  state = {
    gottcard:false,
    week:moment().week(),
    yr:moment().format('YYYY'),
    blabel:'xxx'
  }

  componentDidMount(){
    addPage('Tcard')
    this.getSettings()
    this.getTimeCard()
  }

  componentWillUnmount(){
    removePage('Tcard')
  }

  getSettings=()=>{
    fetchSettings() 
      .then((res)=>{
        if (res.qmessage){
          console.log('res.qmessage: ', res.qmessage)
          this.setState({qmessage:res.qmessage})
          //window.alert(res.qmessage)
        }else{        
          ls.modItem('firstday', res.firstday)
          // console.log('res: ', res)
        }
    })
  }

  getTimeCard(){
    const{yr, week}=this.state
    console.log('yr: ', yr)
    fetchTcard(yr, week)
      .then((res)=>{
        this.emailId=res.emailid
        if (res.qmessage){
          console.log('res.qmessage: ', res.qmessage)
          this.setState({qmessage:res.qmessage})
          //window.alert(res.qmessage)
        }else{
          let hayjobs=true
          res = this.reCalcStatus(res)
          if(res.jobs.length==0){
            hayjobs=false
          }
          console.log('res: ', res)
          this.setState({tcard:res, status:res.wstat.status, gottcard:true, showsub:this.setShowSub(res), hayjobs})
        }
      })
  }

  handleWeekChanged = (wk)=>{
    // console.log('this.state.week: ', this.state.week)
    // console.log('typeof wk: ', typeof wk)
    // console.log('wk.includes("+"): ', wk.includes("+"))
    wk = wk.includes("+") ? (this.state.week*1+1).toString() : wk
    wk = wk.includes("-") ? (this.state.week*1-1).toString() : wk
    this.setState({week:wk},()=>{
      if (wk*1>0 && wk*1<53){
        this.getTimeCard()
      }
    })
  }

  handleYearChanged=(yr)=>{
    this.setState({yr:yr}, ()=>{
      if (yr*1>2016 && yr*1<2900){
        this.getTimeCard()
      }
    })  
  }

  setShowSub =(tcard)=>{
    let showsub=false
    if(tcard.wstat && tcard.wstat.status=='ready'){
      showsub=true
    }
    return showsub
  }

  handleTcardChanges=(cmd,chobj)=>{
    let modtcard = {...this.state.tcard}
    console.log('modtcard: ', modtcard)
    if(this.state.status=='paid'){
      window.alert('You cannot change a paid tcard. Talk to your boss.')
    }else{
      let wkarr = modtcard.wkarr.slice()
      const idx = chobj.idx
      if (cmd=='iopu'){
        if(modtcard.jobs.length==0){
          let jchrs =  modtcard.jchrs.slice()
          console.log('idx: ', idx, 'has jobslength of 0 and hrs of ', chobj.hrs)
          console.log('wkarr[idx].jchrs: ', wkarr[idx].jchrs)
          wkarr[idx].jchrs=chobj.hrs
          const jcentry = [{job:'labor expense', cat:'general', hrs:chobj.hrs}]
          wkarr[idx].jcost=jcentry
          jchrs[idx]=chobj.hrs
          modtcard.jchrs = jchrs
          modtcard.wstat.status = 'no job hrs changed'
          const rec = {
            wdprt:wkarr[idx].wdprt,
            jcost:jcentry,
            emailid:modtcard.emailid
          }
          putTcardJc(rec)
        }
        let hrs =  modtcard.hrs.slice()
        hrs[idx] = chobj.hrs
        wkarr[idx].hrs = chobj.hrs
        wkarr[idx].inout =chobj.inout
        modtcard.wkarr = wkarr
        modtcard.hrs = hrs
        console.log('modtcard: ', modtcard)
        modtcard = this.reCalcStatus(modtcard)
      }
      if (cmd=='jcost'){
        let jchrs =  modtcard.jchrs.slice()
        const njcost = chobj.jcost.slice()
        // njcost=[{ job: "105 Green St", cat: null, hrs: 2 }]
        const sumhrs = drnd(njcost.reduce((t,j)=>j.hrs+t, 0))
        jchrs[idx]=sumhrs
        wkarr[idx].jcost=njcost
        wkarr[idx].jchrs=sumhrs
        modtcard.wkarr = wkarr
        modtcard.jchrs = jchrs
        modtcard = this.reCalcStatus(modtcard)
      }
      if(cmd=='submit'){
        //console.log('chobj: ', chobj)
        let modwstat= {...modtcard.wstat}
        modwstat.status=chobj.status
        modtcard.wstat=modwstat
        this.setState({showsub:false})
      }
      // console.log('modtcard.wstat: ', modtcard.wstat)
      putTcardWk(modtcard.wstat)
      this.setState({tcard:modtcard})
    }      
  }

  reCalcStatus =(modtcard)=>{
    const {hrs, jchrs, wstat}=modtcard
    let modwstat= {...wstat}
    const wkpuhrs=drnd(hrs.reduce((t,h)=>t+h,0))
    const wkjchrs= drnd(jchrs.reduce((t,h)=>t+h,0))// eslint-disable-line no-unused-vars
    const st = hrs //[1,0,1,0,1,1,1]
      .map((h,i)=>h==jchrs[i])
      .reduce((t,j)=>t+j,0)
    let status=modwstat.status
    let showsub, blabel 
    if( st<7 || wkpuhrs==0 ){
      status = 'inprocess'
      showsub=false
    }else if(status=='no job hrs changed' ){  
      status = 'ready'
      showsub=true
      blabel= 'submit'      
    }else if(status=='submitted' || status=='approved' || status=='paid'){
      showsub=false
    }else{
      status = 'ready'
      showsub=true
      blabel= 'submit'
    }
    modwstat={...modwstat, status:status, hrs:wkpuhrs, hrsarr:JSON.stringify(hrs)}
    modtcard={...modtcard, wstat:modwstat}
    this.setState({showsub, blabel})
    return modtcard
  }


  renderTimecard = ()=>{
    if(this.state.gottcard){
      return (
        <TimeCard 
        week={this.state.week} 
        yr={this.state.yr} 
        tcard={this.state.tcard} 
        ismobile={this.props.responsive.ismobile} 
        showsub={this.state.showsub} 
        blabel={this.state.blabel} 
        hayjobs={this.state.hayjobs} 
        tcardChanges={this.handleTcardChanges} 
        weekChanged={this.handleWeekChanged}
        yearChanged={this.handleYearChanged}
        help={this.props.help}
        status={this.state.status}/>
      )
    }else{
      return(
        <div style={style.he}>
          <p>Message from server: {this.state.qmessage}. </p><br/> <p> The link below will take you home where you will be asked to re-register. This will take you to a list of apps you can use in your company. If you are registered in more than one company, you can choose your company first. <a href={makeHref(location.hostname, 'signup', '#urapps')} >HOME</a></p> 
          
        </div>
        )
    }
  }
  
  render() {
    const tcard = this.renderTimecard()
    return ( 
      <div >
        <div>
          {tcard}
        </div>
      </div>
    );
  }
}

Tcard=mapClass2Element(Tcard)
 
export {Tcard} ;

const style = {
  he:{
    overflow:'hidden',
    margin: '2px 10px 10px 10px',
    padding: '4px'
  }
}