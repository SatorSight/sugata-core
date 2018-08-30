import * as React from 'react';
import {Component} from 'react';

import {withStyles} from 'material-ui/styles';

import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ListSubheader from 'material-ui/List/ListSubheader';



import sKey from '../helpers/sKey';

const styles = theme => ({
    red: {
        color: 'red'
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class FormAlerts extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const {classes} = this.props;

        return (
            <div>
                {this.props.alerts ?
                    Object.keys(this.props.alerts).map(field =>
                        <div key={sKey('fa')}>
                            <List disablePadding className={classes.red} subheader={<ListSubheader>Form errors:</ListSubheader>}>
                                <ListItem>
                                    <ListItemText className={classes.red} primary={field}/>
                                </ListItem>
                                <Collapse component="li" in={true} timeout="auto">
                                    <List >
                                        {this.props.alerts[field].map(message =>
                                            <ListItem key={sKey('fa')} button className={classes.nested}>
                                                <ListItemText className={classes.red} inset primary={message}/>
                                            </ListItem>
                                        )}
                                    </List>
                                </Collapse>
                            </List>
                        </div>) : null
                }
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(FormAlerts)