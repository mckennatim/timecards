import React from 'react'// eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';// eslint-disable-line no-unused-vars
import Toolbar from '@material-ui/core/Toolbar';// eslint-disable-line no-unused-vars
import Typography from '@material-ui/core/Typography';// eslint-disable-line no-unused-vars
import IconButton from '@material-ui/core/IconButton';// eslint-disable-line no-unused-vars
import MenuIcon from '@material-ui/icons/Menu';// eslint-disable-line no-unused-vars
import AccountCircle from '@material-ui/icons/AccountCircle';// eslint-disable-line no-unused-vars
import Select from '@material-ui/core/Select';// eslint-disable-line no-unused-vars
import MenuItem from '@material-ui/core/MenuItem';// eslint-disable-line no-unused-vars
import Menu from '@material-ui/core/Menu';// eslint-disable-line no-unused-vars
import Paper from '@material-ui/core/Paper';// eslint-disable-line no-unused-vars
import Grid from '@material-ui/core/Grid';// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {ls, cfg} from '../utilities/getCfg'

const styles = theme=>({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Splash extends React.Component{
  active='mabibi'
  state={isreg:false,anchorEl: null}
  componentDidMount(){
    this.getActive()
  }  
  getActive(){
    console.log('dog')
    console.log('ls.getItem(): ', ls.getItem())
    if(ls.getItem()){
      this.setState({isreg:true})
    }
  }

  gotoUrApps=()=>{
    location='#urapps'
  }
  
  goSignUp=()=>{
    location='#about'
  }
  goDemo=()=>{
    location='#aboutdemo'
  }

  goRegister=()=>{
    location=cfg.url.authqry
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (e) => {
    const selected = e.target.getAttribute('value')
    console.log('selected: ', selected)
    switch (selected) {
      case 'urapps':
        location='#urapps'
        break;
      case 'newc':
        const ans = window.confirm('Adding a company requires you to re-register. You will see your existing companies and be given an opportunity to add one (up to a certain maximum number)')
        console.log('ans: ', ans)
        if(ans){
          location=cfg.url.authqry
        }
        break;
      case 'logout':
        ls.removeItem()
        this.setState({isreg:false})
        break;
      
      default:
        break;
    }
    this.setState({ anchorEl: null });
  };

  renderGoTo=()=>{
    const {isreg}=this.state
    if(isreg){
      return(
      <div>
        <button onClick={this.gotoUrApps}>this machine is registered,go to your apps</button>
        <br/>
        <button onClick={this.goDemo}>run the Demo System</button><br/><br/>
        <button onClick={this.goSignUp}>add another company</button><br/><br/>
      </div>
      )
    }else{
      return(
        <div>
        <button onClick={this.goSignUp}>be a Beta Tester</button><br/><br/>
        <button onClick={this.goDemo}>run the Demo System</button><br/><br/>
        <button onClick={this.goRegister}>already registered, just not on this machine</button><br/>

        </div>
     )      
    }
  }

  render(){
    const rendergoto = this.renderGoTo()
    const {anchorEl, isreg}= this.state
    const open = Boolean(anchorEl);
    const { classes } = this.props;
    return(
      <div style={style.outer}>
      <div className={classes.root}>
        <AppBar position="static" style={style.appbar}>
          <Toolbar>
            {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton> */}
            <Typography variant="title" color="inherit" className={classes.grow}>
              JobCost PayTime
            </Typography>
            {isreg && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                    <MenuItem value={'urapps'} onClick={this.handleClose}>My Apps</MenuItem>
                    <MenuItem value={'newc'} onClick={this.handleClose}>Add Company</MenuItem>
                    <MenuItem value={'logout'} onClick={this.handleClose}>Logout</MenuItem>
                    <MenuItem value={'getData'} onClick={this.handleClose}>Get My Data</MenuItem>
                </Menu>
              </div>
            )}
            {!isreg &&(
              <span onClick={this.goRegister}>Login</span>
            )}
          </Toolbar>
        </AppBar>     
      </div> 
      {/* <div>
        <div>
        <img src='img/screen1a.png' alt={'a'} width='50%'/> 
        </div>
        <div>
        <img src='img/screen2c.png' alt={'b'} width='50%'/> 
        </div>
      </div> */}
      <div style={style.container}>
        <div style={style.content}>
          <img src='img/screen1a.png' alt={'a'} style={style.img}/> 
        </div>
        <div style={style.content}>
          <img src='img/screen2c.png' alt={'b'} style={style.img}/> 
        </div>
        <div style={style.content2}>
          <div style={style.outer} >
          <h3> JobCost-PayTime suite</h3>
            <h4>Easy timecard and jobcost entry in the field</h4>
            <p>Mobile first design for quick data entry on phones tablet or laptop. Continuous updating to server every time you punch in or out.</p> 
            <h4>Payroll, Monthly and 941 Withholding</h4>
            <p>Accrued taxes and benefits reporting each pay period.</p>
            <h4>You own your data</h4>
            <p>You can delete from our servers or make a copy any time. Company info and personnel files are always available to you as are all general ledger journal entries</p>
            <h4>Jobcost Reporting</h4>
            <p>Labor costs for all jobs and categories within jobs are updated each week when you run payroll. See up to the minute reports on job cost labor vs estimate/contract labor with all employer witholding, insurance and benefit costs factored in.</p>
        </div>

          </div>
        <div style={style.content}>
          <h2>Try it Now</h2>
          <span>Beta testing is just starting. Eventually it will cost something maybe in the area of $50-$60/ month for a small business with under 10 people getting paid.</span><br/>
          {rendergoto}
        </div>
      </div>
      </div>
    )
  }
}

Splash.propTypes = {
  classes: PropTypes.object.isRequired,
};

Splash = withStyles(styles)(Splash)

Splash = mapClass2Element(Splash)

export {Splash}

const style = {
  outer:{
    background: '#99CCFF',
    overflow:'hidden',
    // padding: '4px',
    // margin: '2px 10px 10px 10px'
  },
  img:{
    // margin: '6px',
    // border: '6px solid #99CCFF',
    width: '100%'
  },
  appbar:{
    background: '#464E8C',
    color:'black'
  },  
  container:{
    background: '#CCCCCC',
    display: 'flex',
    flexDirection: 'row', /* generally better */
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'stretch',
    alignItems: 'stretch'
  },
  content:{
    padding: '8px',
    minHeight:'200px',
    background: '#99CCFF',
    flexGrow: 1,
    flexShrink: 1, /*can shrink from 300px*/
    flexBasis: '225px'  
  },
  content2:{
    padding: '8px',
    minHeight:'200px',
    background: '#99CCFF',
    flexGrow: 2,
    flexShrink: 1, /*can shrink from 300px*/
    flexBasis: '450px'  
  }
}