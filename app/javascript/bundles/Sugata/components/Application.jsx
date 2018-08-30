import React from 'react';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Paper from 'material-ui/Paper';


import Accounts from './pages/Accounts'
import Downloader from './pages/Downloader'
import Bundles from './pages/Bundles'
import Realms from './pages/Realms'
import Journals from './pages/Journals'
import Operators from './pages/Operators'
import Periods from './pages/Periods'
import Issues from './pages/Issues'
import BundleAccesses from './pages/BundleAccesses'
import RealmPaymentTypes from './pages/RealmPaymentTypes'
import Locales from './pages/Locales'
import Settings from './pages/Settings'
import Home from './pages/Home'

import ContentAdder from './ContentAdder'


import {Card, CardTitle} from 'material-ui/Card';

import indigo from 'material-ui/colors/indigo';
import purple from 'material-ui/colors/purple';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';

import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import AppDrawer from './AppDrawer'

const theme = createMuiTheme({
    palette: {
        // primary: purple, // Purple and green play nicely together.
        primary: indigo, // Purple and green play nicely together.
        secondary: {
            ...green,
            A400: '#00e677',
        },
        error: red,
    },
    // palette: {
    //     type: 'light', // Switching the dark mode on is a single property value change.
    // },
});


const styles = {
    root: {
        width: '100%',
        display: 'inline-block',
        minWidth: '1500px'
    },
    paperRoot: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16
        // marginTop: theme.spacing.unit * 3,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

export default class Application extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            drawer_open: false
        };
    }

    //some sort of router
    renderAction = action => {
        if(action === 'accounts')
            return <Accounts
                pack={this.props}
                />;
        if(action === 'download')
            return <Downloader
                {...this.props}
            />;
        if(action === 'bundles')
            return <Bundles
                pack={this.props}
                />;
        if(action === 'periods')
            return <Periods
                pack={this.props}
            />;
        if(action === 'realms')
            return <Realms
                pack={this.props}
            />;
        if(action === 'journals')
            return <Journals
                pack={this.props}
            />;
        if(action === 'issues')
            return <Issues
                pack={this.props}
            />;
        if(action === 'locales')
            return <Locales
                pack={this.props}
            />;
        if(action === 'settings')
            return <Settings
                pack={this.props}
            />;
        if(action === 'operators')
            return <Operators
                pack={this.props}
            />;
        if(action === 'bundle_accesses')
            return <BundleAccesses
                pack={this.props}
            />;
        if(action === 'realm_payment_types')
            return <RealmPaymentTypes
                pack={this.props}
            />;
        if(action === 'content_add')
            return <ContentAdder {...this.props} />;
        if(action === 'home')
            return <Home {...this.props} />;
    };

    handleDrawerOpen = () => this.setState({drawer_open: !this.state.drawer_open});

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div style={styles.root}>
                    <AppDrawer role={this.props.role}
                               action={this.props.action}
                               changer={this.handleDrawerOpen}
                               drawer_open={this.state.drawer_open}/>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                onClick={this.handleDrawerOpen}
                                style={styles.menuButton} color="contrast" aria-label="Menu">
                                <MenuIcon/>
                            </IconButton>
                            <Typography type="title" color="inherit" style={styles.flex}>
                                Sugata Platform
                            </Typography>
                            <a style={{textDecoration: 'none'}} rel="nofollow" href="/accounts/sign_out">
                                <Button color="contrast">Logout</Button>
                            </a>
                        </Toolbar>
                    </AppBar>
                    <Paper style={styles.paperRoot} elevation={4}>
                        {this.renderAction(this.props.action)}
                    </Paper>
                </div>
            </MuiThemeProvider>
        );
    }
}