
const responsive=(state, action) =>{
  let pages, npages
  switch (action.type) {
    case 'SET_DEVICE':
      const ws = action.payload
      var idx
      state.sizes.reduce((prev, curr, i)=>{ 
        if(prev < ws && ws <= curr){idx = i}
        return curr 
      }, 0);  
      const bro = state.types[idx]   
      return {
        ...state, 
        size: action.payload,
        browser: bro
      }
    case 'SET_IS_MOBILE':
      return {
        ...state,
        ismobile:action.payload
      }  

    case 'ADD_PAGE':
      pages = state.pages
      npages = pages.slice()
      npages.push(action.payload)
      return{
        ...state, pages:npages
      }
  
    case 'REMOVE_PAGE':
      pages = state.pages
      npages = pages.filter((p)=>p!=action.payload)
      return{
        ...state, pages:npages
      }       
    default:
      return state;
  }
}

export{responsive}