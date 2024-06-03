
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';

function ScrollOutput(props) {
    const history = props.history

    const handleClick = (e) => {
        const jsonWindow = window.open("", "_blank")
        jsonWindow.document.write("<pre>" + JSON.stringify(e, null, 4) + "</pre>")
        jsonWindow.document.close()
    }
    return (
        <div className="output_container" >
            {history ? history.map((item, index) => (
                <div key={index} style={{padding: "20px"}} onClick={() => handleClick(item)}>JSON File: {index + 1}</div>
            )) : "Loading"}
        </div>
    );
}

export default ScrollOutput;
