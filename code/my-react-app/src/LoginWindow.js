import React, { useState } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function LoginWindow() {
    const navigator = useNavigate()
    const [isCreate, setIsCreate] = useState(false);

    const [data, setData] = useState({
        username: '',
        password: ''
    })

    function handleChange(e) {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    async function handleClick() {
        const path = isCreate ? "register" : "login"
        await axios.post(`http://localhost:5000/${path}`, {
            username: data.username,
            password: data.password
        }).then(res => {
            document.cookie = `username=${data.username}`
            alert(res.data.message)
            navigator("/check")
        }).catch(e => {
            alert(e.message)
        })
    }

    return (
        <div className="LoginWindow">
            <div>Login</div>
            <input className="inputs" placeholder="Username" value={data.username} name="username" onChange={handleChange} />
            <input className="inputs" placeholder="Password" type="password" value={data.password} name="password"
                onChange={handleChange} />
            <button className="buttons" onClick={handleClick}>{isCreate ? 'Register' : "Login"}</button>
            <button className="buttons" onClick={() => {
                setIsCreate(!isCreate)
            }}>{isCreate ? 'Switch to Login' : 'Switch to Register'}</button>
        </div>
    );
}

export default LoginWindow;
