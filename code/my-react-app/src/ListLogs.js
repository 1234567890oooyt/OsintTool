import React from 'react';
import Scroll from './Scroll';

function ListLogs(props) {
    return (
        <div id='list_logs'>
            <Scroll history={props.history}></Scroll>
        </div>
    );
}

export default ListLogs;
