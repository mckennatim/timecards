import Navigo from 'navigo';
import { switchPage} from './actions/responsive';

var router

const routing = ()=>{
  //const cfg ={root: 'http://10.0.1.233/spa/admin/dist/', useHash: true}
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on({
      'about': ()=>{switchPage({name: 'About', params: null});},
      'cat': ()=>{switchPage({name: 'Cat', params: null});},
      'persons': (params,query)=>{switchPage({name: 'Persons', params: {...params, query: query}});},
      'addperson': (params, query)=> {switchPage({name: 'AddPerson', params: {...params, query: query}});},
      '*': ()=>{switchPage({name: 'Persons', params: null});}
    })
    .resolve();
  return router
}


export {routing}
