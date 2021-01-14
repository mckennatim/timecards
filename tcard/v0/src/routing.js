import Navigo from 'navigo';
import { switchPage} from './actions/responsive';

var routes = [
  {path: 'tcard', page: 'Tcard'},
  {path: 'about', page: 'About'},
  {path: 'help', page: 'Help'},
  {path: '*', page: 'Tcard'},
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
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on(rts)
    .resolve();
  return router
}


export {routing, routes}
