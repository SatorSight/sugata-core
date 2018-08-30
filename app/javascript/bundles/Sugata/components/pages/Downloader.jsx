import * as React from 'react';
import {PureComponent} from 'react';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Waiter from './../Waiter';

const styles = {
    existing_archives: {

    },
    archive_container: {
        display: 'flex',
        alignItems: 'center',
    },
    archive_name: {
        margin: '1rem',
    },
    archive_delete: {
        margin: '1rem',
    },
    archive_download: {
        margin: '1rem',
    },
    datepickers: {

    },
    from: {

    },
    to: {

    },
    create_button: {
        margin: '1rem',

    },
    refresh_button: {
        margin: '1rem',

    },
    delete_button: {
        height: '1rem',
    },
    label: {
        margin: '1rem',
    }

};

class Downloader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            waiter_enabled: false,
            from: null,
            to: null,
        };
    }

    enableWaiter = () => this.setState({waiter_enabled: true});
    disableWaiter = () => this.setState({waiter_enabled: false});

    createArchive = () => {
        this.enableWaiter();
            fetch('/create_archive', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: this.state.from,
                    to: this.state.to,
                }),
                credentials: 'include'
            })
                .then(r => r.json())
                .then(r => {
                    this.disableWaiter();
                    this.refresh();
                })
                .catch(() => {
                    this.showErrorMessage();
                    this.disableWaiter()
                });
    };

    showErrorMessage = () => alert('Error');

    deleteArchive = name => {
        this.enableWaiter();
        fetch(`/delete_archive/${name}`,{method: 'delete', credentials: 'include'})
            .then(res => res.json())
            .then(res => {
                this.disableWaiter();
                this.refresh();
            })
            .catch(() => {
                    this.showErrorMessage();
                    this.disableWaiter()
                });
    };

    refresh = () => location.reload();

    fromChanged = e => this.setState({from: e.target.value});
    toChanged = e => this.setState({to: e.target.value});

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Waiter enabled={this.state.waiter_enabled}/>
                <Typography type="headline" component="h2">Downloader</Typography>
                <Button className={classes.refresh_button} raised onClick={this.refresh} color="primary">
                    Refresh page
                </Button>
                <h2>Manage existing archives</h2>

                <div className={classes.existing_archives}>
                    {this.props.existing_archives.map((archive, i) =>
                        <div key={`archive_${i}`} className={classes.archive_container}>
                            <div className={classes.archive_name}>
                                {archive.name}
                            </div>
                            <Button className={classes.delete_button} raised onClick={() => this.deleteArchive(archive.name)} color="primary">
                                Delete
                            </Button>
                            <a href={archive.path} className={classes.archive_download}>Download</a>
                        </div>
                    )}
                </div>
                <h2>Or create new</h2>
                <h2>Select date interval</h2>
                <div className={classes.datepickers}>
                    <div className={classes.from}>
                        <label className={classes.label} htmlFor="from">From</label>
                        <input id="from" onChange={this.fromChanged} type="date"/>
                    </div>
                    <div className={classes.to}>
                        <label className={classes.label} htmlFor="to">To</label>
                        <input id="to" onChange={this.toChanged} type="date"/>
                    </div>
                </div>
                <Button className={classes.create_button} raised onClick={this.createArchive} color="primary">
                    Create
                </Button>
                <br/>
                <h3>Filesystem info:</h3>
                <pre>{this.props.file_system_info}</pre>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Downloader)