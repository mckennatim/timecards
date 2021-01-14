import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchJobs, postJobs} from '../services/fetches'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';// eslint-disable-line no-unused-vars
import { addPage, removePage } from '../actions/responsive';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 1.5,
  margin: `0 0 ${grid}px 0`,

  background: isDragging ? '#99CCCC' : '#6b75ce',

  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : '#5a5d60',
  padding: grid,
  width: 300,
});

class SortJobs extends React.Component{
  Jobs='mabibi sufvhs'
  state={
    jobs: [{job: 'duck', id: 99}],
    wk: 0,
    filt: 'all',
    unique: [{id:99, content:'dog'}]
  }

  dwk=null

  componentDidMount(){
    addPage('SortJobs')
    this.getJobs(0)
    this.dwk = document.getElementById("wk")
  }  

  componentWillUnmount(){
    removePage('SortJobs')
  }

  getJobs(){
    fetchJobs(0)     
      .then((res)=>{
        var unique = [... new Set(res.jobs.map((j) => j.job))]
          .map((aj,i)=>{
            return {id:i, job:aj}
          }); 
        this.setState({jobs: res.jobs, unique:unique},()=>{})
      })
  }

  onDragEnd=(result)=> {
    // dropped outside the list
    if (!result.destination) {return;}
    const unique = reorder(
      this.state.unique,
      result.source.index,
      result.destination.index
    );
    this.setState({unique},()=>{
      this.save2server()
    });
  }  

  save2server=()=>{
    const {unique, jobs} =this.state
    const njobs = jobs.map((ajob)=>{
      let idx = unique.findIndex((x) =>{
        return x.job==ajob.job
      })
      delete ajob.id
      delete ajob.coid
      return {...ajob, idx:idx}
    })
    postJobs(njobs, 0)
    //router.navigate('/jobs');
    location.replace('#jobs?rerender')
  }
  
  render(){
    if (this.state.unique){
      return(
        <div>
          <h4>Drag and Drop To Reorder</h4>
        <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.unique.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.job}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      </div>
      )
    }else{
      return(
        <div>
          <a href="home" data-navigo>maybe you need to register</a>
        </div>
        )
    }
  }
}
SortJobs = mapClass2Element(SortJobs)

export {SortJobs}
