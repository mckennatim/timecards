import { actionCreator } from '../rxred';
import {ls, cfg} from '../utilities/getCfg'
import {geta} from '../utilities/wfuncs'
import { Observable } from 'rxjs';

const setKeyVal = actionCreator((payload) => {
  return {
    type: 'SET_KEY_VAL',
    payload
  }
});

const getHelp = actionCreator((payload) => {
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    return{
      type: 'HELP_LOADING',
      payload: Observable.ajax({
        url : cfg.url.api+'/common/help/'+payload,
        headers: {'Authorization': 'Bearer '+ lsh['token']}
      })
      .map((xhr)=>xhr.response)
      .map((resp)=>{
        console.log('resp: ', resp)
        return({
          type:'HELP_LOADED',
          payload: resp.results
        })
      })
    }
  }else{
    return{
      type: 'HELP_NOT_AVAILABLE',
      payload:{help:'not available'}
    }
  }
});


export{setKeyVal, getHelp}