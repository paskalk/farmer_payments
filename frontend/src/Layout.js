import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Grid} from '@material-ui/core';

import Upload from './Upload';
import RepaymentsTable from './RepaymentsTable';
import CustomerSummariesTable from './CustomerSummariesTable';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    subcontainer: {
        marginTop:theme.spacing(4),
        marginRight: theme.spacing(3),
        marginLeft: theme.spacing(3)
    }
}));

export default function Layout() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar variant="dense">
                </Toolbar>
            </AppBar>
            
            <div className={classes.subcontainer}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Upload />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <RepaymentsTable/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CustomerSummariesTable/>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
