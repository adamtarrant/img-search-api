/*global fetch*/
export default function callApi(urlStr, context){
    console.log('about to fetch from ' + urlStr);
    fetch(urlStr)
      .then(response => {
        if (response.ok) {
        return response.text();
        } else {
          throw new Error('Fetch did not respond with status ok');
        }
      })
      .then(data => {
        console.log(data);
        context.setState({results: data});
        console.log('fetched!');
      }).catch(error => {console.log(error)});
}