import React from 'react';

const Loading = () => {
    return (
        <div style={{width:'100%',height:'100vh',position:'fixed',background:'rgba(0, 0, 0, 0.5)',top:'0',zIndex:'100'}}>
            <div class="loading">
                <span>Loading</span>
            </div>
        </div>
    );
}

export default Loading;
