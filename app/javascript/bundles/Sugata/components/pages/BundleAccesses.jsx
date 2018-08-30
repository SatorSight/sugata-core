import * as React from 'react';
import {PureComponent} from 'react';
import Typography from 'material-ui/Typography';
import DataTableA from '../crud/DataTableA';

export default class Issues extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Typography type="headline" component="h2">Bundle Accesses</Typography>
                <DataTableA pack={this.props.pack}/>
            </div>
        )
    }
}