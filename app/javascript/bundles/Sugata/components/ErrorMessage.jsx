import * as React from 'react';
import {PureComponent} from 'react';
import {withStyles} from 'material-ui/styles';

import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';

const styles = theme => ({
    innerContainer: {
        textAlign: 'center',
        maxWidth: '40rem',
    },
    messageContainer: {
        margin: '1rem',
    },
    buttonContainer: {
        margin: '1rem',
    },
});

class ErrorMessage extends PureComponent {
    constructor(props) {
        super(props);

        // this.state = {
        //     open: this.props.open,
        // }
    }

    // close = () => this.setState({open: false});
    // open = () => this.setState({open: true});
    refresh = () => location.reload();

    render() {
        const {classes} = this.props;
        return <div>
            <Dialog open={this.props.open}>
                <DialogTitle>Error happened!</DialogTitle>
                <div className={classes.innerContainer}>
                    <div className={classes.messageContainer}>
                        {this.props.message || 'Something unexpected ...'}
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button raised color="primary" onClick={this.refresh}>
                            Refresh
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    }
}

export default withStyles(styles, {withTheme: true})(ErrorMessage);