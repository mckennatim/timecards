import React from 'react';
import {TimeCard} from '../../../../tcard/v0/src/components/TimeCard'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchSubmitted, fetchWhoTcard, putTcardWk, putTcardJc, fetchSettings} from '../services/fetches'
import {drnd} from '../utilities/wfuncs'
import {ls, makeHref} from '../utilities/getCfg'

class OKtcard extends React.Component {
  constructor(props){
    super(props)
  }
  state = {
    submitted:[],
    gottcard:false,
    week:55,
    yr:'1969' ,
    blabel:'yyyy'
  }

  componentDidMount(){
    this.getSettings()
    this.getSubmitted(this.state.week)
  }

  handleWeekChanged = (wk)=>{
    console.log(wk,' only works in timecards, choose from above instead')
    window.alert('not an editable field when in OKtcard, you only get to see the submitted tcards listed above')
  }
  handleYearChanged = (yr)=>{
    console.log(yr,' only works in timecards, choose from above instead')
    window.alert('not an editable field when in OKtcard, you only get to see the submitted tcards listed above')
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

  getSubmitted=()=>{
    fetchSubmitted()
      .then((res)=>{
        if (res.qmessage){
          console.log('res.qmessage: ', res.qmessage)
          this.setState({qmessage:res.qmessage})
        }else{
          const nres= res.map((r)=>{
            r.isapproved=false
            return r
          })
          this.setState({submitted:nres})
        }
      })
  }

  getWhosTcard=(e)=>{
    //getsAttribute of whatever is touched in li, not just li bank space
    const idx = e.target.getAttribute('ix')
    const wstat =this.state.submitted[idx]
    this.setState({week:wstat.wprt.slice(-2)*1, yr:wstat.wprt.slice(0,4)})
    fetchWhoTcard(wstat)
    .then((res)=>{
      if (res.message){
        console.log('res.qmessage: ', res.qmessage)
        this.setState({qmessage:res.qmessage})
      }else{
        console.log('res: ', res)
        let hayjobs=true
        //res = this.reCalcStatus(res)
        //console.log('res: ', res)
        if(res.jobs.length==0){
          hayjobs=false
        }
        res.idx=idx        
        this.setState({tcard:res, gottcard:true, hayjobs, showsub:true, blabel:'approve'})
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
      let modwstat= {...modtcard.wstat}
      const {blabel} =this.state
      console.log('blabel: ', blabel)
      console.log('chobj: ', chobj)
      if(blabel=='approve'){
        console.log('in blabel===approve')
        modwstat.status='approved'
        this.setState({showsub:false})
      }else if(blabel=='submit') {
        modwstat.status=chobj.status
        this.setState({showsub:false})
      }
      modtcard.wstat=modwstat
      console.log('modtcard.wstat 1: ', modtcard.wstat)
      modtcard = this.reCalcStatus(modtcard)
    }
    console.log('modtcard.wstat 2: ', modtcard.wstat)
    putTcardWk(modtcard.wstat)
    this.setState({tcard:modtcard})      
  }

  reCalcStatus =(modtcard)=>{
    const {hrs, jchrs, wstat}=modtcard
    let modwstat= {...wstat}
    const oldstat=modwstat.status
    const wkpuhrs=drnd(hrs.reduce((t,h)=>t+h,0))
    const wkjchrs= drnd(jchrs.reduce((t,h)=>t+h,0))// eslint-disable-line no-unused-vars
    //const{blabel}=this.state
    const st = hrs //[1,0,1,0,1,1,1]
      .map((h,i)=>h==jchrs[i])
      .reduce((t,j)=>t+j,0)
    let status=modwstat.status
    let showsub, nblabel 
    console.log('st: ', st)
    // if(blabel=='approve'){
    //   status='approved'
    //   showsub=false
    // }else 

    // }else if(blabel=='submit') {
    //   status='submitted'
    //   nblabel='approve'
    //   showsub=true
    // } 
    if(st<7 || wkpuhrs==0){
      status = 'inprocess'
      showsub=false
      console.log('st: ', st)
      console.log('status: ', status)
    }else if(status=='paid'){
      showsub=false
    }else if (status=='ready'){
      showsub=true
      nblabel= 'submit'
    }else if(status=='submitted'){
      showsub=true
      nblabel='approve'
    }else if(status=='approved'){
      showsub=false
    }else if (status=='inprocess'){
      status='ready'
      showsub=true
      nblabel='submit'
    }
    console.log('status: ', status)
    modwstat={...modwstat, status:status, hrs:wkpuhrs}
    this.updateSubmittedStatus(oldstat,modwstat)
    modtcard={...modtcard, wstat:modwstat}
    this.setState({showsub, blabel:nblabel})
    return modtcard
  }

  updateSubmittedStatus = (oldstat,wstat)=>{
    console.log('wstat.status: ', wstat.status)
    console.log('oldstat: ', oldstat)
    //if(true){
      // console.log('this.state.submitted: ', this.state.submitted)
      let sarr  = this.state.submitted.slice()
      let nsarr = sarr.map((r)=>{
        if(r.emailid==wstat.emailid && r.wprt==wstat.wprt){
          r.status=wstat.status
          if (r.status=='approved'){
            r.isapproved=true
          }else{
            r.isapproved=false
          }
        }
        return r
      })
      this.setState({submitted:nsarr, statuschanged:true}) 
    //}
  }

  renderSubmitted=(subm)=>{
    console.log('thsi.state.tcard.idx: ', this.state)
    const{statuschanged}=this.state
    console.log('statuschanged: ', statuschanged)
    console.log('subm: ', subm)
    if(subm.length>0){
    return(
      <ul style={style.subm.ul}>
        {subm.map((s,i)=>{
          const sty = s.isapproved ? style.subm.hili : style.subm.li
          return(
            <li key={i} style={sty} ix={i} onClick={this.getWhosTcard}>
              <div ix={i} style={style.subm.li.id}>{s.wprt}: </div>
              <div ix={i} style={style.subm.li.id}>{s.emailid}</div>
              {s.isapproved && 
              <i className="material-icons" style={{fontSize:'20px', color:'green'}}>done</i>
              }
              <div ix={i} style={style.subm.li.stat}>{s.status}</div>
            </li>
          )
        })}
      </ul>
      )
    }else if(subm.length==0){
      return(
        <div style={style.outer}>
          <p>No submitted timecards needing approval. Nothing to do here.</p>
        </div>
      )
    }else {
      return(
        <div style={style.outer}>
          <p>Message from server: {this.state.qmessage}. </p><br/> <p> The link below will take you home where you will be asked to re-register. This will take you to a list of apps you can use in your company. If you are registered in more than one company, you can choose your company first. <a href={makeHref(location.hostname, 'signup', '#urapps')} >HOME</a></p> 
          
        </div>
        )
    }
  } 
  
  renderTimecard = ()=>{
    const{gottcard} =this.state
    if(gottcard){
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
        help={this.props.help}/>
      )
    }
  }
  
  render() {
    const{submitted }=this.state
    const submrend = this.renderSubmitted(submitted)
    const tcard = this.renderTimecard()
    return ( 
      <div >
        <div style={style.he}>
          <div style={style.he.title}>OKtcard</div>
        </div>
        <div style={style.subm.div} >
          <span>outstanding submitted timecards</span>
          {submrend}
        </div> 
        <div>
          {tcard}
        </div>
      </div>
    );
  }
}

OKtcard=mapClass2Element(OKtcard)
 
export {OKtcard} ;

let style={
  outer:{
    overflow:'hidden',
    margin: '2px 10px 10px 10px',
    padding: '4px'
  } ,
  he:{
    height:'20px',
    background:'grey',
    title:{
      float: 'right'
    }
  },
  subm:{
    div:{
      overflow:'hidden',
      background: '#99CCCC'
    },
    ul:{
      width: '98%',
      padding: '5px',
      listStyle: 'none',
      float: 'left'
    },
    li:{
      overflow:'hidden',
      padding: '6px',
      border:'1px solid',
      id:{
        float: 'left'
      },
      stat: {
        float: 'right'
      }
    },
    hili:{
      overflow:'hidden',
      padding: '6px',
      border:'1px solid',
      background: '#9eea9d'
    }
  }
}