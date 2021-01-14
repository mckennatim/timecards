import React from 'react'// eslint-disable-line no-unused-vars
import {parseQuery} from '../utilities/wfuncs'
import {ls, cfg} from '../utilities/getCfg'
import {mapClass2Element} from '../hoc/mapClass2Element'
// import {fetchCtoken, fetchCoids} from '../../../../common/v0/src/services/fetches'
import {postUniCoid, getDemoStart, fetchCtoken, fetchCoids} from '../services/fetches'
import {setKeyVal} from '../actions/shared';
import FormControl from '@material-ui/core/FormControl';// eslint-disable-line no-unused-vars

import TextField from '@material-ui/core/TextField';// eslint-disable-line no-unused-vars
import Button from '@material-ui/core/Button';// eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'; 
import ExpansionPanel from '@material-ui/core/ExpansionPanel';// eslint-disable-line no-unused-vars
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';// eslint-disable-line no-unused-vars
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';// eslint-disable-line no-unused-vars
import Typography from '@material-ui/core/Typography';// eslint-disable-line no-unused-vars
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';// eslint-disable-line no-unused-vars
const moment = require('moment')

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 240,
  },
  textField300: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 240,
  },
  button: {
    margin: theme.spacing.unit,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  root: {
    display: 'flex',
  },
  rootExp: {
    width: '100%',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class Registered extends React.Component {
  state = {
    newco:this.props.newco, 
    newup:'update', 
    showbut:false, 
    errorcoid:'', 
    settingup:false,
    today:new Date()
  }
  myRef = React.createRef();

  componentDidMount() {
    //this.setState({newco:this.props.newco})
    console.log('window.location.hash: ', window.location.hash)
    const urlParams = window.location.hash.split('?');
    console.log('urlParams: ', urlParams)
    // const query= this.props.cambio.page.params.query;
    // console.log('query: ', query)
    // var mobj = parseQuery(query)
    var mobj = parseQuery(urlParams[1])
    console.log('mobj: ', mobj)
    const haymobj = Object.keys(mobj).length==0 ? false : true
    if(!haymobj && !ls.getItem()){
      console.log('you should get a message and mabe register') 
      this.setState({renderwhat:'goregister'})
    }else if (mobj.message){
      const message = decodeURI(mobj.message)
      this.setState({renderwhat: 'message', message: message })
    }else if(mobj.token){
      ls.removeItem()
      setKeyVal({mobj:mobj})
      fetchCoids(mobj)
      .then((res)=>{
        console.log('res: ', res)
        if(res.binfo.message){
          if (res.binfo.message=='authorized but unknown user in signup'){
            
            let nco ={...this.state.newco}
            nco.person = mobj.email
            console.log('nco: ', nco)
            this.setState({renderwhat: 'createcoid', message: res.binfo.message, newco:nco, ttoken:mobj.token})
          }else{
            console.log('res.binfo.message: ', res.binfo.message)
            this.setState({renderwhat: 'message', message: res.binfo.message})
          }
        }
        // if(res.coid &&  res.coid.length==1){
        //   this.getCtoken(mobj.token, res.coid[0])
        // }else if(res.coid &&  res.coid.length==0){
        if(res.coid &&  res.coid.length==0){
          console.log('what to do if coids = []')
        }else if(res.coid &&  res.coid.length>0){
          this.setState({renderwhat: 'coids', cos:res.coid, ttoken:mobj.token})
        }
      }) 
    }else if(ls.getItem()){
      console.log('used to jump to apps: ')
      
      //location.replace('#urapps')
    }
    let tid = this.refs.coidref
    console.log('tid: ', tid)
  }

  clickCoid=(e)=>{
    const idx =e.target.getAttribute('idx')
    // console.log('idx: ', idx)
    const co = this.state.cos[idx]
    // console.log('co: ', co)
    if(idx){
      const gtil = new Date(co.goodtil)
      if(gtil> this.state.today){
        this.getCtoken(this.state.ttoken, co)
      }else{
        if(co.role=='partner'){
          window.alert('contact Tim @ mckenna.tim@gmail.com to extend your access')
        }else{
          window.alert('Let your boss know that access has expired so that they can extend it')
        }
      }
    }
  }

  getCtoken=(token,co)=>{
    console.log('co: ', co)
    fetchCtoken(token,co)
      .then((res)=>{
        console.log('res: ', res)
        const isPartner = res.role=='partner' ? true : false
        setKeyVal({role:res.role, emailid:res.binfo.emailid, isPartner:isPartner})
        ls.setItem({email: res.binfo.emailid, firstday:res.firstday, token:res.token})
        location.replace('#urapps')
      })
  }  
  selectRender=(renderwhat)=>{
    // console.log('renderwhat: ', renderwhat)
    switch (renderwhat) {
      case 'message':
        console.log('in selectRender message')
        //console.log('this.renderMessage: ', this.renderMessage())
        return this.renderMessage()
      case 'goregister':
        return this.renderGoRegister()
      case 'coids':
        return this.renderCoids()
      case 'createcoid':
        return this.renderTryCoid()
      case 'nothing':
        return this.renderNothing()
      default:
        return (<h4>default</h4>);
    }
  }

  getCoidCk=()=>{
    const {newco,ttoken}=this.state
    const{coid}=newco.co
    const{emailid}=newco.person
    console.log('newco: ', newco)
    console.log('ttoken: ', ttoken)
    // console.log('Math.floor(Date.now())+30*(24*60*60*1000): ', new Date(Math.floor(Date.now())+30*(24*60*60*1000)).toLocaleDateString())
    postUniCoid({emailid, coid},ttoken)
    .then((res)=>{
      console.log('res: ', res)
      if(res.result){
        console.log('res.token: ', res.token)
        ls.setItem({email:res.emailid, token:res.token})
        this.setState({errorcoid:'', showbut:false, settingup:true})
      }else if(res.message=="coid already exists, try another"){
        this.setState({errorcoid:res.message, showbut:false})
      }
    })
  }

  startDemo=()=>{
    const {newco,ttoken}=this.state
    const{emailid}=newco.person
    console.log('ttoken: ', emailid, ttoken)
    // console.log('Math.floor(Date.now())+30*(24*60*60*1000): ', new Date(Math.floor(Date.now())+30*(24*60*60*1000)).toLocaleDateString())
    getDemoStart({emailid},ttoken)
    .then((res)=>{
      console.log('res: ', res)
      if(res.result){
        console.log('res: ', res)
        // console.log('res.token: ', res.token)
        ls.setItem({email:res.emailid, token:res.token})
        //this.setState({errorcoid:'', settingup:true})
        location='#urapps'
      }else if(res.message=="some kind of error"){
        this.setState({errorcoid:res.message})
      }
    })
  }

  ckIfFree=(coid)=>{
    if(/^[0-9]/.test(coid)){
      this.setState({errorcoid:'please start with a letter'})
    }else if(/[^A-Za-z0-9]+/g.test(coid)) {
      this.setState({errorcoid:'please avoid special chars'})
    }else if(/.{12,}/.test(coid)){
      this.setState({errorcoid:'please use less than 12 characters', showbut:false})
    }else if (coid.length>5 && !/.{12,}/.test(coid)){
      this.setState({errorcoid:'', showbut:true})
    }else{
      this.setState({errorcoid:'', showbut:false})
    }    
  }

  txtChanged = (newcoarr, field) => e =>{
    newcoarr.map((c)=>{
      let xx = this.props.newco[c]
      xx[field]=e.target.value
      this.ckIfFree(xx[field])
      this.props.xmitChange(c,xx);
    })
  }

  gotoApps=()=>{
    location = '#urapps'
  }

  addNew=(co)=>{
    console.log('co: ', co)
    console.log('ths.state.cos: ', this.state.cos)
    console.log('this.state.newco: ', this.state.newco)
    let nnewco = {...this.state.newco}
    nnewco.person=this.state.cos[0].emailid
    this.setState({newco:nnewco, shownew:true})
    // this.setState({shownew:true})
  }

  getLiStyle=(co)=>{
    const listyle = {
      li:{
        background: '#99CCCC',
        padding: '6px',
        overflow: 'hidden',
        border: 'solid 1px black'
      },
      divgt:{
        float:'right'
      },
      divbu:{
        float:'right'
      },
      message: 'co. enrolled til: ',
      showbut: false    
    }
    const gtil = new Date(co.goodtil)
    if(gtil< this.state.today){
      listyle.li.background='#ede8af'
      listyle.message = 'reg. expired on: '
      if(co.role=='partner'){
        listyle.showbut = true
      }
    }
    return listyle
  }

  gotoGetData=(codata)=>()=>{
    console.log('codata: ', codata)
    setKeyVal({codata:codata})
    location='#getdata'
  }

  renderCkBut=(showbut)=>{
    const { classes } = this.props;
    if(showbut){
      const buttext = showbut ? 'Signup if coid is available' : ''
      return(
        <Button
        variant="contained" 
        color="primary" 
        className={classes.button} 
        onClick={this.getCoidCk}>
          {buttext}
        </Button>
      )
    }else if(this.state.settingup){
      return(
        <div>
          <h4>hello</h4>
          <p>Ok setting you up with emailid = {this.state.newco.person} and coid = {this.state.newco.co.coid} until {this.state.newco.co.goodtil} At this point it would be good to add some more details about your <a href="#company">company</a> ; its name, adresss, overtime policy, workmen's comp and state unemployment rates. Next step after that would be to add people to your company using the persons app. Ther you can add your w4 details as well. Or you could just dive in and check out any of the apps. </p>
          
          <Button
          variant="contained" 
          color="primary" 
          className={classes.button} 
          onClick={this.gotoApps}>
            Go To Apps
          </Button>

        </div>
      )
    }

  }

  renderTryCoid=()=>{
    // console.log('this.state: ', this.state)
    // console.log('this.state.newco.person: ', this.state.newco.person)
    const {coid} = this.state.newco.co
    const emailid = this.state.newco.person
    // console.log('emailid: ', emailid)
    const { classes } = this.props;
    const{showbut}=this.state
    const renderckbut =  this.renderCkBut(showbut)
    return(
      <div>
        {!this.state.shownew && 
        <p>We have no record of this emailid on any machine as active in any company. Maybe your company removed its data from our servers. You are welcome to become a beta tester or to demo the system. </p>
        }
      <div className={classes.rootExp}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Run the DEMO</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <Button variant="outlined" onClick={this.startDemo}>Start the Demo</Button><br/><br/>
            Demo the system setup with populated with records over multiple quarters. You can add employees and jobs, fill in timecards, calculate paychecks and monthly taxes due and 941's. Demo sessions last for 20 minutes and then the data gets reset and you will need to re-register. 
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Create a Company</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
            <h5>Choose a Company ID</h5>
            <p>Enter a company id that starts with a letter and contains just letters and numbers, no spaces or special characters, at least 6 characters and less than 12. It just needs to be unique and identifiable by you, you won't need to remember it since your company is tied to your email id {emailid}</p> 
            <TextField
              id="standard-disabled"
              label="Email Id"
              value={emailid}
              className={classes.textField}
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              required
              id="standard-name"
              ref={this.myRef}
              label="Company Id"
              className={classes.textField}
              value={coid}
              helperText={this.state.errorcoid}
              error={this.state.errorcoid.length>0 ? true : false}
              onChange={this.txtChanged(['co'], 'coid')}
              margin="dense"
            /> 
            {renderckbut}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
      {/* <h4>Choose a Company ID</h4>
      <p>Enter a company id that starts with a letter and contains just letters and numbers, no spaces or special characters, at least 6 characters and less than 12. It just needs to be unique and identifiable by you, you won't need to remember it since your company is tied to your email id {emailid}</p> 
      <TextField
        id="standard-disabled"
        label="Email Id"
        value={emailid}
        className={classes.textField}
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        required
        id="standard-name"
        ref={this.myRef}
        label="Company Id"
        className={classes.textField}
        value={coid}
        helperText={this.state.errorcoid}
        error={this.state.errorcoid.length>0 ? true : false}
        onChange={this.txtChanged(['co'], 'coid')}
        margin="dense"
      />  */}

      </div>
    )
  }

  renderGoRegister=()=>{
    // const {coid} = this.state.newco.co
    // const {emailid} = this.state.newco.person
    // const { classes } = this.props;
    return(
      <div>
      <h4>Register or Find out more </h4>
      <p>There is no record of you on this device. Perhaps there was and your credentials expired. Could you hit <a href="#register">'register'</a>  to let this app know who you are? Are you new to this application? Press <a href="#about">'about'</a>  for a little more information about the on-boarding process. </p> 
      </div>
    )
  }

  renderNothing=()=>{
    return (
      <h1>nothing</h1>
    )
  }
  renderCoids=()=>{
    if (this.state.shownew){
      console.log('should shjow new')
      console.log('this.state: ', this.state)
      console.log('this.props: ', this.props)
    }
    if(this.state.cos){
    return(
      <div style={style.he}>
        <h4>You Are Registered  </h4>
        <span>You are registered on this app for multiple businesses. Select which on you want to be logged in to. This app will remeber your last business selection. To switch later, just <a href={cfg.url.authqry}>register</a> again then select another business</span>
        <h4>Select a business/org/entity </h4>
        <ul style={style.myli.ul}>
          {this.state.cos.map((co,i)=>{
            const listyle = this.getLiStyle(co)
            return(
            <li style={listyle.li} key={i} idx={i} onClick={this.clickCoid}>
              <span idx={i} style={{fontWeight:'bold'}}>{co.coid} </span>
              <span idx={i}>as {co.role}</span>
              {/* {listyle.showbut && ( */}
                <div style={listyle.divgt}>
                  <button onClick={this.gotoGetData(co)}>get data</button>
                </div>
              {/* )} */}
              <div idx={i} style={listyle.divgt}>{listyle.message} {moment(co.goodtil).format('MM/DD/YY hh:mmA')}</div>
            </li>
          )})}
        </ul>
        <button onClick={this.addNew}>run Demo or Create Company</button>
        {this.state.shownew  && this.renderTryCoid()}
      </div>
    )
   }
  }
  renderMessage=()=>{
    const {message} = this.state
    // console.log('this.state.message: ', this.state.message)
    if(this.state.message=='You are not authorized for this app for any active business'){
    //  console.log('render message ')
      ls.removeItem()
    }
    if (message=='authorized but unknown user in signup'){
      ls.removeItem()
    }
    return(
      <div>
        <h1>message</h1>"
        <p>{this.state.message}. So I guess I should delete the existing token and then who knows switch to signup
       </p>
      </div>
    )
  }

  render() {
    const{renderwhat}=this.state 
    // console.log('showbut: ', showbut)
    const renderthis = this.selectRender(renderwhat)
    // console.log('renderthis: ', renderthis)
    // const renderckbut =  this.renderCkBut(showbut)
    return (
      <div style={style.he}>
      <h4>in registered signup render </h4>
        {renderthis}
        {/* {renderckbut} */}
        
      </div>      
      );
  }
}

let chHOC = (Comp) =>{// eslint-disable-line no-unused-vars
  return class PP extends React.Component {
    constructor (props){
      super(props);
    }
    state={}
    static getDerivedStateFromProps(props, state){// eslint-disable-line no-unused-vars
      return {props}
    }
    handleXmitChange=(c,xx)=>{
      let nstate  ={...this.state}
      let nprops = {...nstate.props}
      let newco = {...nprops.newco}
      newco[c] = xx
      nprops.newco = newco
      this.setState({props:nprops})
    }
    render() {
      return (
        <Comp {...this.props} {...this.state} xmitChange={this.handleXmitChange}/>
      )
    }
  }  
}
Registered.propTypes = {
  classes: PropTypes.object.isRequired,
};
Registered = withStyles(styles)(Registered)
Registered = mapClass2Element(chHOC(Registered))

export {Registered }

const style = {
  he:{
    overflow:'hidden',
    padding: '6px',
    margin: '2px 10px 10px 10px',
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
      }
    },
  },
  myli :{
    od:{
      overflow:'hidden',
      width: '100%',
      border: '1px solid #ccc'
    },
    ul:{
      textAlign: 'left',
      listStyleType: 'none',
      padding:'0px'
    },
    li:{
      background: '#99CCCC',
      padding: '6px',
      overflow: 'hidden',
      border: 'solid 1px black'
    },
    idx:{
      float: 'left',
      width: '7%',
      padding: '5px'
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
    job:{
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

