import { actionCreator } from '../rxred';

const setEdit = actionCreator((payload) => {
  return {
    type: 'SET_EDIT',
    payload
  }
});

const setTcEmail = actionCreator((payload) => {
  return {
    type: 'SET_TCEMAIL',
    payload
  }
});

export{setEdit, setTcEmail}