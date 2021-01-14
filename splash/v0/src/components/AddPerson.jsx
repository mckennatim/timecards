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
import FormControl from '@material-ui/core/FormControl';// eslint-disable-line no-unused-vars
import FormLabel from '@material-ui/core/FormLabel';// eslint-disable-line no-unused-vars
import Radio from '@material-ui/core/Radio';// eslint-disable-line no-unused-vars
import RadioGroup from '@material-ui/core/RadioGroup';// eslint-disable-line no-unused-vars



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
    console.log('this.props.eperson.curperson: ', this.props.eperson.curperson)
    const curperson = {...this.props.eperson.curperson}
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
          label="Rate: $"
          className={classes.textField}
          type="number"
          inputProps={{ min: "15", max: "100", step: "0.25" }}
          value={curperson.rate}
          onChange={this.txtChanged('rate')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="ssn"
          className={classes.textField}
          value={curperson.ssn}
          onChange={this.txtChanged('ssn')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="W4 Allow."
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "15"}}
          value={curperson.w4allow}
          onChange={this.txtChanged('w4allow')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="St. Allow."
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "15"}}
          value={curperson.stallow}
          onChange={this.txtChanged('stallow')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="St. Add.."
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "15"}}
          value={curperson.stadd}
          onChange={this.txtChanged('stadd')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Fed. Add."
          className={classes.textField}
          type="number"
          inputProps={{ min: "0", max: "15"}}
          value={curperson.w4add}
          onChange={this.txtChanged('w4add')}
          margin="dense"
        /> 
        <FormControl> 
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
          <FormControlLabel
            control={
              <Checkbox
              checked={curperson.stblind==1 ? true : false}
              onChange={this.ckChanged('stblind')}
              value="stblind"
              />
            }
            label='Blind'
          />          
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
