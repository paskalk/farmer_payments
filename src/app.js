import React from "react";
import ReactDOM from "react-dom";

console.log('here');
class Table extends React.Component {
    state = {
        measurements: [],
        average: 0,
        clickCount: 0
    }



    componentDidMount() {

        this.refreshInterval = setInterval(() => {
            fetch(`/getMeasurements`)
            // fetch('https://nodehkr.herokuapp.com/getMeasurements')
            .then(response => response.json())
            .then(response => this.setState({measurements: response}))
            .catch(err => console.error(err))

            var sum = 0;
            for (let i = 0;i < this.state.measurements.length; i++) {
                sum += this.state.measurements[i].temperature; 
            }   
            this.state.average = sum /5;
    
        },600) 
    }

    handleClick = (e) => {
        e.preventDefault();
        this.state.clickCount = this.state.clickCount + 1;
    };


    
    render() {
        return (
            <React.Fragment>
            <h1>Measurements on Heroku+Postgres //Auto deploy</h1>
            
            <p>Average is: {this.state.average} and the header click count is: {this.state.clickCount}  </p>
            <table border='1' width='100%' >
            <thead>
            <tr>
                <th onClick={this.handleClick}>Unit Id</th>
                <th onClick={this.handleClick}>Temperature</th>
                <th onClick={this.handleClick}>Unix Stamp</th>    
            </tr>
            </thead>
            {this.state.measurements.map((measurement) => (
                <tbody>
                <tr>
                    <td>{ measurement.unit_id }</td>
                    <td>{ measurement.temperature }</td>
                    <td>{ measurement.unix_timestamp }</td>
                </tr>
                </tbody>
            ))}
            </table>
            
            </React.Fragment>
            
        );
    }

    componentWillUnmount(){
        clearInterval(this.refreshInterval);
    }
    

}

ReactDOM.render(<Table />, document.getElementById('root'));