import * as React from 'react';
import {PureComponent} from 'react';
import Typography from 'material-ui/Typography';
import DataTableA from '../crud/DataTableA';

export default class Issues extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const additional = {
            callbacks: {
                add: function (data) {
                    if (data && data['id']) {
                        const id = data['id'];
                        const addition = '?id=' + id;
                        window.location.href = '/content/add' + addition;
                    }
                },
            },
            button: {
                text: 'Modify',
                to: '/content/add',
            }
        };

        return (
            <div>
                <Typography type="headline" component="h2">Issues</Typography>
                <DataTableA additional={additional} pack={this.props.pack}/>
            </div>
        )
    }
}