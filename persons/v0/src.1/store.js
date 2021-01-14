var moment = require('moment');
import {Home} from './components'

const blankperson ={
  emailid:'',
  firstmid:'',
  lastname: '',
  street: '',
  city: '',
  st:'',
  zip: '',
  role:'',
  active:true,
  rate: 15.00,
  ssn:'',
  wtype: '1099',
  haystatewh: 1,
  haylocalwh: 0,
  w4allow: 1,
  w4add: 0,
  marital: '',
  w4exempt: '',
  stallow:'',
  stadd: '',
  sthoh: '',
  stblind: '',
  student: '',
  healthemp: '',
  healthco: '',
  vacation: '',
  holiday: '',
  personal: '',
  effective: moment().format('YYYY-MM-DD')
}

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
    curperson: blankperson,
    update: true
  }
};

const initialBrowser = () => {
  let ws = window.innerWidth
  let devInfo ={
    types: ['watch', 'phone', 'phoneL', 'tablet', 'tabletL', 'laptop', 'monitor'],
    sizes: [300, 500, 600, 800, 900, 1800, 3000],
    browser: '',
    size: ws
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
export {initState, blankperson}
