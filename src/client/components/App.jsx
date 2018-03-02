
import React, { Component } from 'react';
import callApi from '../callApi.js';

class SearchImg extends Component {
  constructor(props){
    super(props);
    this.state = {
      submit: {
        query: '',
        count: undefined,
        offset: undefined
      },
      results: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
  
  clickHandler(event) {
    let url = "https://search-img-api.herokuapp.com/api/recent";
    callApi(url, this);
  }
  
  handleChange(inputName){
      return (event) => {
      let newState = this.state;
      newState.submit[inputName] = event.target.value;
      this.setState(newState);
      }
  }
  
  handleSubmit(event){
    event.preventDefault();
    let url = "https://search-img-api.herokuapp.com/api/imgsearch?q=" + this.state.submit.query;
    if(!isNaN(parseInt(this.state.submit.count))) {url += '&count=' + this.state.submit.count}
    if(!isNaN(parseInt(this.state.submit.offset))) {url += '&offset=' + this.state.submit.offset}
    callApi(url, this);
  }
  
  render() {
    console.log('rendering search image component');
    return (
      <div>
<div className="upper-container">
     <h1>Image Search API</h1>
    <form className="params-form" onSubmit={this.handleSubmit}>
      <span className="url-segments"><p>https://search-img-api.herokuapp.com/api/imgsearch?q=</p></span>
      <span>
          <label for="query-input">Search term</label>
          <input id="query-input" type="text" onChange={this.handleChange('query')}/>
      </span>
      <span className="url-segments"><p>&count=</p></span>
      <span>
          <label for="count-input">Count</label>
          <input id="count-input" type="number" min="1" max="100" onChange={this.handleChange('count')}/>
      </span>
      <span className="url-segments"><p>&offset=</p></span>
      <span>
          <label for="offset-input">Offset</label>
          <input id="offset-input" type="number" min="1" max="1000" onChange={this.handleChange('offset')}/>
      </span>
      <span>
          <button className="submit-button" type="submit" onSubmit={this.handleSubmit}>Submit</button>
          </span>
    </form>
  </div>
  <div className="recent-container">
      <p className="recent-url">
        https://search-img-api.herokuapp.com/api/recent
      </p>
      <button className="recent-button" onClick={this.clickHandler}>Recent Searches</button>
  </div>
  <SearchImgOutput searchResults={this.state.results} />
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
    <div className="output-container">
      <h2>Output:</h2>
      <pre className="output">{this.props.searchResults || this.props.recentData}</pre>
    </div>
      );
  }
  
}


class ExampleSection extends Component {
    constructor(props) {
    super(props);
  }
  
  render() {
    
  let exampleImgJson = JSON.stringify([
        	{
        		"name": "Feral cat - Wikipedia",
        		"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Feral_cat_1.JPG/1200px-Feral_cat_1.JPG",
        		"thumbnail": "https://tse3.mm.bing.net/th?id=OIP.X0TzR7jjVelWU-g9DSTj7AHaE8&pid=Api",
        		"page": "https://en.wikipedia.org/wiki/Feral_cat"
        	}
        	], null, '\t');
   let exampleRecentJson = JSON.stringify([
	      {
		      "search": "cats",
		      "dateTime": 1520011762649
	      }
	      ], null, '\t');
    return(
        <div className="example-container">
        <p>The API has 2 endpoints;
        <ul>
          <li>https://search-img-api.herokuapp.com/api/imgsearch</li>
          <li>https://search-img-api.herokuapp.com/api/recent</li>
        </ul>
        </p>
        <p>
          The api/imgsearch endpoint takes 3 arguments; search term, count and offset. 
          The search term is the query string used to search for images, count specifies the number of results to return and the offset option can be used for pagination i.e. set count to 10 and iterate offset 10, 20, 30, etc. 
          The API will return different results by changing the offset option.
        </p>
        <p>
          The api/recent endpoint takes no arguments. It returns an array of objects 
          of the previous 10 searches. The properties returned are the search term and date and time.
        </p>
        <h2>Searching Images:</h2>
        <h3>Example Input:</h3>
        <p>https://search-img-api.herokuapp.com/api/imgsearch?q=cats&count=1&offset=0</p>
        <h3>Example Output:</h3>

        <pre>
        {exampleImgJson}
        </pre>
        <h2>Recent searches:</h2>
        <h3>Example Input:</h3>
        <p>https://search-img-api.herokuapp.com/api/recent
        </p>
        <h3>Example Output:</h3>
        <pre>
        {exampleRecentJson}
        </pre>
        </div>
      )
  }

  }

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
      <SearchImg />
      <ExampleSection />
      </div>
      );
  }
}