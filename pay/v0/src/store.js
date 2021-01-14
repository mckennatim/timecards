//var moment = require('moment');
import {Home} from './components'

// const blankperson ={
//   check:false,
//   emailid:'',
//   firstmid:'',
//   lastname: '',
//   street: '',
//   city: '',
//   st:'',
//   zip: '',
//   role:'',
//   rate: 15.00,
//   ssn:'',
//   w4allow: '',
//   stallow:'',
//   active:true,
//   effective: moment().format('YYYY-MM-D')
// }

const initState = {
  test: {
    name: 'Harry',
    rtpg: Home,
    users: ['doggy', 'freddy', 'timmy', 'kelly', 'brian' , 'david', 'colleen', 'megan', 'shaun', 'erin', 'doggy', 'freddy', 'timmy', 'kelly', 'brian' , 'david', 'colleen', 'megan', 'shaun', 'erin' ]
  },
  cambio: {
    infocus: true,
    page: {name: 'Home', params: null}
  },
  eperson: {
    //curperson: blankperson,
    update: true
  },
  help:{
    allhelp:[]
  }
};

const initialBrowser = () => {
  let ws = window.innerWidth
  let devInfo ={
    types: ['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop', 'monitor'],
    sizes: [300, 500, 600, 800, 900, 1800, 3000],
    browser: '',
    size: ws,
    pages: ['Help']
  }
  var typeIdx
  devInfo.sizes.reduce((t, n, i)=>{
    if(t<ws&&ws<=n){typeIdx = i}
    return n
  },0);
  devInfo.browser = devInfo.types[typeIdx]
  return devInfo
}

initState.responsive = initialBrowser()
export {initState}
