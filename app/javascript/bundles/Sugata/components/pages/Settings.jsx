import * as React from 'react';
import {Component} from 'react';

import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { DialogActions } from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import * as SUtils from '../helpers/SUtils';

export default class Settings extends Component {
    constructor(props) {
        super(props);

        const data = props.pack.data;

        let fields = [];
        Object.keys(data.settings_names).map(key => {
            let field = {
                'name': key,
                'label': data.settings_names[key],
                'value': ''
            };
            field = this.fillFieldWithData(field);
            fields.push(field);
        });

        this.state = {
            fields: fields,
            snackbar_open: false,
        };
    }

    fillFieldWithData = (field) => {
        const settings = this.props.pack.data.setting_values;
        settings.map(setting_val => {
            if(setting_val.setting === field.name)
                field.value = setting_val.value;
        });
        return field;
    };

    setFieldValue = (field_name, value) => {
        this.setState({fields: this.state.fields.map(field => {
            if(field.name === field_name)
                field.value = value;
            return field;
        })});
    };

    handleChange = name => event => {
        this.setFieldValue(name, event.target.value);
    };

    snackbarClose = () => this.setState({ snackbar_open: false });
    snackbarOpen = () => this.setState({ snackbar_open: true }, () => {
        setTimeout(() => {this.snackbarClose()}, 2000);
    });

    save = () => {
        const payload = this.state.fields;
        const query = `settings/edit`;

        SUtils.makeQuery(payload, 'PATCH', query, this.snackbarOpen);
    };

    render() {
        return (
            <div>
                <Typography type="headline" component="h2">Settings</Typography>
                {this.state.fields.map((field, i) =>
                    <div key={i}>
                        <TextField
                            id={field.name}
                            style={{width: '600px'}}
                            label={field.label}
                            value={field.value}
                            onChange={this.handleChange(field.name)}
                            margin="normal"
                        />
                    </div>
                )}

                <DialogActions>
                    <Button raised onClick={this.save} color="primary">
                        Save
                    </Button>
                </DialogActions>

                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.snackbar_open}
                    onClose={this.snackbarClose}
                    message={'Saved'}
                />

            </div>
        );
    }
}