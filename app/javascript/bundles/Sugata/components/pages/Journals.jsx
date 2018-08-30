import * as React from 'react';
import {PureComponent} from 'react';
import Typography from 'material-ui/Typography';
import DataTableA from '../crud/DataTableA';

export default class Journals extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const additional = {
            hide_columns:[
                'url_prefix',
                'description',
                'created_at',
                'updated_at'
            ],
        };

        return (
            <div>
                <Typography type="headline" component="h2">Journals</Typography>
                <DataTableA additional={additional} pack={this.props.pack}/>
            </div>
        )
    }
}