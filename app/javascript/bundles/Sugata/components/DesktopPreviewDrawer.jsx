import * as React from 'react';
import {Component} from 'react';

import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import DesktopPreviewSwiper from './DesktopPreviewSwiper'
import PropTypes from 'prop-types';

const styles = theme => ({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },

    drawerInner: {
        width: '800px',
        height: '100%'
    }
});

class DesktopPreviewDrawer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <Drawer
                type="persistent"
                anchor={'right'}
                open={this.props.open}
            >
                <div style={{height: '100%'}}>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.props.closer}>
                            <ChevronRightIcon />
                        </IconButton>
                    </div>
                    <div className={classes.drawerInner}>
                        <DesktopPreviewSwiper articles={this.props.articles} />
                    </div>
                </div>
            </Drawer>
        )
    }
}

DesktopPreviewDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    articles: PropTypes.array.isRequired
};

export default withStyles(styles, {withTheme: true})(DesktopPreviewDrawer)