const ejob=(state, action) =>{
  switch (action.type) {
    case 'SET_EDIT':
      return {
        ...state,
        curjob: action.payload
      };     
      case 'SET_UPDATE':
        return {
          ...state,
          update: action.payload.update
        };    
        case 'SET_CLEAR_JC':
        return {
          ...state,
          clearjc: action.payload.clearjc
        };    
    default:
      return state;
  }
}

export{ejob}