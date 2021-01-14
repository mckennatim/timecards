import React from 'react';
import {TimeCard} from '../../../../tcard/v/src/components/TimeCard'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchSubmitted, fetchWhoTcard, putTcardWk} from '../services/fetches'
import {drnd} from '../utilities/wfuncs'

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
    this.getSubmitted(this.state.week)
  }

  getSubmitted=()=>{
    fetchSubmitted()
      .then((res)=>{
        if (res.message){
          window.alert(res.message)
        }else{
          this.setState({submitted:res})
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
        window.alert(res.message)
      }else{
        res = this.reCalcStatus(res)
        this.setState({tcard:res, gottcard:true})
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
    const wkpuhrs=drnd(hrs.reduce((t,h)=>t+h,0))
    const wkjchrs= drnd(jchrs.reduce((t,h)=>t+h,0))// eslint-disable-line no-unused-vars
    const st = hrs //[1,0,1,0,1,1,1]
      .map((h,i)=>h==jchrs[i])
      .reduce((t,j)=>t+j,0)
      let status=modwstat.status
    let showsub, blabel 
    if(st<7 || wkpuhrs==0){
      status = 'inprocess'
      showsub=false
    }else if(status=='submitted'){
      showsub=true
      blabel='approve'
    }else if(status=='approved' || status=='paid'){
      showsub=false
    }else{
      status = 'ready'
      showsub=true
      blabel= 'submit'
    }
    
    modwstat={...modwstat, status:status, hrs:wkpuhrs}
    modtcard={...modtcard, wstat:modwstat}
    this.setState({showsub, blabel})
    return modtcard
  }

  // handleTcardChanges=(cmd,chobj)=>{
  //   console.log('chobj: ', chobj)
  //   console.log('this state.tcard: ', this.state.tcard)
  //   let modtcard = {...this.state.tcard}
  //   let wkarr = modtcard.wkarr.slice()
  //   const idx = chobj.idx
  //   if (cmd=='iopu'){
  //     let hrs =  modtcard.hrs.slice()
  //     hrs[idx] = chobj.hrs
  //     console.log('hrs: ', hrs)
  //     wkarr[idx].hrs = chobj.hrs
  //     wkarr[idx].inout =chobj.inout
  //     modtcard.wkarr = wkarr
  //     modtcard.hrs = hrs
  //   }
  //   if (cmd=='jcost'){
  //     let jchrs =  modtcard.jchrs.slice()
  //     const njcost = chobj.jcost.slice()
  //     // njcost=[{ job: "105 Green St", cat: null, hrs: 2 }]
  //     const sumhrs = drnd(njcost.reduce((t,j)=>j.hrs+t, 0))
  //     jchrs[idx]=sumhrs
  //     wkarr[idx].jcost=njcost
  //     wkarr[idx].jchrs=sumhrs
  //     modtcard.wkarr = wkarr
  //     modtcard.jchrs = jchrs
  //   }
  //   this.changeTcard(modtcard)
  // }
  // changeTcard =(modtcard)=>{
  //   const {hrs, jchrs, wstat}=modtcard
  //   let modwstat= {...wstat}
  //   console.log('hrs array: ', hrs)
  //   console.log('jchrs array: ', jchrs)
  //   const wkpuhrs=drnd(hrs.reduce((t,h)=>t+h,0))
  //   const wkjchrs= drnd(jchrs.reduce((t,h)=>t+h,0))// eslint-disable-line no-unused-vars
  //   const st = hrs //[1,0,1,0,1,1,1]
  //     .map((h,i)=>h==jchrs[i])
  //     .reduce((t,j)=>t+j,0)
  //   let status
  //   let showsub
  //   if(st<7 || wkpuhrs==0){
  //     status = 'inprocess'
  //     showsub=false
  //   }else{
  //     status = 'ready'
  //     showsub=true
  //   }
  //   modwstat={...modwstat, status:status, hrs:wkpuhrs}
  //   putTcardWk(modwstat)
  //   modtcard={...modtcard,wstat:modwstat, showsub}
  //   console.log('modtcard: ', modtcard)
  //   this.setState({tcard:modtcard})
  // }

  renderSubmitted=(subm)=>{
    if(subm.length>0)
    return(
      <ul style={style.subm.ul}>
        {subm.map((s,i)=>{
          return(
            <li key={i} style={style.subm.li} ix={i} onClick={this.getWhosTcard}>
              <div ix={i} style={style.subm.li.id}>{s.wprt}: </div>
              <div ix={i} style={style.subm.li.id}>{s.emailid}</div>
              <div ix={i} style={style.subm.li.stat}>{s.status}</div>
            </li>
          )
        })}
      </ul>
    )
  } 
  
  renderTimecard = ()=>{
    if(this.state.gottcard){
      return (
        <TimeCard week={this.state.week} yr={this.state.yr} tcard={this.state.tcard} ismobile={this.props.responsive.ismobile} showsub={this.state.showsub} blabel={this.state.blabel} tcardChanges={this.handleTcardChanges}/>
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
  he:{
    height:'60px',
    background:'grey',
    title:{
      float: 'right'
    }
  },
  subm:{
    div:{
      overflow:'hidden',
      background: 'silver'
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
    }
  }
}