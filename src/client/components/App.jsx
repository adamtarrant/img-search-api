/*global fetch*/
import React, { Component } from 'react';

class SearchImg extends Component {
  constructor(props){
    super(props);
    this.state = {
      submit: '',
      results: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event){
      this.setState({
      submit: event.target.value
    });
  }
  
  handleSubmit(event){
    event.preventDefault();
  let url = "https://9f3af2f0c58648209ba33b6cba9ca7c8.vfs.cloud9.us-east-2.amazonaws.com/api/imgsearch?q=" + this.state.submit;
      console.log('about to fetch')
      fetch(url)
      .then(response => {return response.json()})
      .then(data => {
        this.setState({results: data});
        console.log('fetched!');
      }).catch(error => {throw error});
    
  }
  
  render() {
    console.log('rendering search image component');
    return (
      <div>
        <form  onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange}/>
          <button type="submit" onSubmit={this.handleSubmit}>Search</button>
        </form>
        <SearchImgOutput  searchResults={this.state.results} />
      </div>

      );
  }
}

class SearchImgOutput extends Component {
  constructor(props) {
    super(props);
  }
  
    render() {
    return (
    <div>
      <h2>Output:</h2>
      <results>{this.props.searchResults}</results>
    </div>
      );
  }
  
}

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
      <h1>Image Search Astraction</h1>
      <SearchImg />
      </div>
      );
  }
}