import MainPage from './MainPage';
import LoginWindow from './LoginWindow';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';

function Register() {
    return (
        <div className="register">
    

            <input className="register_login" placeholder=""  name="username" />
            <input className="register_password" placeholder="password" name="password" />
            <button className="register_button">Register</button>



        </div>
    );
}

export default Register;
