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
      'company': (params,query)=>{switchPage({name: 'Company', params: {...params, query: query}});},
      'blank': (params,query)=>{switchPage({name: 'Blank', params: {...params, query: query}});},
      'splash': (params,query)=>{switchPage({name: 'Splash', params: {...params, query: query}});},
      'urapps': (params,query)=>{switchPage({name: 'UrApps', params: {...params, query: query}});},
      'addcompany': (params,query)=>{switchPage({name: 'AddCompany', params: {...params, query: query}});},
      'registered': (params, query)=> {switchPage({name: 'Registered', params: {...params, query: query}});} ,
      '*': ()=>{switchPage({name: 'Splash', params: null});}
    })
    .resolve();
  return router
}


export {routing}
