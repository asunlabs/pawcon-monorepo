import * as React from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'

const editor = new EditorJS({
    holder : 'editorjs',
    tools: {
        header: {
            class: Header,
            inlineToolbar : true
        },
    },
})  

export function Feedback () {
    const [submit, setSubmit] = React.useState(false)
    const [save, setSave] = React.useState(false)
    const [fetchEditor, setFetchEditor] = React.useState(false)
    
    const fetchEditorJs = () => {
        setFetchEditor(true)
    }
    const handleClick = (event : React.FormEvent) => { 
        event.preventDefault()
        setSave(true)
    }
    const handleSubmit = (event : React.FormEvent) => {
        event.preventDefault()
        setSubmit(true)
    }

    // Render editor js once. 
    React.useEffect(() => {    
        const fetchEditorJsButton = document.getElementById('fetchEditorJsButton') as HTMLButtonElement

        // render editor js when reloaded
        if (fetchEditor) {
            document.location.reload()
        } 
        
        if (save) {
            fetchEditorJsButton.disabled = true
            // // To get all entry's data from Editor.js, call the save() method on the class instance. 
            // It will return a Promise that resolves with clean data.
            editor.save().then((result) => {
                // editorjs.blocks : object containing arrays
                // console.log(result.blocks[0].data.text) // one block in editor js
                const texts = [ ]
                for (let i=0; i < Object.keys(result.blocks).length; i++) {
                    // get each block's text
                    texts.push(result.blocks[i].data.text)
                }
                const onePost = texts.join(" ")
                console.log(onePost) // combined paragraphs

                // NOT DONE 
                // save feedbacks to database
                // fetch('/blog', {
                //     method: 'POST', 
                //     body: JSON.stringify({feedbacks}), 
                //     headers: { 'Content-Type' : 'application/json' }
                // })
            }).catch((err ) => console.log(err))
        }
    }, [ save, fetchEditor ])

  return (
    // form submission should be done in form tag, not button
    <form className="web-editor" onSubmit={(event) => handleSubmit(event)}>
        <h2>Tell Us What You Felt</h2>
        <button
            id='fetchEditorJsButton'
            onClick={fetchEditorJs}>&#9660;</button>
        <h3>Use tab key for Heading</h3>
        <div id='editorjs'></div>
        <button 
            disabled ={editor ? false : true }
            className="saveButton" 
            onClick={handleClick}>Save</button>
        <button 
            disabled={save ? false : true }
            className="submitButton" 
            type='submit'>Submit</button>
    </form>
  );
}
