import * as React from 'react';
import {PureComponent} from 'react';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import {withStyles} from 'material-ui/styles';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import HomeIcon from 'material-ui-icons/Home'
import ContentIcon from 'material-ui-icons/Book'
import Collapse from 'material-ui/transitions/Collapse';
import AddIcon from 'material-ui-icons/Add';
import ContentListIcon from 'material-ui-icons/ViewList';
import SettingsIcon from 'material-ui-icons/Settings';
import AccountsIcon from 'material-ui-icons/AccountCircle';
import RealmsIcon from 'material-ui-icons/Language'
import UsersIcon from 'material-ui-icons/Group'
import PaymentsIcon from 'material-ui-icons/MonetizationOn'
import RealmPaymentTypesIcon from 'material-ui-icons/MonetizationOn'
import BundleIcon from 'material-ui-icons/Shop'
import LocalesIcon from 'material-ui-icons/GTranslate'
import JournalsIcon from 'material-ui-icons/ChromeReaderMode'
import PeriodsIcon from 'material-ui-icons/AlarmOn'
import IssuesIcon from 'material-ui-icons/Dashboard'

const styles = theme => ({
    root: {
        maxWidth: 360,
        background: theme.palette.background.paper,
        width: 250,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    link: {
        textDecoration: 'none'
    },
    selected_item: {
        background: '#d2d2d2'
    }
});

const ADMIN = 'ADMIN';
const COUNTRY_MANAGER = 'MANAGER';
const CONTENT_MANAGER = 'CONTENT';

class AppDrawer extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {content_expanded: false};
    }

    //check if menu item available for current user role
    isOkToShowForUser = item => {
        //ADMIN - all available
        //COUNTRY_MANAGER - all except accounts
        //CONTENT_MANAGER - only home and content

        //todo rewrite this
        const r = this.props.role;
        if (r === ADMIN)
            return true;
        if (r === COUNTRY_MANAGER) {
            if (item !== 'accounts')
                return true;
        }
        if (r === CONTENT_MANAGER) {
            if (item !== 'content'
                && item !== 'issues'
                && item !== 'periods'
                && item !== 'journals'
                && item !== 'locales'
                && item !== 'home'
                && item !== ''
            )
                return false;
        }

        return true;
    };

    toggleContent = () => this.setState({content_expanded: !this.state.content_expanded});

    render() {
        const {classes} = this.props;

        const drawer = (
            <div className={classes.root}>
                <List>
                    {this.isOkToShowForUser('home') ?
                        <div>
                            <a className={classes.link} href="/">
                                <ListItem className={this.props.action === 'home' ? classes.selected_item : null} selected button>
                                    <ListItemIcon>
                                        <HomeIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Home"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('accounts') ?
                        <div>
                            <a className={classes.link} href="/accounts">
                                <ListItem button className={this.props.action === 'accounts' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <AccountsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Accounts"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('downloader') ?
                        <div>
                            <a className={classes.link} href="/downloader">
                                <ListItem button className={this.props.action === 'downloader' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <AccountsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Downloader"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('realm_payment_types') ?
                        <div>
                            <a className={classes.link} href="/realm_payment_types">
                                <ListItem button className={this.props.action === 'realm_payment_types' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <AccountsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Realm Payment Types"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('realms') ?
                        <div>
                            <a className={classes.link} href="/realms">
                                <ListItem button className={this.props.action === 'realms' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <RealmsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Realms"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('operators') ?
                        <div>
                            <a className={classes.link} href="/operators">
                                <ListItem button className={this.props.action === 'operators' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <RealmsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Operators"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('bundles') ?
                        <div>
                            <a className={classes.link} href="/bundles">
                                <ListItem button className={this.props.action === 'bundles' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <BundleIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Bundles"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('bundle_accesses') ?
                        <div>
                            <a className={classes.link} href="/bundle_accesses">
                                <ListItem button className={this.props.action === 'bundle_accesses' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <BundleIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Bundle accesses"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('journals') ?
                        <div>
                            <a className={classes.link} href="/journals">
                                <ListItem button className={this.props.action === 'journals' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <JournalsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Journals"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('periods') ?
                        <div>
                            <a className={classes.link} href="/periods">
                                <ListItem button className={this.props.action === 'periods' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <PeriodsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Periods"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('issues') ?
                        <div>
                            <a className={classes.link} href="/issues">
                                <ListItem button className={this.props.action === 'issues' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <IssuesIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Issues"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {/*{this.isOkToShowForUser('content') ?*/}
                        {/*<div>*/}
                            {/*<ListItem button className={this.props.action === 'home' ? classes.selected_item : null} onClick={this.toggleContent}>*/}
                                {/*<ListItemIcon>*/}
                                    {/*<ContentIcon/>*/}
                                {/*</ListItemIcon>*/}
                                {/*<ListItemText inset primary="Content"/>*/}
                                {/*{this.state.content_expanded ? <ExpandLess/> : <ExpandMore/>}*/}
                            {/*</ListItem>*/}
                            {/*<Collapse component="li" in={this.state.content_expanded} timeout="auto" unmountOnExit>*/}
                                {/*<List disablePadding>*/}
                                    {/*<a className={classes.link} href="/issues">*/}
                                        {/*<ListItem button className={classes.nested}>*/}
                                            {/*<ListItemIcon>*/}
                                                {/*<AddIcon/>*/}
                                            {/*</ListItemIcon>*/}
                                            {/*<ListItemText inset primary="Add"/>*/}
                                        {/*</ListItem>*/}
                                    {/*</a>*/}
                                    {/*<ListItem button className={classes.nested}>*/}
                                        {/*<ListItemIcon>*/}
                                            {/*<ContentListIcon/>*/}
                                        {/*</ListItemIcon>*/}
                                        {/*<ListItemText inset primary="List"/>*/}
                                    {/*</ListItem>*/}
                                {/*</List>*/}
                            {/*</Collapse>*/}
                            {/*<Divider/>*/}
                        {/*</div> : null}*/}
                    {this.isOkToShowForUser('users') ?
                    <div>
                        <ListItem button className={this.props.action === 'users' ? classes.selected_item : null}>
                            <ListItemIcon>
                                <UsersIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Users"/>
                        </ListItem>
                        <Divider/>
                    </div> : null}
                    {this.isOkToShowForUser('payment_systems') ?
                    <div>
                        <ListItem button>
                            <ListItemIcon className={this.props.action === 'payment_systems' ? classes.selected_item : null}>
                                <PaymentsIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Payment systems"/>
                        </ListItem>
                        <Divider/>
                    </div> : null}
                    {this.isOkToShowForUser('locales') ?
                        <div>
                            <a className={classes.link} href="/locales">
                                <ListItem button className={this.props.action === 'locales' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <LocalesIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Locales"/>
                                </ListItem>
                            </a>
                            <Divider/>
                        </div> : null}
                    {this.isOkToShowForUser('settings') ?
                        <div>
                            <a className={classes.link} href="/settings">
                                <ListItem button className={this.props.action === 'settings' ? classes.selected_item : null}>
                                    <ListItemIcon>
                                        <SettingsIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary="Settings"/>
                                </ListItem>
                            </a>
                        </div> : null}
                </List>
                <Divider/>
            </div>
        );

        return (
            <Drawer onRequestClose={this.props.changer} open={this.props.drawer_open}>
                {drawer}
            </Drawer>
        )
    }
}

export default withStyles(styles, {withTheme: true})(AppDrawer)