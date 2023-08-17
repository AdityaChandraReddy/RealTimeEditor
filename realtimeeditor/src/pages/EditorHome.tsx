import React from 'react'
import Input from '../components/Input'
import './EditorHome.css'
import { v4 as uuidv4 } from 'uuid';
import useInput from '../hooks/useInput';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function EditorHome() {
    const { value: enteredRoomId, valueChangedHadler: RoomIdHandler, manualSetValue: setRoomID } = useInput()
    const { value: enteredUsername, valueChangedHadler: UserNameHandler, manualSetValue: setUserName } = useInput()

    const navigation = useNavigate();

    const createNewRoom = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const id = uuidv4()
        console.log(id)
        setRoomID(id)
        toast.success('Created a new Room')
    }
    const joinRoom = () => {
        if (!enteredRoomId || !enteredUsername) {
            console.log(enteredRoomId, enteredUsername)
            toast.error('Enter all Values')
            return
        }
        navigation(`/EditorEdit/${enteredRoomId}`, {
            state: {
                username: enteredUsername
            }
        })
    }

    const handleEnter = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.code === 'Enter') {
            joinRoom()
        }
    }

    return (
        <div className='homePageWrapper' >
            <div className='formWrappper' >
                <h2 style={{ textAlign: "center" }} > Real Time collaboration</h2>
                <h4 className='mainLabel'>Paste inviation Room Id </h4>
                <div className='inputGroup' >
                    <Input placeholder='RoomId' value={enteredRoomId} type='text' onChange={RoomIdHandler} />
                    <Input placeholder='User Name' type='text' onChange={UserNameHandler} value={enteredUsername} onKeyDown={handleEnter} />
                    <button className='btn joinBtn' onClick={joinRoom} >Join</button>
                    <span className='createInfo'>If you dont have an invite then create <a href='' onClick={createNewRoom} className='createNewBtn' >new room</a> </span>
                </div>
            </div>

        </div>
    )
}

export default EditorHome