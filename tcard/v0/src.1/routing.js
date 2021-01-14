import Navigo from 'navigo';
import { switchPage} from './actions/responsive';

var router

const routing = ()=>{
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on({
      'about': ()=>{switchPage({name: 'About', params: null});},
      'dog': ()=>{switchPage({name: 'Dog', params: null});},
      'cat': ()=>{switchPage({name: 'Cat', params: null});},
      'tcard': ()=>{switchPage({name: 'TimeCardJar', params: null});},
      'registered': (params, query)=> {switchPage({name: 'Registered', params: {...params, query: query}});} ,
      '*': ()=>{switchPage({name: 'TimeCardJar', params: null});}
    })
    .resolve();
  return router
}


export {routing}
