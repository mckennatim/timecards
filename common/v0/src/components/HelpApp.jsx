import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
// import{routes} from '../routing'

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';// eslint-disable-line no-unused-vars
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';// eslint-disable-line no-unused-vars
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';// eslint-disable-line no-unused-vars
import TextField from '@material-ui/core/TextField';// eslint-disable-line no-unused-vars
// import {addPage, removePage}from '../actions/responsive'
// import { responsivePage } from '../showRWD';
// import {drnd} from '../utilities/getCfg'


const styles = theme => ({
  root:{
    width:'100%'
  },
  troot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  heading: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightRegular,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


class HelpApp extends React.Component{
  state = {letvote: true, toggles:new Array(100).fill(false)}

  componentDidMount =()=>{
    //console.log('this.props: ', this.props)
  } 
    
  vote=(id,up, vtype)=>()=>{
    this.props.xvote(id,up, vtype)
  } 

  toggle=(i)=>()=>{
    const{toggles}=this.state
    toggles[i]= !toggles[i]
    this.setState({toggles})
  }

  untoggle=()=>{
    this.setState({toggles:new Array(100).fill(false)})
  }

  clearQuestion=(ob)=>()=>{
    console.log('ob: ', ob)
    console.log('this.props: ', this.props)
    this.props.editHelp({do: "clearques", m: ob.m, d: "q"})()
    this.untoggle()  
  }

  dispUniTitl=(bhelp,h,i)=>()=>{
    let tf = true
    if(bhelp[i-1] && bhelp[i-1].pagename==h.pagename) {
      tf= false
    }
    return tf
  }

  renderAnswers=(h)=>()=>{
    const {letvote} = this.state
    return(
      <ul style={style.list.ul}>
      {h.indent.map((m,j)=>{
        if(!m.aedit){
          return(
            <li style={style.list.li} key={j}>
              {letvote &&
              <Vote m={m} vote={this.vote} vtype='arank' style={v.l}/>
              }
              <div style={style.list.hhow}>
                {m.hereshow} 
                {/* ({h.qid}, {m.aid}) */}
              </div><br/>
              <i onClick={this.props.editHelp({do:'input',m:m, d:'a'})} className="material-icons">edit</i>
              <i onClick={this.props.editHelp({do:'clearans',m:m, d:'a'})}  className="material-icons">clear</i>
            </li>
            )
        }else{
          m.hereshow = !m.hereshow ? '' : m.hereshow
          return (
            <form onSubmit={this.props.editHelp({do:'submita', m:m})} key={j}>
            <textarea name="d" id="" cols="30" rows="4" value={m.hereshow} onChange={this.props.editHelp({do:'changeans', m:m})}/>
            <input type="submit" value="Submit" />
            </form>
          )
        }
        })}
      </ul>
    )
  }

  renderQuestion=(h,i)=>()=>{
    const {letvote} = this.state
    if(!h.qedit){
      return(
      <div style={style.sum.div}>
        <div onClick={this.toggle(i)} style={style.sum.how}>
          {h.howto} 
          {/* ({h.qid}) */}
        </div>
        {letvote &&
        <Vote m={h} vote={this.vote} vtype='qrank' style={v.r}/>
        }
      </div>
      )
    }else{
      return(
        <form onSubmit={this.props.editHelp({do:'submitq', m:h, d:'q'})} key={i}>
        <select value={this.props.p} onChange={this.props.editHelp({do:'selectp', m:h ,d:'q'})}>
        {this.props.help.routes.map((r,j)=>{
          return (<option value={r.page} key={j}>{r.page}</option> )
        })}
        </select> 
        <textarea name="d" id="" cols="30" rows="4" value={h.howto} onChange={this.props.editHelp({do:'changeq', m:h, d:'q'})}/>
        <input type="submit" value="Submit" />
        </form>
      )
    }
  }

  render=()=>{
    const{bhelp}=this.props
    const {toggles} = this.state
    return(
    <div style={style.outer} >
      <h4> Help </h4>
      {bhelp.map((h,i)=>{
        const theq = this.renderQuestion(h,i)
        const detli = this.renderAnswers(h,i)
        const titl = this.dispUniTitl(bhelp,h,i)()
        return(
        <div key={i}>
          {titl && h.pagename}
        <ExpansionPanel  key={i} expanded={toggles[i]}>
          <ExpansionPanelSummary >
            {theq()}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {detli()}
          </ExpansionPanelDetails>
          <i onClick={this.props.addDelHelp({do:'addans',m:h})}  className="material-icons">add</i>
          <i onClick={this.clearQuestion({do:'clearques',m:h, d:'q'})}  className="material-icons">clear</i>
          <i onClick={this.props.editHelp({do:'input',m:h, d:'q'})} className="material-icons">edit</i>
        </ExpansionPanel>
        </div>
        )
      })}
    </div>
    )
  }
}

HelpApp = withStyles(styles)(HelpApp)
HelpApp = mapClass2Element(HelpApp)


function Vote(props){// eslint-disable-line no-unused-vars
  const{m, vote, vtype, style}= props
  const idtype = vtype=='qrank' ? 'qid' : 'aid'
  const st3 = vtype+'st'
  // console.log('m[idtype]: ', m[idtype], vtype)
  // console.log('m: ', m)
  return(
    <div style={style.vote}>
      <i onClick={vote(m[idtype], true, vtype)} 
      className="material-icons"
      style={m[st3]>0 ? {color:'orange'} : {color:'lightgrey'}}>
          keyboard_arrow_up
      </i>
      {m[vtype]}
      <i onClick={vote(m[idtype], false, vtype)} 
      className="material-icons"
      style={m[st3]<0 ? {color:'orange'} : {color:'lightgrey'}}>
        keyboard_arrow_down
      </i>
    </div>
    )
}

export {HelpApp}

const v = {
  r: {
    vote:{
      float: 'right',
      padding:'0 0 0 3px'
    }
  },
  l:{
    vote:{
      float: 'left',
      padding:'0 0 0 3px'
    }
  }
}

const style = {
  add:{
  },
  outer:{
    overflow:'hidden',
    padding: '4px',
    margin: '2px 10px 10px 10px',
    background: '#99CCFF'
  },
  he:{
    overflow:'hidden',
    margin: '2px 10px 10px 10px',
   padding: '4px',
    background: '#C4A265'
  },
  list:{
    ul:{ 
      listStyleType: 'none',
      paddingInlineStart: '0px',
      width:'100%'
      //display: 'flex',
      //flexDirection: 'column'
    },
    li:{
      overflow:'hidden',
      paddingTop: '8px',
      borderBottom: '1px solid',
      width: '100%',
      //flex:1
    },
    rt:{
      float:'right',
      textAlign:'right'
    },
    hhow:{
      width: '80%',
      float:'right'
    }
  },
  vote:{
    float:'right'
  },
  sum:{
    div:{
      padding: '1px',
      width: '100%'
    },
    how:{
      float:'left',
      width:'75%',
      padding:'1px'
    }
  }
}