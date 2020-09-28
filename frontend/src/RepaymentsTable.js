import React from "react";
import MUIDataTable from "mui-datatables";

class RepaymentsTable extends React.Component {
    state = {
        userData: [["Loading Data..."]]
    };

    componentDidMount() {
        fetch(`http://backend:8000/repayments`)
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
            label: "ID",
            name: "repaymentid",
            options: {
            filter: false
            }
        },
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
            label: "Amount",
            name: "amount",
            options: {
            filter: true
            }
        },  
        {
            label: "Parent",
            name: "parentid",
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
            title={"Repayments Data"}
            data={this.state.userData}
            columns={columns}
            options={options}
        />
        );
    }
}

export default RepaymentsTable;