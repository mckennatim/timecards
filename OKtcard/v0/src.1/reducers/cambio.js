const cambio=(state, action) =>{
  switch (action.type) {
    case 'SET_FOCUS':
      return state;    
    case 'PAGE_SWITCHED':
      return {
        ...state,
        page: action.payload
      };    
    default:
      return state;
  }
}

export{cambio}