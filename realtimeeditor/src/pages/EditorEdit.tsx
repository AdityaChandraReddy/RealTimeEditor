import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client'
import Editor from '../components/Editor'
import './EditorEdit.css'
import { initSocket } from '../api/socket'
import Actions from '../api/Actions'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

function EditorEdit() {
    const reactNavigator = useNavigate()
    const location = useLocation()
    const socketRef = useRef<any>()
    const { roomId } = useParams()
    const [clients, setClients] = useState([{ socketId: 1, username: 'ADI' }, { socketId: 3, username: 'ADI' }, { socketId: 5, username: 'ADI' }, { socketId: 2, username: 'Noob' }])

    useEffect(() => {
        async function init() {
            socketRef.current = await initSocket()
            socketRef.current.on('connect_error', (err: any) => handleError(err))
            socketRef.current.on('connect_failed', (err: any) => handleError(err))

            function handleError(err: any) {
                console.log('socket errro', err)
                toast.error('Connection Failed')
                reactNavigator('/EditorHome');
            }

            socketRef.current.emit(Actions.JOIN, {
                roomId,
                username: location.state?.username
            })

            socketRef.current.on(Actions.Joined, ({ clients, socketId, username }: any) => {
                console.log(clients)
                if (username !== location.state?.usename) {
                    console.log('username joinde', username)
                    toast.success(`${username} joined`)
                }
                setClients(clients)
                socketRef.current.emit(Actions.SYNC_CODE, {})
            })

            socketRef.current.on(Actions.DISCONNECTED, (
                { socketId, username }: any
            ) => {
                toast.success(`${username}left the room`)
                setClients((prev) => {
                    return prev.filter((client) => client.socketId !== socketId)
                })
            })

        }
        init()


        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(Actions.Joined);
            socketRef.current.off(Actions.DISCONNECTED);
        }
    }, [])


    if (!location.state) {
        return <Navigate to='/EditorHome' />
    }

    return (
        <div className='mainWrap' >
            <div className='aside'>
                <div className='asideInner'>
                    <div className='heading'>
                        <h4>Real Time Editor</h4>
                    </div>
                    <h3>Connected</h3>
                    <div className='clientsList' >
                        {clients.map((client) => <Client userName={client.username} key={client.socketId} />)}
                    </div>
                </div>
                <button className='btn copyBtn' >Copy Room ID</button>
                <button className='btn leaveBtn' >Leave</button>
            </div>
            <div className='editorWrap'>
                <Editor socketRef={socketRef} roomId={roomId} />
            </div>
        </div>
    )
}

export default EditorEdit