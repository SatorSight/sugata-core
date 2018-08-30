import * as React from 'react';
import {Component} from 'react';

import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';

import sKey from "./helpers/sKey";

import SwipeableViews from 'react-swipeable-views';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 800,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    dialog:{
        minWidth: 240,
    },
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
    red: {
        color: 'red'
    },
    swipeItem: {
        // padding: 15,
        // minHeight: 100,
        // color: '#fff',

        // float:'left',
        // width:'100%',
        // position: 'relative'
    }
});

class PreviewDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Dialog fullWidth={true}
                        className={classes.dialog}
                        ignoreBackdropClick={true}
                        open={this.props.open}
                        onRequestClose={this.props.closer}>
                    <DialogTitle>Issue preview</DialogTitle>
                    <DialogContent>
                        <SwipeableViews
                            slideStyle={{width: 'auto'}}
                            enableMouseEvents>
                            {this.props.articles.map(article =>
                                <div
                                     // style={{width: 'auto'}}
                                     key={sKey('pd')}
                                     dangerouslySetInnerHTML={{__html: article.html}}
                                />
                            )}
                        </SwipeableViews>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.closer} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(PreviewDialog)