const ejob=(state, action) =>{
  switch (action.type) {
    case 'SET_EDIT':
      return {
        ...state,
        job: action.payload.job, 
        categories: action.payload.categories,
        idx: action.payload.idx,
        coid: action.payload.coid
      };   
      case 'SET_TCEMAIL':
      return {
        ...state,
        tcemail: action.payload.tcemail
      };   
    default:
      return state;
  }
}

export{ejob}