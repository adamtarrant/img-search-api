import React, { Component } from 'react';

export default class Footer extends Component {
    constructor(props){
        super(props)
    }
    

    
    render(){
    const styles = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "50px",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            color: "#fff",
            fontSize: "1.2em"
            };
            
        return (
            <footer className="footer" style={styles}>
                API developed by Adam Tarrant - {'\u00A9'} 2018
            </footer>
            
            );
    }
}