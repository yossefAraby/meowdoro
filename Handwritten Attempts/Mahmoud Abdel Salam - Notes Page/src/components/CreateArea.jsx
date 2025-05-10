import React, {useState} from 'react';

import {IoIosAdd} from "react-icons/io";
function CreateArea({SubmitButton, onAdd}){
    const[isExpanded, setExpanded] = useState(false)
    const [note, setNote] = useState({
        title: "",
         content:"",
    })
    function handleChange(e){
       const{name, value} = e.target
       setNote((prevalue) =>{
        return{
            ...prevalue, /*???????*/ 
            [name]: value,
        };
       });
    }
    function handleExpanded(){
        setExpanded(true);
    }

    function SubmitButton(event) {
        onAdd(note);
        setNote({    //to empty fields
            title: "",
            content: ""
        })
        event.preventDefault();  /*???????*/ 
       
        
    }

  return(
    <div className="CreateArea">
        <form>
            {isExpanded && (    //اظهار و اخفاء عند الضغط ع المربع
                <input 
                value={note.title}
                type="text"
                placeholder="Title"
                name="title"
                onChange={handleChange}
                rows={isExpanded ? 3 : 1}
                />
            )}
                 
            <p>
                <textarea 
            value={note.content}
            onClick={handleExpanded}
            name = "content"
            placeholder="Take a note..."
            onChange={handleChange}>
                  
                </textarea>
            </p>
            <button onClick={SubmitButton}>
                <IoIosAdd size={35}/>
            </button>
        </form>
    </div>
  );
}

export default CreateArea;