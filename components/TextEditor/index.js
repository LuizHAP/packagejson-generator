import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import TextEditorJSONContext from 'context/textEditorJsonContext';
import FormJSONContext from 'context/formJsonContext';
import useEditor from 'hooks/useEditor';
import { PACKAGE_JSON_SCHEMA } from './schema.js';

var writing = false
var cursorPoint = 0
var editor = null

export default function TextEditor(){

    const [ txtJSON, setTxtJSON ] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')
    const { textEditorJSONCtxt, setTextEditorJSONCtxt } = useContext(TextEditorJSONContext)
    const { setFormJsonCtx } = useContext(FormJSONContext)
    const { validateSchemaAJV, createLinesEditor } = useEditor()

    useEffect(function(){
        const error = validateSchemaAJV(textEditorJSONCtxt, PACKAGE_JSON_SCHEMA)
        if (error) setErrorMessage(error)

        const txt = JSON.stringify(textEditorJSONCtxt, 0, 4)
        createLinesEditor(txt)
        setTxtJSON(txt)
    }, [textEditorJSONCtxt])

    useEffect(function(){
        editor = document.getElementById("json-editor")
        createLinesEditor(txtJSON)
        console.log(cursorPoint)
        if(writing) editor.setSelectionRange(cursorPoint,cursorPoint)
    })

    const updateContext = function(event){
        
        event.preventDefault()
        cursorPoint = editor.selectionStart

        try{
            const jsonParsed = JSON.parse(event.target.value)
            const error = validateSchemaAJV(textEditorJSONCtxt, PACKAGE_JSON_SCHEMA)
            if (error) setErrorMessage(error)

            setFormJsonCtx(jsonParsed)
            setTextEditorJSONCtxt(jsonParsed)
        }catch(error){
            document.getElementById('editor-messages').style.display = 'block'
            setTxtJSON(event.target.value)
            setErrorMessage('WRONG JSON STRUCTURE')
        }
    }

    return(<>
            <div className='text-editor'>
                <div className='editor'>
                    <div className='lines'>
                        <ul id='editor-lines-list' className='lines-list'>
                        </ul>
                    </div>
                    <textarea 
                        id='json-editor'
                        value={txtJSON} 
                        spellCheck="false"
                        onChange={updateContext}
                        onBlur={() => { writing = false }}
                        onFocus={() => { writing = true }}
                    />
                </div>
                <div id='editor-messages' className='messages'><FontAwesomeIcon icon={faExclamation} size='xs'/> {errorMessage} <FontAwesomeIcon icon={faExclamation} size='xs'/></div>
            </div>
            <style jsx>{`
                .text-editor{
                    width: 100%;
                    height: 100%;
                    background-color: #1e1e1e;
                    display: flex;
                    flex-direction: column;
                }

                .text-editor .editor{
                    display: flex;
                    flex-direction: row;
                    height: 95%;
                }

                .text-editor .editor textarea{
                    height: 100%;
                    width: 95%;
                    border: 1px solid #1e1e1e;
                    resize: none;
                    padding: .5rem 0 0 .5rem;
                    background-color: #1e1e1e;
                    color: orange;
                    line-height: var(--line-height-lg);
                    font-size: var(--font-size-editor-lg);
                }

                .text-editor .editor textarea:focus{
                    outline: none;
                }

                .text-editor .editor .lines{
                    width: 5%;
                    position: relative;
                    line-height: var(--line-height-lg);
                    font-size: var(--font-size-editor-lg);
                    font-family: monospace;
                    font-weight: 400;
                }

                .text-editor .editor .lines .lines-list{
                    padding: .5rem .5rem 0 .5rem;
                    color: #66ff33;
                }

                .text-editor .messages{
                    display: none;
                    background: white;
                    color: red;
                    padding: 0.25rem;
                    margin: 0 auto;
                    border-radius: 5px;
                    border: 1px solid red;
                    text-align: center;
                    transition: all .5s ease-in-out;
                }

                @media (min-width: 900px) and (max-width: 1250px) {
                    .text-editor textarea{
                        font-size: var(--font-size-editor-md);
                    }

                    .editor-lines{
                        font-size: var(--font-size-editor-md);
                    }
                }

                @media (min-width: 1100px) and (max-width: 1300px) {
                    .text-editor textarea{
                        font-size: var(--font-size-editor-md);
                    }

                    .editor-lines{
                        font-size: var(--font-size-editor-md);
                    }
                }

                @media (min-width: 900px) and (max-width: 1250px) {
                    .text-editor textarea{
                        font-size: var(--font-size-editor-s);
                    }

                    .editor-lines{
                        font-size: var(--font-size-editor-s);
                    }
                }
            `}</style>
            </>);

}