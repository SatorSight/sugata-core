import * as React from 'react';
import {Component} from 'react';

import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

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
    button: {
        margin: theme.spacing.unit,
    },
});

class CropDialog extends Component {
    constructor(props) {
        super(props);
    }

    crop = () => {
        const _this = this;
        this.refs.cropper.getCroppedCanvas().toBlob(function (blob) {

            _this.props.enable_waiter();

            const upload_url = _this.props.type === 'big' ? 'upload_big_preview' : 'upload_small_preview';
            let formData = new FormData();
            formData.append('article_id', _this.props.article_id);
            formData.append('cropped_image', blob);
            fetch(upload_url, { method: 'POST', body: formData, credentials: 'include' })
                .then(r => r.json())
                .then(r => {
                    console.log(r);
                    _this.props.crop_callback(r.data, _this.props.article_id);
                })
                .then(r => {
                    _this.props.disable_waiter();
                    _this.props.closer();
                });
        }, 'image/jpeg');
    };

    render() {
        const {classes} = this.props;
        const aspect = this.props.type === 'big' ? 588 / 240 : 1;

        return (
            <div> {this.props.image ?
                <Dialog
                    maxWidth={'md'}
                    fullWidth={true}
                    className={classes.dialog}
                    ignoreBackdropClick={true}
                    open={this.props.open}
                    onRequestClose={this.props.closer}>
                    <DialogTitle>{this.props.title}</DialogTitle>
                    <DialogContent>
                        <div>
                            <Cropper
                                ref='cropper'
                                src={this.props.image.path}
                                style={{height: 600, width: '100%'}}
                                aspectRatio={aspect}
                                guides={false}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div>
                            <Button onClick={this.crop} raised color="primary" className={classes.button}>
                                Crop
                            </Button>
                        </div>
                        <Button onClick={this.props.closer} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog> : null }
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(CropDialog)