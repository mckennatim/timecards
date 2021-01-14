import React from 'react';
var moment = require('moment');
import {makeHref} from '../utilities/getCfg'
import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
import { putPerson, deletePerson, obliteratePerson, fetchState } from '../services/fetches';
import {fetchTokdata} from '../services/fetches'
import {setKeyVal} from '../actions/personacts';
//import {setKeyVal} from '../actions/personacts';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';// eslint-disable-line no-unused-vars
import TextField from '@material-ui/core/TextField';// eslint-disable-line 
import Checkbox from '@material-ui/core/Checkbox';// eslint-disable-line no-unused-vars
import FormControlLabel from '@material-ui/core/FormControlLabel';// eslint-disable-line no-unused-vars
import FormGroup from '@material-ui/core/FormGroup';// eslint-disable-line no-unused-vars
import InputAdornment from '@material-ui/core/InputAdornment';// eslint-disable-line no-unused-vars
import FormLabel from '@material-ui/core/FormLabel';// eslint-disable-line no-unused-vars
import Radio from '@material-ui/core/Radio';// eslint-disable-line no-unused-vars
import RadioGroup from '@material-ui/core/RadioGroup';// eslint-disable-line no-unused-vars
import InputLabel from '@material-ui/core/InputLabel';// eslint-disable-line no-unused-vars
import MenuItem from '@material-ui/core/MenuItem';// eslint-disable-line no-unused-vars
import FormControl from '@material-ui/core/FormControl';// eslint-disable-line no-unused-vars
import Select from '@material-ui/core/Select';// eslint-disable-line no-unused-vars



const styles = theme => ({
  flexForm:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
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
  formControl: {
    margin: theme.spacing.unit * 3,
    minWidth: 200,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class AddPerson extends React.Component {
  state = {
    eperson:this.props.eperson, 
    newup:'update', 
    istokdata:true,
    haylocal:false,
    localities:[]
  }

  componentDidMount() {
    this.setState({eperson:this.props.eperson})
    this.getTokdata()
  }

  getTokdata=()=>{
    fetchTokdata()
    .then((res)=>{
      console.log('res: ', res)
      if(res.qmessage){
        this.setState({istokdata:false})
      }
      const isPartner = res.binfo.role=='partner' ? true : false
      setKeyVal({role:res.binfo.role, emailid:res.binfo.emailid, isPartner:isPartner})
    })  
  }

  updatePerson=(e)=>{
    e.preventDefault()
    const curperson = {...this.props.eperson.curperson}
    console.log('curperson: ', curperson)
    putPerson(curperson)
    router.navigate('/persons?rerender')
  }
  makeToday =()=>{
    let curperson= this.props.eperson.curperson
    console.log('curperson: ', curperson)
    curperson.effective=moment().format('YYYY-MM-DD')
    this.props.xmitChange({curperson:curperson});
  }

  ck4local = (st)=>{
    fetchState(st)
    .then((res)=>{
      console.log('res: ', res)
      const ratesobj = JSON.parse(res[0].ratesobj)
      console.log('ratesobj: ', ratesobj)
      if(ratesobj && ratesobj.local && ratesobj.local.length>0){
        const localities = ratesobj.local.map((l)=>l.locality)
        this.setState({haylocal:true, localities})
      }
    })
  }

  stateChanged = field => e =>{
    let st = e.target.value.toUpperCase()
    if (st.length==2){
      console.log('check4local')
      this.ck4local(st)
    }
    let curperson= this.props.eperson.curperson
    curperson[field] = st
    this.props.xmitChange({curperson:curperson})
  }

  txtChanged = field => e =>{
    console.log('txtChanged')
    console.log('field, e: ', field, e.target.value)
    let curperson= this.props.eperson.curperson
    curperson[field] = e.target.value
    this.props.xmitChange({curperson:curperson});
  } 
  numChanged = field => e =>{
    let curperson= this.props.eperson.curperson
    let val = e.target.value
    //val= val.length==0 ? 0 : val
    curperson[field] = val
    this.props.xmitChange({curperson:curperson});
  } 
  ckChanged = field => e =>{
    let curperson= this.props.eperson.curperson
    curperson[field] = e.target.checked
    this.props.xmitChange({curperson:curperson});
  } 

  catChanged =(e)=>{
    let curperson= this.props.eperson.curperson
    curperson.categories = e.target.value
    this.props.xmitChange({curperson:curperson});
  }
  delPerson=()=>{
    const {curperson} = this.props.eperson
    const drec = {emailid:curperson.emailid, effective:curperson.effective}
    console.log('drec: ', drec)
    deletePerson(drec)
      .then((res)=>{
        console.log('res: ', res)
        if(res.message=='person deleted for effective data'){
          router.navigate('/persons?rerender');
        }else{
          const{role,emailid, curperson}=this.props.eperson
          console.log('else last man standing')
          console.log('role: ', role, )
          console.log('this.props.eperson.curperson: ', this.props)
          console.log('wtf')
          if(curperson.role== 'partner' && emailid==curperson.emailid){
            let mess = 'Deleting yourself puts you out of the company completely. Only another partner can let you back in. Click OK to completely lose your access or CANCEL if you would like to stay'
            if(window.confirm(mess)){
              console.log('BYE BYE. See you partner')
              obliteratePerson(drec)
                .then(()=>{
                  router.navigate('/persons?rerender');
                })
            }else{
              console.log('Still here')
            }
          }else if(curperson.role== 'partner' && curperson.emailid!=emailid){
            let mess = 'Partners can only be deleted by themselves. Talk to your partner'
            window.alert(mess)
          }else{
            let mess='You are attempting to delete the last of the effective date records for this person. Deleting will wipe this person off your personel records. Consider editing this record to make the person "inactive". That will preserve basic info like name address and w4 entries, allowing you to produce W2 or 1099 forms at the end of the year. Inactive workers can no longer log in to the system. Press OK to permanently delete. Oterwise CANCEL then modify the "active" field' 
            if(window.confirm(mess)){
              console.log('BYE BYE person')
              obliteratePerson(drec)
                .then(()=>{
                  router.navigate('/persons?rerender');
                })              
            }else{
              console.log('Maybe just make inactive')
            }
          }
        }
      })
  }

  render() { 
    if(this.state.istokdata){
    const { classes } = this.props;
    const{curperson, update, isPartner}=this.props.eperson
    const newup = update ? 'udpate' : 'new'
    const{localities, haylocal}= this.state
    return (
      <div style={astyles.outer.div}>
      <form style={astyles.inner.div} className={classes.container} noValidate autoComplete="off">
        <TextField
          required
          id="standard-name"
          label="Email Id"
          className={classes.textField300}
          value={curperson.emailid}
          onChange={this.txtChanged('emailid')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="First Middle"
          className={classes.textField}
          value={curperson.firstmid}
          onChange={this.txtChanged('firstmid')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Last Name"
          className={classes.textField}
          value={curperson.lastname}
          onChange={this.txtChanged('lastname')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Street"
          className={classes.textField}
          value={curperson.street}
          onChange={this.txtChanged('street')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="City"
          className={classes.textField}
          value={curperson.city}
          onChange={this.txtChanged('city')}
          margin="dense"
        />
        <TextField
          required
          id="standard-name"
          label="St"
          className={classes.textField}
          value={curperson.st}
          onChange={this.stateChanged('st')}
          helperText='use the 2 letter abreviation'
          margin="dense"
        /> 
        {haylocal && 
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Locality</InputLabel>
            <Select
              value={curperson.locality}
              onChange={this.txtChanged('locality')}
              inputProps={{
                name: 'locality',
                id: 'locality-simple',
              }}
            > 
              {localities.map((l,i)=>
                <MenuItem key={i} value={l}>{l}</MenuItem>
                )}
            </Select>
          </FormControl>
        }
        <TextField
          id="standard-name"
          label="Zip"
          className={classes.textField}
          value={curperson.zip}
          onChange={this.txtChanged('zip')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Phone"
          className={classes.textField}
          value={curperson.phone}
          onChange={this.txtChanged('phone')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Emergency Person"
          className={classes.textField}
          value={curperson.emerperson}
          onChange={this.txtChanged('emerperson')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Emergency Phone"
          className={classes.textField}
          value={curperson.emerphone}
          onChange={this.txtChanged('emerphone')}
          margin="dense"
        /> 
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel required component="legend">Role</FormLabel>
          <RadioGroup
            aria-label="Role"
            name="gender1"
            className={classes.group}
            value={curperson.role}
            onChange={this.txtChanged('role')}
            row={true}
          >
          <FormControlLabel disabled={!isPartner} value="partner" control={<Radio />} label="Partner" />
          <FormControlLabel value="hr" control={<Radio />} label="H.R." />
          <FormControlLabel value="super" control={<Radio />} label="Super" />
          <FormControlLabel value="worker" control={<Radio />} label="Worker"/> <FormControlLabel value="clerk" control={<Radio />} label="Clerk"/>
          <FormControlLabel
            control={
              <Checkbox
              checked={curperson.active==1 ? true : false}
              onChange={this.ckChanged('active')}
              value="active"
              />
            }
            label='Active'
          />
          </RadioGroup>
        </FormControl>
        <div style={astyles.inner.but}>
          <Button 
            size="small"
            variant="contained" 
            color="primary" 
            className={classes.button} 
            onClick={this.makeToday}>
          Make Effective Today
          </Button>
        </div>
        <TextField
          id="standard-name"
          label="Effective Date"
          className={classes.textField}
          type="date"
          value={curperson.effective}
          onChange={this.txtChanged('effective')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Hourly Rate or Yearly Salary: $"
          className={classes.textField}
          type="number"
          inputProps={{ min: "15", max: "100", step: "0.25" }}
          value={curperson.rate}
          onChange={this.txtChanged('rate')}
          margin="dense"
          InputProps={{
            startAdornment:<InputAdornment position="start">$</InputAdornment>,
          }}
        /> 
        <TextField
          id="standard-name"
          label="ssn"
          className={classes.textField}
          value={curperson.ssn}
          onChange={this.txtChanged('ssn')}
          margin="dense"
        /> 
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel required component="legend">Worker Type</FormLabel>
          <RadioGroup
            aria-label="Role"
            name="gender1"
            className={classes.group}
            value={curperson.wtype}
            onChange={this.txtChanged('wtype')}
            row={true}
          >
          <FormControlLabel value="hourly" control={<Radio />} label="Hourly" />
          <FormControlLabel value="salary" control={<Radio />} label="Salary" />
          <FormControlLabel value="salaryne" control={<Radio />} label="Salary non-exempt" />
          <FormControlLabel value="1099" control={<Radio />} label="1099"/> 
          {curperson.role=='partner' && 
          <FormControlLabel value="base" control={<Radio />} label="Base Pay"/>        
          }       
          </RadioGroup>
        </FormControl >
        {curperson.wtype!='1099' && <div>
          {curperson.wtype=='base' && <div>
          <TextField
          id="standard-name"
          label="Weekly Base Pay"
          className={classes.textField}
          type="number"
          value={curperson.weeklybase}
          helperText="< $10000"
          onChange={this.txtChanged('weeklybase')}
          InputProps={{
            startAdornment:<InputAdornment position="start">$</InputAdornment>,
          }}          
          margin="dense"
        />             
          </div>}
        <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">State/Local Witholding</FormLabel>   
        <FormControlLabel
            control={
              <Checkbox
              checked={curperson.haystatewh==1 ? true : false}
              onChange={this.ckChanged('haystatewh')}
              value="haystatewh"
              />
            }
            label='State wh'
          />
          <FormControlLabel
            control={
              <Checkbox
              checked={curperson.haylocalwh==1 ? true : false}
              onChange={this.ckChanged('haylocalwh')}
              value="haylocalwh"
              />
            }
            label='Local wh'
          />  
          
        <TextField
          id="standard-name"
          label="Fed W4 Allowance"
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "15"}}
          value={curperson.w4allow}
          onChange={this.numChanged('w4allow')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Fed Additional Withhold."
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "15"}}
          value={curperson.w4add}
          onChange={this.numChanged('w4add')}
          margin="dense"
          InputProps={{
            startAdornment:<InputAdornment position="start">$</InputAdornment>,
          }}
        />
        {curperson.haystatewh && <div>
        <TextField
          id="standard-name"
          label="State W4 Allowance"
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "10"}}
          value={curperson.stallow}
          onChange={this.numChanged('stallow')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="State Additional Withhold."
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "10"}}
          value={curperson.stadd}
          onChange={this.numChanged('stadd')}
          margin="dense"
          InputProps={{
            startAdornment:<InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          id="standard-name"
          label="Blind/Deaf you and/or spouse"
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "4"}}
          value={curperson.stblind}
          onChange={this.numChanged('stblind')}
          margin="dense"
        />
        </div> } 
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}> 
        <FormLabel component="legend">Fed</FormLabel>
        <FormControlLabel
            control={
              <Checkbox
              checked={curperson.w4exempt==1 ? true : false}
              onChange={this.ckChanged('w4exempt')}
              value="w4exempt"
              />
            }
            label='W4 Exempt'
          />
          {curperson.haystatewh && <div>
          <FormLabel component="legend">State</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
              checked={curperson.student==1 ? true : false}
              onChange={this.ckChanged('student')}
              value="student"
              />
            }
            label='Student'
          />
          <FormControlLabel
            control={
              <Checkbox
              checked={curperson.sthoh==1 ? true : false}
              onChange={this.ckChanged('sthoh')}
              value="sthoh"
              />
            }
            label='Head of Household'
          />
          </div>}
        </FormControl> 
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Marital Status</FormLabel>
          <RadioGroup
            aria-label="Marital Status"
            name="gender1"
            className={classes.group}
            value={curperson.marital}
            onChange={this.txtChanged('marital')}
            row={true}
          >
          <FormControlLabel value="single" control={<Radio />} label="Single" />
          <FormControlLabel value="married" control={<Radio />} label="Married" />
          <FormControlLabel value="marASsingl" control={<Radio />} label="Married As Single"/> 
          </RadioGroup>
        </FormControl>
        <FormControl className={classes.flexForm}>
          <FormLabel component="legend">Deductions per month </FormLabel>
          <FormControl className={classes.formControl}>
            <FormLabel component="legend">Health Insurance </FormLabel>         
            <TextField
                id="standard-name"
                label="Employee contribution"
                className={classes.textField}
                type="number"
                value={curperson.healthemp}
                onChange={this.numChanged('healthemp')}
                margin="dense"
                InputProps={{
                  startAdornment:<InputAdornment position="start">$</InputAdornment>,
                }}
              /> 
              <TextField
                id="standard-name"
                label="Company contribution"
                className={classes.textField}
                type="number"
                value={curperson.healthco}
                onChange={this.numChanged('healthco')}
                margin="dense"
                InputProps={{
                  startAdornment:<InputAdornment position="start">$</InputAdornment>,
                }}
              /> 
        </FormControl> 
        <FormControl  className={classes.formControl}>
            <FormLabel component="legend">401K </FormLabel>         
            <TextField
                id="standard-name"
                label="Employee contribution"
                className={classes.textField}
                type="number"
                value={curperson.k401emp}
                onChange={this.numChanged('k401emp')}
                margin="dense"
                InputProps={{
                  startAdornment:<InputAdornment position="start">$</InputAdornment>,
                }}
              /> 
              <TextField
                id="standard-name"
                label="Company contribution"
                className={classes.textField}
                type="number"
                value={curperson.k401co}
                onChange={this.numChanged('k401co')}
                margin="dense"
                InputProps={{
                  startAdornment:<InputAdornment position="start">$</InputAdornment>,
                }}
              /> 
        </FormControl>       
      </FormControl>             
      <FormControl className={classes.flexForm}>
        <FormLabel component="legend">Benefits: Days/Yr </FormLabel>
          <TextField
              id="standard-name"
              label="Vacation"
              className={classes.textField}
              type="number"
              value={curperson.vacation}
              onChange={this.numChanged('vacation')}
              margin="dense"
            /> 
            <TextField
              id="standard-name"
              label="Holiday"
              className={classes.textField}
              type="tel"
              value={curperson.holiday}
              onChange={this.numChanged('holiday')}
              margin="dense"
            />
            <TextField
              id="standard-name"
              label="Personal"
              className={classes.textField}
              type="tel"
              value={curperson.personal}
              onChange={this.numChanged('personal')}
              margin="dense"
            />  
    </FormControl>  
    </div> } 
        <div style={astyles.inner.but}>
          <Button 
            variant="contained" 
            color="primary" 
            className={classes.button} 
            onClick={this.updatePerson}>
          {newup}
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            className={classes.button} 
            onClick={this.delPerson}>
          delete
          </Button>
        </div>
       </form>
      </div>
      );
    }else{
      return(
        <div style={astyles.outer.div}>
          <p>Your registration data is not here. The link below will take you home where you will be asked to re-register. This will take you to a list of apps you can use in your company. If you are registered in more than one company, you can choose your company first. <a href={makeHref(location.hostname, 'signup', '#urapps')} >HOME</a></p> 
          
        </div>
      )
    }
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
    handleXmitChange=(curperson)=>{
      let nstate  ={...this.state}
      let nprops = {...nstate.props}
      let neperson = {...nprops.eperson}
      neperson.curperson = curperson
      nprops.eperson = neperson
      this.setState({props:nprops})
    }
    render() {
      return (
        <Comp {...this.props} {...this.state} xmitChange={this.handleXmitChange}/>
      )
    }
  }  
}
AddPerson.propTypes = {
  classes: PropTypes.object.isRequired,
};
AddPerson = withStyles(styles)(AddPerson)
AddPerson = mapClass2Element(chHOC(AddPerson))



export {AddPerson}

const astyles= {
  outer:{
    div:{
      overflow:'hidden',
      background: 'silver'   
    }
  },
  inner:{
    div:{
      width: '98%',
      padding: '5px',
    },
    but:{
      width: '98%'
    }
  }
}
