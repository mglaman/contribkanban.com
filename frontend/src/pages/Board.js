import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";

const styles = theme => ({
})

function Board({ classes }) {
    const { machineName } = useParams();
    return (
        <p>{machineName}</p>
    )
}

export default withStyles(styles)(Board)
