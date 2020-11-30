import React, { Component } from 'react';

export default class PostExperiment extends Component {

    render() {
        return (
            <div 
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                color: "#ffffff",
                backgroundColor: "#000000"
              }}
            >
                <div>
                    <br/>
                    Thank you for completing this section of the study.
                    <br/>
                    <br/>
                    Please navigate to the next page by clicking on the right arrow at the bottom of the screen.
                </div>
            </div>
        )
    }
}

