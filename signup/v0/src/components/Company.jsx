import React from 'react';
// import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
import { postCompany, fetchCompany} from '../services/fetches';
import {setKeyVal} from '../actions/shared';
//import {setKeyVal} from '../actions/personacts';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';// eslint-disable-line no-unused-vars
import TextField from '@material-ui/core/TextField';// eslint-disable-line 
import Checkbox from '@material-ui/core/Checkbox';// eslint-disable-line no-unused-vars
import FormControlLabel from '@material-ui/core/FormControlLabel';// eslint-disable-line no-unused-vars
// import FormGroup from '@material-ui/core/FormGroup';// eslint-disable-line no-unused-vars
import FormControl from '@material-ui/core/FormControl';// eslint-disable-line no-unused-vars
import FormLabel from '@material-ui/core/FormLabel';// eslint-disable-line no-unused-vars
import Radio from '@material-ui/core/Radio';// eslint-disable-line no-unused-vars
import RadioGroup from '@material-ui/core/RadioGroup';// eslint-disable-line no-unused-vars
import Divider from '@material-ui/core/Divider';// eslint-disable-line no-unused-vars
var moment = require('moment');

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

class Company extends React.Component {
  //state = {newco:this.props.newco, newup:'update', qmes:''}

  componentDidMount() {
    //this.setState({newco:this.props.newco, hayqmes:false, qmes:''})
    //this.getTokdata()
    this.getCompany()
  }
  getCompany=()=>{
    fetchCompany()
    .then((res)=>{
      console.log('res: ', res)
      if(res.qmessage){
        this.setState({qmes:res.qmessage, hayqmes:true})
      }else if(res.binfo && res.binfo.role=='partner' ){
        setKeyVal({ispartner:true})
        //res.results.results.goodtil = res.results.results.goodtil.slpit('T')[0]
        res.results.goodtil = res.results.goodtil.split('T')[0]
        res.results.effective=moment().format('YYYY-MM-DD')
        this.setState({newco:res.results, qmes:''}, ()=>console.log('this.state: ', this.state))
      }
    })  
  }

  updateCompany=(e)=>{
    e.preventDefault()
    const{newco}= this.state 
    postCompany(newco)
      .then((res)=>{
        if(res.qmessage){
          this.setState({qmes:res.qmessage, hayqmes:true})
        }else {
          this.setState({isupdated:true})
        }        
      })
  }
  txtChanged = field => e =>{
    let newco= {...this.state.newco}
    console.log('e.target.value: ', e.target.value)
    newco[field] = e.target.value
    console.log('newco[field]: ', newco[field])
    console.log('field: ', field)
    this.setState({newco},()=>console.log('this.state: ', this.state))
  }
  numChanged = field => e =>{
    let val = e.target.value
    val= val.length==0 ? 0 : val
    let newco= {...this.state.newco}
    newco[field] = val
    this.setState({newco})
  }  

  render() { 
    const { classes } = this.props;
    if(this.state){
      const {qmes, newco} = this.state
      if(qmes.length==0){
        console.log('qmes: ', qmes.length)
      
        return (
          <div style={astyles.outer.div}>
          <form style={astyles.inner.div} className={classes.container} noValidate autoComplete="off">
            <TextField
              id="standard-disabled"
              label="Company Id (coid)"
              className={classes.textField300}
              value={newco.coid}
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            /> 
            <TextField
              id="standard-disabled"
              label="Enbrolled Until"
              className={classes.textField}
              value={newco.goodtil}
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              id="standard-name"
              label="Company Name"
              className={classes.textField}
              value={newco.name}
              onChange={this.txtChanged('name')}
              margin="dense"
            /> 
            <TextField
              id="standard-name"
              label="Street"
              className={classes.textField}
              value={newco.street}
              onChange={this.txtChanged('street')}
              margin="dense"
            /> 
            <TextField
              id="standard-name"
              label="City"
              className={classes.textField}
              value={newco.city}
              onChange={this.txtChanged('city')}
              margin="dense"
            />
            <TextField
              id="standard-name"
              label="State"
              className={classes.textField}
              value={newco.st}
              onChange={this.txtChanged('st')}
              margin="dense"
              helperText="use the 2 letter abbreviation"
            /> 
            <TextField
              id="standard-name"
              label="Zip"
              className={classes.textField}
              value={newco.zip}
              onChange={this.txtChanged('zip')}
              margin="dense"
            /> 
            <TextField
              id="standard-name"
              label="Federal EIN"
              className={classes.textField}
              value={newco.fedein}
              onChange={this.txtChanged('fedein')}
              margin="dense"
            /> 
            <TextField
              id="standard-name"
              label="State Ein"
              className={classes.textField}
              value={newco.stein}
              onChange={this.txtChanged('stein')}
              margin="dense"
            /> 
            <Divider/>
            <FormControl fullWidth component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Company Insurance Rates</FormLabel>
              <TextField
              id="standard-name"
              label="Workmens Comp Rate"
              className={classes.textField}
              value={newco.wcrate}
              onChange={this.numChanged('wcrate')}
              margin="dense"
              helperText="as decimal: .062 = 6.2%"
            /> 
            <TextField
              id="standard-name"
              label="Admin Comp Rate"
              className={classes.textField}
              value={newco.wcrateadmin}
              onChange={this.numChanged('wcrateadmin')}
              margin="dense"
              helperText="as decimal: .062 = 6.2%"
            /> 
            <TextField
              id="standard-name"
              label="SUTA Rate"
              className={classes.textField}
              value={newco.stuirate}
              onChange={this.numChanged('stuirate')}
              margin="dense"
              helperText="as decimal: .062 = 6.2%"
            /> 
            </FormControl>
            <TextField
              id="standard-name"
              label="Effective Date"
              className={classes.textField}
              type="date"
              value={newco.effective}
              onChange={this.txtChanged('effective')}
              margin="dense"
            />
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">First Day of Work Week or Payday</FormLabel>
              <RadioGroup
                aria-label="Marital Status"
                name="gender1"
                className={classes.group}
                value={newco.firstday.toString()}
                onChange={this.txtChanged('firstday')}
                row={true}
              >
              <FormControlLabel value="1" control={<Radio />} label="Monday" />
              <FormControlLabel value="2" control={<Radio />} label="Tuesday" />
              <FormControlLabel value="3" control={<Radio />} label="Wednesday"/> 
              <FormControlLabel value="4" control={<Radio />} label="Thursday" />
              <FormControlLabel checked value="5" control={<Radio />} label="Friday" />
              <FormControlLabel value="6" control={<Radio />} label="Saturday"/> 
              <FormControlLabel value="7" control={<Radio />} label="Sunday"/> 
              </RadioGroup>
            </FormControl> 
            <FormControl fullWidth component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Overtime Policy for Hourly Workers or Salary non-exempt</FormLabel>
              <TextField
              id="standard-name"
              label="Overtime Rate for over 40 hours"
              className={classes.textField}
              value={newco.otrate}
              onChange={this.txtChanged('otrate')}
              helperText="enter 1 for straight time"
              margin="dense"
            /> 
            <TextField
              id="standard-name"
              label="Saturday Special Rate"
              className={classes.textField}
              value={newco.sarate}
              onChange={this.txtChanged('sarate')}
              helperText="special pay rate for weekend, 1 if no special rate"
              margin="dense"
            /> 
            <TextField
              id="standard-name"
              label="Sunday Special Rate"
              className={classes.textField}
              value={newco.surate}
              onChange={this.txtChanged('surate')}
              helperText="special pay rate for weekend, 1 if no special rate"
              margin="dense"
            /> 
            </FormControl>
            <div style={astyles.inner.but}>
              <Button 
                variant="contained" 
                color="primary" 
                className={classes.button} 
                onClick={this.updateCompany}>
              Update Company
              </Button>
              {this.state.isupdated && 
              <i className="material-icons" style={{fontSize:'60px', color:'green'}}>done</i>
              }
            </div>
          </form>
          </div>
          );
        }else{
          return(
            <div>
              {qmes}
            </div>
          )
        }
      }else{
        return(
          <div>nothing</div>
        )
      }

  }
}

// let chHOC = (Comp) =>{// eslint-disable-line no-unused-vars
//   return class PP extends React.Component {
//     constructor (props){
//       super(props);
//     }
//     state={}
//     static getDerivedStateFromProps(props, state){// eslint-disable-line no-unused-vars
//       return {props}
//     }
//     handleXmitChange=(newco)=>{
//       console.log('newco: ', newco)
//       console.log('this.state: ', this.state)
//       let nstate  ={...this.state}
//       let nprops = {...nstate.props}
//       console.log('nprops: ', nprops)
//       //nprops.newco = newco
//       //this.setState({props:nprops})
//       //nstate.newco=newco
//       this.setState({newco:newco})
//     }
//     render() {
//       return (
//         <Comp {...this.props} {...this.state} xmitChange={this.handleXmitChange}/>
//       )
//     }
//   }  
// }
Company.propTypes = {
  classes: PropTypes.object.isRequired,
};
Company = withStyles(styles)(Company)
//Company = mapClass2Element(chHOC(Company))
Company = mapClass2Element(Company)



export {Company}

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
