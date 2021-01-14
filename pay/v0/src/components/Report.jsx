import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {Taxes} from './Taxes.jsx'// eslint-disable-line no-unused-vars
import {JobCosts} from './JobCosts.jsx'// eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';// eslint-disable-line no-unused-vars
import Tabs from '@material-ui/core/Tabs';// eslint-disable-line no-unused-vars
import Tab from '@material-ui/core/Tab';// eslint-disable-line no-unused-vars
import Typography from '@material-ui/core/Typography';// eslint-disable-line no-unused-vars

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class Report extends React.Component{
  state = {
    value: 0,
  };
  active='mabibi'

  componentDidMount=()=>{
    this.getQuery()
  }  

  handleChange = (event, value) => {
    const loc = location.href.split('?')[0]
    console.log('hash: ', location.hash)
    console.log('value: ', value)
    if(value==0){
      location = loc+'?taxes'
    }else if (value==1){
      location = loc+'?jobcosts'
    }

    //this.setState({ value });
  };
  
  getQuery=()=>{
    const {params}= this.props.cambio.page
    if(params && params.query){
      const{query}=params
      if(query=='jobcosts'){
        this.setState({value:1})
      }else if(query=='taxes'){
        this.setState({value:0})
      }
    }
  }


  render=()=>{
    const { classes, cambio } = this.props;
    const{params}=cambio.page
    let { value } = this.state;
    if(params && params.query){
      const{query}= params
      if(query=='jobcosts'){
        value=1
      }else if(query=='taxes'){
        value=0
      }
    }
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Taxes" />
            <Tab label="JobCosts" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><Taxes/></TabContainer>}
        {value === 1 && <TabContainer><JobCosts/></TabContainer>}
      </div>
    );
  }
}

Report = withStyles(styles, { withTheme: true })(Report)
Report = mapClass2Element(Report)

export {Report}

// const style = {
//   he:{
//     overflow:'hidden',
//     margin: '2px 10px 10px 10px',
//     padding: '4px',
//     background: '#C4A265'
//   }
// }