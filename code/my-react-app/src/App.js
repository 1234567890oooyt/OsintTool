import MainPage from './MainPage';
import LoginWindow from './LoginWindow';
import ScrollOutput from './ScrollOutput';
import Register from './Register';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <div className="App">
            {/* <Register></Register> */}
            
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<LoginWindow/>}/>
                    <Route path="/check" element={<MainPage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
