import React,{useState} from 'react';
import "./styles.css"
import Header from "./components/Header"
import CreateArea from "./components/CreateArea"
import Note from "./components/Note"
import Count from './components/Count';

function App(props){
  const[notes , setNots] = useState([]);

  function addNote(newNote) {
    setNots((prevValue) =>{   /*?????*/
      return[...prevValue , newNote];
    });
  }
  function deleteNote(id) {
    setNots(preValue=>{ 
      return [...preValue.filter((note, index)=>
      index !== id)]
    })
  }
  return(
    <div className="App">
      
      <Header />
      <Count Count={notes.length === 0? "Empty": 
        `Showing ${notes.length} Notes in Database`}
      />
      <CreateArea onAdd={addNote}/>
      {notes.map((note, index)=>(
        <Note 
        key={index}
         id={index} 
         title={note.title} 
         content={note.content}
         onDelete={deleteNote}
          />
      ))}
    </div>
  );
}

export default App;