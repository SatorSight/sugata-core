import * as React from 'react';
import {Component} from 'react';

import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import * as SUtils from './helpers/SUtils';

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

class PreviewDialog2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_page_number: props.selected_number
        };
    }

    componentWillReceiveProps(nextProps){
        if(this.state.selected_page_number !== nextProps.selected_number)
            this.setState({ selected_page_number: nextProps.selected_number })
    }

    getSelectedArticle = () => {
        let selected = this.props.articles.find(article => article.page_number === this.state.selected_page_number);
        if(!selected && this.props.articles.length > 0)
            selected = this.props.articles[0];
        return selected;
    };
    getArticleByPage = number => this.props.articles.find(article => article.page_number === number);

    changePage = event => {
        const page_number = parseInt(event.target.value);
        if(!SUtils.empty(page_number)){
            if(this.getArticleByPage(page_number)) {
                this.setState({ selected_page_number: page_number })
            }
        }
    };

    changePageButton = action => {
        if(action === 'prev'){
            if(this.state.selected_page_number > SUtils.first(this.props.articles).page_number){
                const next_page_number = this.state.selected_page_number - 1;
                this.setState({selected_page_number: next_page_number});
            }
        }
        else if(action === 'next'){
            if(this.state.selected_page_number < SUtils.last(this.props.articles).page_number){
                const next_page_number = this.state.selected_page_number + 1;
                this.setState({selected_page_number: next_page_number});
            }
        }
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Dialog
                        maxWidth={'md'}
                        fullWidth={true}
                        className={classes.dialog}
                        ignoreBackdropClick={true}
                        open={this.props.open}
                        onRequestClose={this.props.closer}>
                    <DialogTitle>Issue preview</DialogTitle>
                    <DialogContent>
                        <style dangerouslySetInnerHTML={{__html: `.preview-page img{max-width: 100%}`}} />
                        <div
                            className={'preview-page'}
                            style={{width: 'auto'}}
                            dangerouslySetInnerHTML={{__html: this.getSelectedArticle().html}}>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div>
                            <TextField
                                id="number"
                                label="Enter page number"
                                value={this.state.selected_page_number}
                                onChange={this.changePage}
                                type="number"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                        </div>
                        <div>
                            <Button onClick={() => this.changePageButton('prev')} raised color="primary" className={classes.button}>
                                Prev
                            </Button>
                            <Button onClick={() => this.changePageButton('next')} raised color="primary" className={classes.button}>
                                Next
                            </Button>
                        </div>
                        <Button onClick={this.props.closer} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(PreviewDialog2)