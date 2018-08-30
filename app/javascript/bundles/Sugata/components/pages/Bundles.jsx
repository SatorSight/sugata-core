import * as React from 'react';
import {PureComponent} from 'react';
import Typography from 'material-ui/Typography';
import DataTableA from '../crud/DataTableA';

export default class Bundles extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const additional = {
            hide_columns:[
                'mobile_redirect_url',
                'card_redirect_url',
                'service_id'
            ],
        };
        return (
            <div>
                <Typography type="headline" component="h2">Bundles</Typography>
                <DataTableA additional={additional} pack={this.props.pack}/>
            </div>
        )
    }
}