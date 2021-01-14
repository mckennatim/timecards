import React from 'react';
import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
import { putPerson, deletePerson } from '../services/fetches';
import {fetchTokdata} from '../../../../common/v0/src/services/fetches'
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
import FormControl from '@material-ui/core/FormControl';// eslint-disable-line no-unused-vars
import FormLabel from '@material-ui/core/FormLabel';// eslint-disable-line no-unused-vars
import Radio from '@material-ui/core/Radio';// eslint-disable-line no-unused-vars
import RadioGroup from '@material-ui/core/RadioGroup';// eslint-disable-line no-unused-vars



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
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class AddPerson extends React.Component {
  state = {eperson:this.props.eperson, newup:'update'}

  componentDidMount() {
    this.setState({eperson:this.props.eperson})
    this.getTokdata()
  }

  getTokdata=()=>{
    fetchTokdata()
    .then((res)=>{
      console.log('res: ', res)
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
  txtChanged = field => e =>{
    let curperson= this.props.eperson.curperson
    curperson[field] = e.target.value
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
    router.navigate('/persons?rerender');
  }

  render() { 
    const { classes } = this.props;
    const{curperson, update, isPartner}=this.props.eperson
    const newup = update ? 'udpate' : 'new'
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
          id="standard-name"
          label="St"
          className={classes.textField}
          value={curperson.st}
          onChange={this.txtChanged('st')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Zip"
          className={classes.textField}
          value={curperson.zip}
          onChange={this.txtChanged('zip')}
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
          <FormControlLabel disabled={!isPartner} value="hourly" control={<Radio />} label="Hourly" />
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
          onChange={this.txtChanged('w4allow')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Fed Additional Withhold."
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "15"}}
          value={curperson.w4add}
          onChange={this.txtChanged('w4add')}
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
          inputProps={{ min: "0", max: "15"}}
          value={curperson.stallow}
          onChange={this.txtChanged('stallow')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="State Additional Withhold."
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "15"}}
          value={curperson.stadd}
          onChange={this.txtChanged('stadd')}
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
          onChange={this.txtChanged('stblind')}
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
                onChange={this.txtChanged('healthemp')}
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
                onChange={this.txtChanged('healthco')}
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
                onChange={this.txtChanged('k401emp')}
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
                onChange={this.txtChanged('k401co')}
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
              onChange={this.txtChanged('vacation')}
              margin="dense"
            /> 
            <TextField
              id="standard-name"
              label="Holiday"
              className={classes.textField}
              type="number"
              value={curperson.holiday}
              onChange={this.txtChanged('holiday')}
              margin="dense"
            />
            <TextField
              id="standard-name"
              label="Personal"
              className={classes.textField}
              type="number"
              value={curperson.personal}
              onChange={this.txtChanged('personal')}
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
