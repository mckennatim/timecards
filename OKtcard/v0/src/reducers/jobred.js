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
    case 'SET_KEY_VAL':
      const keys = Object.keys(action.payload)
      keys.map((key)=>{
        state[key] =action.payload[key]
      })
      return {
        ...state,
      };     
    default:
      return state;
  }
}

export{ejob}