import React from 'react'// eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import {routing} from './routing'
import {App} from './components'// eslint-disable-line no-unused-vars
import { createStore } from './rxred';
import { log } from './utilities/wfuncs';
import {initState} from './store'
//import {setDeviceType, setFocus} from './actions/responsive'
import {setDeviceType, setIsMobile} from './actions/responsive'

window.onblur = ()=>{
    //setFocus({infocus: false})
}



Observable.fromEvent(window, 'resize')
  .debounceTime(300)
  .subscribe(()=>setDeviceType(window.innerWidth));

const container = document.getElementById('app');
createStore(initState)
  .do(log)
  .subscribe((state) =>{
    return ReactDOM.render(<App {...state} />, container)
  });
  ckIsMobile()

var router=routing()

export{router}

function ckIsMobile(){

  const os = getMobileOperatingSystem() 
  let mobile=false
  if(os=='Android'){
    mobile=true
  }
  setIsMobile(mobile)
}


/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}