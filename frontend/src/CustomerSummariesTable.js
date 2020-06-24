import React from "react";
import MUIDataTable from "mui-datatables";

class RepaymentsTable extends React.Component {
    state = {
        userData: [["Loading Data..."]]
    };

    componentDidMount() {
        fetch(`http://localhost:8000/customersummaries`)
        .then(response => response.json())
        .then((response)  => {
            if (response){      
                this.setState({userData: response });
        }
        })
    }
    
    render() {
  
    const columns = [
        {
            label: "Customer",
            name: "customerid",
            options: {
            filter: true
            }
        },
        {
            label: "Season",
            name: "seasonid",
            options: {
            filter: true
            }
        },
        {
            label: "T.Repaid",
            name: "totalrepaid",
            options: {
            filter: true
            }
        }, 
        {
            label: "T.Credit",
            name: "totalcredit",
            options: {
            filter: true
            }
        }, 
        {
            label: "Balance",
            name: "balance",
            options: {
            filter: true
            }
        },        
    ];

    const options = {
        filter: true,
        filterType: "dropdown",
        responsive: "scrollMaxHeight",
        print: false,
        download: false,
        selectableRows: "none"
    };


    return (
        <MUIDataTable
            title={"Customer  Summaries Data"}
            data={this.state.userData}
            columns={columns}
            options={options}
        />
        );
    }
}

export default RepaymentsTable;