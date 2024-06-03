import React from 'react';

const Scroll = (props) => {
    const history = props.history.history
    return (
        <div className='scroll'>
            <h1>History</h1>
            <div className="history-container">
                {history ? history.map((item, index) => (
                    <div key={index} className="history-item">
                        {Object.keys(item).map((key, subIndex) => (
                            <div key={subIndex} className="history-column" >
                                <strong>{key}:</strong><div>{item[key].username ? item[key].username : "Username"}</div><div>{item[key].first_name}</div><div>{item[key].last_name}</div>
                            </div>
                        ))}
                    </div>
                )) : "Loading"}
            </div>
        </div>
    );
};

export default Scroll;
