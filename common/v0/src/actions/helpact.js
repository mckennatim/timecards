import { actionCreator } from '../rxred';

const setKeyVal = actionCreator((payload) => {
  return {
    type: 'SET_KEY_VAL',
    payload
  }
});

export{setKeyVal}