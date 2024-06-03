import React, {useEffect, useState} from 'react';
import './App.css';
import ListLogs from './ListLogs';
import axios, {get} from "axios";
import ScrollOutput from "./ScrollOutput";


function MainPage() {
    const [number, setNumber] = useState("")
    const [nickname, setNickname] = useState("")
    const [user, setUser] = useState({})
    const [history, setHistory] = useState({})
    const [isChecked, setIsChecked] = useState(false)

    if (document.cookie.indexOf('username=') === -1) {
        window.location.href = "/"
    }


    let cookies = document.cookie.split(';');
    let username = '';

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('username=')) {
            username = cookie.substring('username='.length, cookie.length);
            break;
        }
    }

    async function sendNumber() {
        await axios.post("http://localhost:5000/check", {"numbers": number, "username": username}).then(res => {
            const data = res.data.output[Object.keys(res.data.output)[0]]
            setUser(data)
            if (isChecked) {
                sendNickname(data.username)
            }
        }).catch(e => {
            alert(e.message)
        })
    }

    async function sendNickname(data) {
        await axios.post("http://localhost:5000/nickname", {"nickname": data, "username": username}).then(res => {
            let newWindow = window.open("")
            newWindow.document.write(res.data.toString())
            newWindow.document.close()
        }).catch(e => {
            alert(e.message)
        })
    }

    async function getLogs() {
        await axios.post("http://localhost:5000/logs", {"username": username}).then(res => {
            console.log(res.data)
            setHistory(res.data)
        }).catch(e => {
            alert(e.message)
        })
    }

    useEffect(() => {
        getLogs().then(() => {
        })
    }, []);

    return (
        <>
            <div className='container_main'>
                <ListLogs history={history}></ListLogs>
                <div className="main_page" style={{display: "flex", flexDirection: "column"}}>
                    <h1>{username ? username : "Loading..."}</h1>
                    <div className='interface_box' >
                        <div className='telegram_box'>
                            <input className="phone_number" value={number} onChange={e => {
                                setNumber(e.target.value)
                            }}
                                   placeholder="put phone number here"/>
                            <button id="send" onClick={sendNumber}>SEND</button>
                            <form>
                                <input type="checkbox" checked={isChecked} onChange={() => {setIsChecked(!isChecked)}}/>
                                <label htmlFor="exampleCheckbox">Use phone to extended search</label>
                            </form>
                        </div>
                        <div className='maigret_box'>
                            <input className="nick_name_input"
                                   placeholder="put nickname (extended search)" value={user.username} onChange={e => {
                                setNickname(e.target.value)
                            }}/>
                            <button id="extendet_send" onClick={() => sendNickname(nickname)}>SEND extendet</button>
                        </div>
                    </div>
                    <div className='username'>{user.username ? user.username : "Нік"}</div>
                    <div className='first_name'>{user.first_name ? user.first_name : "Імя"}</div>
                    <div className='last_name'>{user.last_name ? user.last_name : "Прізвище"}</div>
                    <div className='premium'>{user.premium ? "Преміум" : "Не преміум"}</div>
                    <div
                        className='user_was_online'>{user.user_was_online ? user.user_was_online : "Останній актив"}</div>
                </div>
            </div>
            <ScrollOutput history={history.nickHistory}></ScrollOutput>
        </>
    );
}

export default MainPage;
