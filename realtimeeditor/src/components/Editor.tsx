import React, { useEffect, useRef } from 'react'
// import CodeMirror from 'codemirror'
import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css'
import { javascript } from "@codemirror/lang-javascript";
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/dracula.css'
import './Editor.css'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import Actions from '../api/Actions';

interface Props {
    socketRef: any,
    roomId: any
}

function Editor({ socketRef, roomId }: Props) {

    const editorRef = useRef<any>(null)

    // const onChange = React.useCallback((value: any, viewUpdate: any) => {
    //     console.log("value:", value, viewUpdate);
    // }, []);

    useEffect(() => {
        async function init() {
            const element: any = document.getElementById('realtimeEditor')!
            editorRef.current = CodeMirror.fromTextArea(element, {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseBrackets: true,
                autoCloseTags: true,
                lineNumbers: true

            })


            editorRef.current.on('change', (instance: any, changes: any) => {
                console.log(instance, changes)
                const { origin } = changes;
                const code = instance.getValue();
                if (origin !== 'setValue') {
                    socketRef.current.emit(Actions.CODE_CHANGE, {
                        roomId,
                        code
                    })
                }
                // console.log('code', code)
            })
            // editorRef.current.setValue('console.log()');




        }
        init()
    }, [])

    useEffect(() => {
        if (socketRef.current) {

            socketRef.current.on(Actions.CODE_CHANGE, ({ code }: any) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            })
        }

        return () => {
            socketRef.current.off(Actions.CODE_CHANGE)
        }
    }, [socketRef.current])

    return (
        <textarea id='realtimeEditor' ></textarea>
    )
}

export default Editor