import * as React from 'react';
import {Component} from 'react';

import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import * as SUtils from '../helpers/SUtils';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';

import sKey from "../helpers/sKey";

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 500,
    },
    button: {
        margin: theme.spacing.unit,
        minWidth: 200,
    },
});

class Locales extends Component {
    constructor(props) {
        super(props);

        this.state = {...this.props.pack.contents, snackbar_open: false};
    }

    snackbarClose = () => this.setState({ snackbar_open: false });
    snackbarOpen = () => this.setState({ snackbar_open: true }, () => setTimeout(() => {this.snackbarClose()}, 2000));

    handleChange = name => event => this.setState({ [name]: event.target.value });
    saveLocale = () => {
        const query = `locales/save`;
        let payload = {};
        Object.keys(this.state).map(key => {
            if(key !== 'snackbar_open')
                payload[key] = this.state[key];
        });

        console.log(payload);

        SUtils.makeQuery(payload, 'POST', query, this.snackbarOpen);
    };

    render() {
        const {classes} = this.props;
        const contents = this.props.pack.contents;

        return (
            <div>
                <Typography type="headline" component="h2">Set up locale translations</Typography>
                <FormControl className={classes.formControl}>
                    {Object.keys(contents).map(key =>
                        <TextField
                            margin="normal"
                            label={key}
                            name={key}
                            type="text"
                            fullWidth
                            required={false}
                            value={this.state[key]}
                            onChange={this.handleChange(key)}
                        />
                    )}
                    <br/>
                    <Button onClick={this.saveLocale} raised color="primary" className={classes.button}>
                        Save
                    </Button>
                </FormControl>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.snackbar_open}
                    onClose={this.snackbarClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Saved</span>}
                />
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Locales)