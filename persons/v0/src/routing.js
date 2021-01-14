import Navigo from 'navigo';
import { switchPage} from './actions/responsive';

var routes = [
  {path: 'persons', page: 'Persons'},
  {path: 'about', page: 'About'},
  {path: 'addperson', page: 'AddPerson'},
  {path: 'help', page: 'Help'},
  {path: '*', page: 'Persons'},
]
const makeRouter = (routes)=>{
  const onrt = routes.reduce((acc,rt)=>{
    acc[rt.path]=(params,query)=>{switchPage({name: rt.page, params: {...params, query: query}});}
    return acc
  }, {})
  return onrt
}

const rts = makeRouter(routes)
var router

const routing = ()=>{
  //const cfg ={root: 'http://10.0.1.233/spa/admin/dist/', useHash: true}
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on(rts)
    .resolve();
  return router
}


export {routing, routes}
