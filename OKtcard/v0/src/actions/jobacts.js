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

const setKeyVal = actionCreator((payload) => {
  return {
    type: 'SET_KEY_VAL',
    payload
  }
});

export{setEdit, setTcEmail, setKeyVal}