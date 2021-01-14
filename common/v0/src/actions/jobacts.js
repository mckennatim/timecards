import { actionCreator } from '../rxred';

const setEdit = actionCreator((payload) => {
  return {
    type: 'SET_EDIT',
    payload
  }
});
const setUpdate = actionCreator((payload) => {
  return {
    type: 'SET_UPDATE',
    payload
  }
});
const setClearJc = actionCreator((payload) => {
  return {
    type: 'SET_CLEAR_JC',
    payload
  }
});

export{setEdit, setUpdate, setClearJc}