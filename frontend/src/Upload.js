import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    Grid,
    Typography,
    Button,
    CircularProgress
} from "@material-ui/core";
import {DropzoneArea} from 'material-ui-dropzone';
import { green } from '@material-ui/core/colors';
import {toast} from "react-toastify";

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        // display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
        backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

export default function Upload() {
    const classes = useStyles();
    var [files, setFiles] = useState([]);
    var [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = React.useState(false);

    const handleDropzoneChange = (e) => {
        setFiles(e);
        console.log(e.file);
        //fix bug 
        if (files.length < 1){
            setDisabled(false);
        }
    }

    const uploadFiles = (e) => {
        
        setLoading(true);

        const formData = new FormData();
        formData.append("dateTime", "test");
        // Append all uploaded files to form data
        files.forEach(file => {
            formData.append("file", file, file.name);
            console.log(file.name);
        });
        
        fetch(`http://localhost:8000/uploadRepaymentsList`,{
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(function(response){
            if (response){
                setDisabled(true);
                setFiles([]);
                toast.success(" Upload Successful.");
            } else {
                toast.warn("Something didn't go right.");
            }
            setLoading(false);
        })
        .catch(err => {
            toast.error(" Problem reaching API. Check internet connection", {autoClose: 5000});
            setLoading(false);
        })  
        
    }


    return (
        <Grid container component="main" className={"UploadSection"}>
            {/* <Grid item md={8}> */}
            {/* <Typography variant="h5" component="h5" align="left" color="primary">
                File Upload
            </Typography> */}
            <div >
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <DropzoneArea 
                                acceptedFiles={['.csv','.json']}      
                                maxFileSize={60720000}                        
                                dropzoneText="Select files to upload"
                                onChange={handleDropzoneChange}
                                showPreviews={false}
                                filesLimit={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                        <div className={classes.root}>
                            <div className={classes.wrapper}>
                                <Button
                                    onClick={uploadFiles}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled = {disabled}
                                >
                                    UPLOAD
                                </Button>
                                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>
                        </div>
                        </Grid>
                    </Grid>
                </form>
            </div>
            {/* </Grid> */}
        </Grid>
    );
}

