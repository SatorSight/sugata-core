import * as React from 'react';
import {PureComponent} from 'react';
import Typography from 'material-ui/Typography';
import DataTableA from '../crud/DataTableA';

export default class Accounts extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const additional = {
            hide_columns:[
                'password',
                'encrypted_password',
                'reset_password_token',
                'reset_password_sent_at',
                'remember_created_at',
                'created_at',
                'updated_at',
                'current_sign_in_ip',
                'last_sign_in_ip',
                'sign_in_count',
                'last_sign_in_at',
            ],
            remove_actions: [
                'add',
                'edit',
            ]
        };

        return (
            <div>
                <Typography type="headline" component="h2">Accounts</Typography>
                <DataTableA additional={additional} pack={this.props.pack}/>
            </div>
        )
    }
}