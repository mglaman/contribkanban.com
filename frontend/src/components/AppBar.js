import React, { Fragment } from 'react'
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import {
  Link as RouterLink
} from "react-router-dom";
import Toolbar, { styles as toolbarStyles } from './Toolbar';

const styles = theme => ({
    title: {
      fontSize: 24,
    },
    placeholder: toolbarStyles(theme).root,
    offset: theme.mixins.toolbar,
    toolbar: {
      justifyContent: 'space-between',
    },
  })

function AppBar({ classes }) {
    return (
        <Fragment>
            <MuiAppBar elevation={0} position="fixed">
                <Toolbar className={classes.toolbar}>
                    <Link
                        variant="h6"
                        component={RouterLink}
                        underline="none"
                        color="inherit"
                        className={classes.title}
                        to="/"
                    >
                        {'ContribKanban'}
                    </Link>
                </Toolbar>
            </MuiAppBar>
            <div className={classes.placeholder} />
            <div className={classes.offset} />
        </Fragment>
    )
}
export default withStyles(styles)(AppBar)
