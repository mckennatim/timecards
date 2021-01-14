import React from  'react'// eslint-disable-line no-unused-vars
import {geta} from '../utilities/wfuncs'
import {pStyle} from '../styles'
const style = {
  ...pStyle, outer: {...pStyle.outer, background: '#99FF99'}
}

const dlsty ={
  overflowY: 'auto',
  height: '350px'
}
const lusty={
 listStyleType: 'none',
 paddingLeft: '12px'
}

const listy={
 textAlign: 'left',
 padding: '10px',
 border: 'solid 1px black'
 }

 const ld1sty={
  float: 'left',
  width: '70%'
}
const ld3sty={
  width: '10%',
  float: 'right'
}
const ld2sty={
  paddingLeft: '40px',
  width: '80%'
}

const Products = (props) =>{
  const renderProducts=()=> {
    if(geta('props.responsive.page.params', props)){
      return(
        <div>
        <h3> Product</h3>
        <h4>pruduct ID: {props.responsive.page.params.id} description: {props.responsive.page.params.inv}</h4>
        </div>
      );
    } else {
      return(
        <div>
          <h3> Products</h3>
          <div style={dlsty}>
            <ul style={lusty}>{ props.test.users.map((user, index) => 
              <li key={index} style={listy}>
                <div style={ld1sty}>
                  {user} and my granbdmother also is a little funy, I don't know, I don't think she is a killer
                </div>
                <div style={ld3sty}>
                  1                
                </div>
                <div style={ld2sty}>
                  a little funy, I don't know, I don't think she is a killer
                </div>
              </li>) }
            </ul>
          </div>
        </div>
      );
    }
  }

  return(
    <div style={style.outer}>
      {renderProducts()}
    </div>
  )
}

export{Products}
