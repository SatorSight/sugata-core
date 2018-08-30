import * as React from 'react';
import {Component} from 'react';

import Drawer from 'material-ui/Drawer';
import AddIcon from 'material-ui-icons/Add';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import DeleteIcon from 'material-ui-icons/Delete';
import Tooltip from 'material-ui/Tooltip';
import Waiter from './Waiter'

import Dropzone from 'react-dropzone';
// import Editor from './Editor';
import Editor from './Editor2';
// import Editor3 from './Editor3';
import PreviewDialog from './PreviewDialog2';
import ErrorMessage from './ErrorMessage';
// import PreviewDialog from './PreviewDialog';
import DesktopPreviewDrawer from './DesktopPreviewDrawer';

import Dialog from 'material-ui/Dialog';

import PublishIcon from 'material-ui-icons/Publish';
import SmallPreviewIcon from 'material-ui-icons/Crop75';
import BigPreviewIcon from 'material-ui-icons/Crop169';
import PreviewIcon from 'material-ui-icons/PlayCircleFilled';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import AssistantIcon from 'material-ui-icons/Assistant'
import StarIcon from 'material-ui-icons/Star'

import Clipboard from 'react-clipboard.js';
const request = require('superagent');
import Snackbar from 'material-ui/Snackbar';

import * as SUtils from './helpers/SUtils';

import Button from 'material-ui/Button';
import Save from 'material-ui-icons/Save';

import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import ButtonBased from 'material-ui/ButtonBase/ButtonBase';
import CropDialog from './CropDialog'

const drawerWidth = 140;
const drawerHeight = 700;

const styles = theme => ({
    root: {
        width: '100%',
        height: 430,
        marginTop: theme.spacing.unit * 3,
        zIndex: 1,
        overflow: 'hidden',
    },
    hidden: {
        display: 'none'
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        width: `calc(100% - ${drawerWidth}px)`,
    },
    'appBar-left': {
        marginLeft: drawerWidth,
    },
    'appBar-right': {
        marginRight: drawerWidth,
    },
    pagerIcon: {
        width: '23px',
        zIndex: 1
    },
    pageNumber: {
        background: '#3f51b5',
        color: 'white',
        borderRadius: '20px',
        width: '25px',
        height: '20px',
        paddingTop: '5px',
        textAlign: 'center'

    },
    pageNumberWhite: {
        background: '#fff',
        color: '#3f51b5',
        borderRadius: '20px',
        width: '25px',
        height: '20px',
        paddingTop: '5px',
        textAlign: 'center'
    },
    drawerPaper: {
        position: 'relative',
        height: drawerHeight,
        width: drawerWidth,
    },
    drawerHeader: theme.mixins.toolbar,
    content: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
        padding: theme.spacing.unit * 3,
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 0,
        },
    },
    fab: {
        margin: theme.spacing.unit * 2,
    },
    item: {
        width: `120px`,
        height: '40px',
        // padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        cursor: 'pointer',
    },
    itemContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'flex-start',
        width: '100%',
        height: '100%',
        flexWrap: 'wrap',
        position: 'absolute',
        overflowY: 'scroll',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
    },
    drop_wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },
    drop_label: {
        textAlign: 'center'
    },
    drop_image: {
        maxWidth: '360px',
        maxHeight: '500px',
    },
    field: {
        marginBottom: '20px'
    },
    images_container: {
        display: 'flex',
        alignItems: 'flex-start',
        marginTop: '20px',
        flexWrap: 'wrap'
    },
    icon_wrapper: {
        background: 'white',
        borderRadius: '5px',
        border: '1px solid gray',
        padding: '3px',
        margin: '3px',
        cursor: 'pointer'
    },
    article_icon_container: {
        display: 'flex',
        flexFlow: 'column wrap'
    },
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    specialIcon:{
        position: 'absolute',
        marginLeft: '-25px',
        marginTop: '-31px'
    },
    buttonUpload: {
        position: 'relative',
        float: 'right',
        marginRight: '10px'
    },
    buttonContainer: {
        position: 'fixed',
        right: '10px',
        bottom: '10px'
    },
    chosen: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    pageLabel: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '25px',
        fontWeigth: 'bold'
    }
});

class ContentAdder extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        let article = {
            page_number: 1,
            html: '',
            images: [],
            reference: null,
        };

        let articles = props.articles;
        if(SUtils.empty(articles))
            articles = [article];
        else
            articles.sort((a, b) => a.page_number - b.page_number);

        this.state = {
            articles: articles,
            last_article_number: articles.length,
            article_number_selected: SUtils.first(articles).page_number,
            preview_dialog_open: false,
            desktop_preview_drawer_open: false,

            big_preview_dialog_open: false,
            small_preview_dialog_open: false,
            selected_preview_image: null,

            snackbar_open: false,
            alerts: null,
            content: 'content',
            accepted: [],
            rejected: [],
            uploaded_images: this.props.images,
            uploader_dialog_open: false,
            uploader_pdf_dialog_open: false,
            uploader_snackbar_open: false,
            remove_article_snackbar_open: false,
            waiter_enabled: false,

            big_preview_images: this.props.big_previews,
            small_preview_images: this.props.small_previews,

            error_message: null,
            error_message_open: false,
        };

        this.article_refs = {};
    }

    openErrorDialog = message => this.setState({
        error_message: message,
        error_message_open: true,
    });

    closeErrorDialog = () => this.setState({error_message_open: false});

    getSelectedArticle = () => {
        const articles = this.state.articles;
        let selected = null;
        articles.map(article => {
            if(article.page_number === this.state.article_number_selected)
                selected = article;
        });

        if(!selected && articles.length > 0)
            selected = articles[0];
        return selected;
    };

    updateArticle = (article, callback) => {
        this.setState({ articles: this.state.articles.map(a => {
            if(a.page_number === article.page_number)
                return article;
            return a;
        }) }, callback());
    };

    //do not touch this, its used and working
    onChange = (evt) => {
        let article = this.getSelectedArticle();
        article.html = evt.editor.getData();
        this.updateArticle(article);
    };

    onDrop = (accepted, rejected) => {
        this.setState({ accepted, rejected });

        if(SUtils.any(accepted)){
            const req = request.post('/image/load');
            // const ar_id = this.getSelectedArticle().id;
            req.field('id', this.props.id);
            req.field('page_number', this.state.article_number_selected);
            accepted.forEach((file, i) => req.attach('image'+i, file));
            req.end((err, res) => {
                let result = JSON.parse(res.text);
                if(result.result === SUtils.OK_RESULT){
                    let uploaded_images = this.state.uploaded_images;
                    uploaded_images = uploaded_images.concat(result.images);
                    this.setState({ uploaded_images }, () => {console.log(this.state.uploaded_images)});
                }
            });
        }
    };

    snackbarClose = () => this.setState({ snackbar_open: false });
    snackbarOpen = () => this.setState({ snackbar_open: true }, () => {
        setTimeout(() => {this.snackbarClose()}, 2000);
    });

    uploadSnackbarClose = () => this.setState({ uploader_snackbar_open: false });
    uploadSnackbarOpen = () => this.setState({ uploader_snackbar_open: true }, () => {
        setTimeout(() => {this.uploadSnackbarClose()}, 2000);
    });

    removeArticleSnackbarClose = () => this.setState({ remove_article_snackbar_open: false });
    removeArticleSnackbarOpen = () => this.setState({ remove_article_snackbar_open: true }, () => {
        setTimeout(() => {this.removeArticleSnackbarClose()}, 2000);
    });

    openUploadDialog = () => this.setState({ uploader_dialog_open: true });
    closeUploadDialog = () => this.setState({ uploader_dialog_open: false });

    openUploadPdfDialog = () => this.setState({ uploader_pdf_dialog_open: true });
    closeUploadPdfDialog = () => this.setState({ uploader_pdf_dialog_open: false });

    validateResult = (err, res) => {
        if(err){
            return this.showError('server error occured', err);
        }

        try {
            JSON.parse(res.text);
        }catch (e){
            return this.showError('error parsing result', e);
        }

        const result = JSON.parse(res.text);
        if(!result || (result.result !== SUtils.OK_RESULT)){
            return this.showError('error result output');
        }
        return true;
    };

    showError = (message, error) => {
        console.log(message);
        if(error)
            console.log(error);
        this.disableWaiter();
        this.openErrorDialog(error ? error.message : 'Something went wrong');
        return false;
    };

    onUploadDrop = accepted => {
        this.closeUploadDialog();
        this.enableWaiter();
        if(SUtils.any(accepted)){
            const req = request.post('/issues/load_archive');
            req.field('issue_id', this.props.id);
            req.field('page_number', this.state.article_number_selected);
            accepted.forEach((file, i) => req.attach('archive', file));
            req.end((err, res) => {
                const valid = this.validateResult(err,res);
                if(!valid)
                    return false;
                this.uploadSnackbarOpen();
                this.disableWaiter();
                location.reload();
            });
        }
    };

    onUploadPdfDrop = accepted => {
        this.closeUploadPdfDialog();
        this.enableWaiter();
        if(SUtils.any(accepted)){
            this.closeUploadPdfDialog();
            this.setState({waiter_enabled: true});
            const req = request.post('/issues/load_pdf');
            req.field('issue_id', this.props.id);
            accepted.forEach((file, i) => req.attach('pdf', file));
            req.end((err, res) => {
                const valid = this.validateResult(err,res);
                if(!valid)
                    return false;
                this.uploadSnackbarOpen();
                this.disableWaiter();
                location.reload();
            });
        }
    };

    getText = (path) => {
        this.insertImageToEditor(path);
        return path;
    };
    onSuccess = () => {
        //#todo add snackbar
    };

    selectArticle = page_number => {
        if(page_number !== this.state.article_number_selected)
            this.updateArticlesHtml(this.setState({ article_number_selected: page_number }));
    };

    newArticle = () => {
        const article = {
            page_number: this.state.last_article_number + 1,
            html: '',
            images: [],
            reference: null,
            title: this.props.title ? this.props.title : '',
        };
        let articles = this.state.articles;
        articles.push(article);

        this.updateArticlesHtml(this.setState({
            articles: articles,
            last_article_number: this.state.last_article_number + 1,
            article_number_selected: this.state.last_article_number + 1
        }));
    };

    updateArticlesHtml = (callback = null) => {
        let articles = SUtils.clone_array(this.state.articles);
        const refs = Object.assign({}, this.article_refs);

        Object.keys(refs).map(key => {
            articles.map((article, i) => {
                if(article.page_number === parseInt(key))
                    articles[i].html = refs[key].state.html;
            })
        });

        this.setState({ articles }, callback);
    };

    removeImage = image_id => {
        const images = this.state.uploaded_images;
        let uploaded_images = [];

        images.map(img => {
            if(img.id !== image_id)
                uploaded_images.push(img);
        });

        this.setState({ uploaded_images }, this.destroyImageOnServer(image_id));
    };

    destroyImageOnServer = id => {
        const query = `/images/delete?id=${id}`;
        fetch(query, {
            method: "DELETE",
            credentials: 'include'
        });
    };

    updateSelectedArticleTitle = (title) => {
        let article = null;
        this.state.articles.map(a => {
            if(a.page_number === this.state.article_number_selected)
                article = a;
        });
        article.title = title;
    };

    updateSelectedArticleHTML = html => {
        const article = this.getSelectedArticle();
        //todo rewrite
        let changed_article = article;
        changed_article.html = html;
        this.updateArticle(changed_article, () => this.setEditorHtml(html));
    };

    changeTitle = event => {
        this.updateArticlesHtml(
            this.updateSelectedArticleTitle(event.target.value)
        );
    };

    makeQuery = (payload, method, query, callbacks) => {
        let data = new FormData();
        data.append("json", JSON.stringify(payload));

        fetch(`/${query}/`,
            {
                method: method,
                body: data,
                credentials: 'include'
            })
            .then(res => res.json())
            .then(function(data){
                if(SUtils.any(callbacks))
                    callbacks.map(c => c(data));
                    // callback(data);
            })
    };

     saveAll = () => this.updateArticlesHtml(this._saveAll);
    _saveAll = () => {
        this.enableWaiter();
        const query = `issue/save_articles`;
        const articles = this.state.articles.map((article) => {
            return {
                title: article.title,
                html: article.html,
                page_number: article.page_number,
                issue_id: this.props.id,
                images: this.uploadedImagesForPage(article.page_number)
            };
        });

        let payload = { data: articles };

        this.makeQuery(payload, 'POST', query, [this.snackbarOpen, this.disableWaiter]);
    };

    openPreview = () => this.setState({ preview_dialog_open: true });
    closePreview = () => this.setState({ preview_dialog_open: false });

    openDesktopPreview = () => this.setState({ desktop_preview_drawer_open: true });
    closeDesktopPreview = () => this.setState({ desktop_preview_drawer_open: false });

    openBigPreviewDialog = () => this.setState({ big_preview_dialog_open: true });
    closeBigPreviewDialog = () => this.setState({ big_preview_dialog_open: false });

    openSmallPreviewDialog = () => this.setState({ small_preview_dialog_open: true });
    closeSmallPreviewDialog = () => this.setState({ small_preview_dialog_open: false });

    uploadedImagesForPage = page => {
        let images = [];
        this.state.uploaded_images.map(image => {
            if(image.page_number === page)
                images.push(image);
        });
        return images;
    };

    bigPreviewSelected = () => {
        const big_previews = this.state.big_preview_images;
        return big_previews.find(p => p.article_id === this.getSelectedArticle().id);
    };

    smallPreviewSelected = () => {
        const small_previews = this.state.small_preview_images;
        return small_previews.find(p => p.article_id === this.getSelectedArticle().id);
    };

    removeArticle = article => confirm('Sure?') ? this.deleteArticle(article) : false;
    deleteArticle = article => {
        if(article.id === undefined){
            this.removeArticleSnackbarOpen();
            this.removeArticleByPageFromState(article.page_number);
        }
        const article_id = article.id;
        fetch(`/content/destroy_article/${article_id}/`,{method: 'delete', credentials: 'include'})
            .then(res => res.json())
            .then(res => {
                if(res.result === SUtils.OK_RESULT){
                    this.removeArticleSnackbarOpen();
                    this.removeArticleFromState(article_id);
                }
            })
    };

    removeArticleFromState = article_id => {
        //todo refactor this
        const articles = this.state.articles.slice();
        let new_articles = [];
        articles.map(article => {
            if(article.id !== article_id)
                new_articles.push(article);
        });
        this.setState({articles: new_articles});
    };

    removeArticleByPageFromState = page_number => {
        //todo refactor this
        const articles = this.state.articles.slice();
        let new_articles = [];
        articles.map(article => {
            if(article.page_number !== page_number)
                new_articles.push(article);
        });
        this.setState({articles: new_articles});
    };

    // todo rewrite to DRY

    toggleChosenForArticle = (article, checked) => {
        const articles = this.state.articles.slice();
        let new_articles = [];
        articles.map(a => {
            if(article.id === a.id)
                a.chosen = checked;
            new_articles.push(a);
        });
        this.makeQuery({id: article.id}, 'POST', 'change_article_chosen/' +
            article.id + '/' + (checked ? 1 : 0), [() => this.setState({articles: new_articles})])
    };

    toggleShowInListsForArticle = (article, checked) => {
        const articles = this.state.articles.slice();
        let new_articles = [];
        articles.map(a => {
            if(article.id === a.id)
                a.show_in_lists = checked;
            new_articles.push(a);
        });
        this.makeQuery({id: article.id}, 'POST', 'change_article_show_in_lists/' +
            article.id + '/' + (checked ? 1 : 0), [() => this.setState({articles: new_articles})])
    };

    toggleCoverForArticle = (article, checked) => {
        const articles = this.state.articles.slice();
        let new_articles = [];
        articles.map(a => {
            if(article.id === a.id)
                a.cover = checked;
            new_articles.push(a);
        });
        this.makeQuery({id: article.id}, 'POST', 'change_article_cover/' +
            article.id + '/' + (checked ? 1 : 0), [() => this.setState({articles: new_articles})])
    };

    toggleLinkedForArticle = (article, checked) => {
        const articles = this.state.articles.slice();
        let new_articles = [];
        articles.map(a => {
            if(article.id === a.id)
                a.linked = checked;
            new_articles.push(a);
        });
        this.makeQuery({id: article.id}, 'POST', 'change_article_linked/' +
            article.id + '/' + (checked ? 1 : 0), [() => this.setState({articles: new_articles})])
    };

    enableWaiter = () => this.setState({waiter_enabled: true});
    disableWaiter = () => this.setState({waiter_enabled: false});

    setEditorHtml = html => {
        const article = this.getSelectedArticle();
        this.article_refs[article.page_number].setHtml(html);
    };

    insertImageToEditor = image_path => {
        this.article_refs[this.state.article_number_selected].insertImage(image_path);
    };

    jpegify = () => {
        this.enableWaiter();

        const current_article = this.getSelectedArticle();
        const query = `make_article_html_jpeg`;
        let payload = { article_id: current_article.id };

        this.makeQuery(payload, 'POST', query, [(data) => {
            this.updateSelectedArticleHTML(data.data.html);
            this.disableWaiter();
            this.snackbarOpen();
        }]);
    };

    bigPreviewDialogOpen = image => {
        this.setState({selected_preview_image: image}, this.openBigPreviewDialog);
    };

    smallPreviewDialogOpen = image => {
        this.setState({selected_preview_image: image}, this.openSmallPreviewDialog);
    };

    cropBigCallback = (image, article_id) => {
        this.setPreview(image, 'big' ,article_id);
    };

    cropSmallCallback = (image, article_id) => {
        this.setPreview(image, 'small' ,article_id);
    };

    setPreview = (image, type, article_id) => {
        const array = type === 'big' ? this.state.big_preview_images : this.state.small_preview_images;
        const key = type === 'big' ? 'big_preview_images' : 'small_preview_images';

        const existing_preview = array.find(e => e.article_id === article_id);
        let new_array = [];

        if(!existing_preview){
            new_array = array.slice(0);
            new_array.push({
                article_id: article_id,
                image: image
            });
        }else{
            new_array = array.map(a => {
                if(a.article_id === article_id){
                    let new_preview = Object.assign({}, a);
                    new_preview.image = image;
                    return new_preview;
                }
                return a;
            });
        }

        this.setState({ [key]: new_array });
    };

    logArticles = () => console.log(this.state.articles);

    render() {
        const {classes} = this.props;

        const drawer =
            <Drawer
                type="permanent"
                classes={{paper: classes.drawerPaper}}
                anchor="left"
            >
                <div className={classes.itemContainer}>
                    <Tooltip id="tooltip-fab" className={classes.fab} title="Add" placement="bottom">
                        <Button onClick={this.newArticle} fab color="primary" aria-label="Add">
                            <AddIcon />
                        </Button>
                    </Tooltip>
                    {this.state.articles.map(article =>
                        <div key={`page_drawer.button.${article.page_number}`}>
                            <Paper
                                onClick={() => this.selectArticle(article.page_number)}
                                className={classes.item}
                                elevation={4}
                            >
                                <ButtonBased>
                                    <div className={article.show_in_lists ? classes.pageNumber : classes.pageNumberWhite}>
                                        <b>
                                            {article.page_number}
                                        </b>
                                    </div>
                                </ButtonBased>
                                {article.chosen ? <div>
                                    <IconButton className={classes.pagerIcon}>
                                        <AssistantIcon/>
                                    </IconButton>
                                </div> : null}
                                {article.cover ? <div>
                                    <IconButton className={classes.pagerIcon}>
                                        <StarIcon/>
                                    </IconButton>
                                </div> : null}
                                <div>
                                    <IconButton className={classes.pagerIcon} onClick={() => this.removeArticle(article)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            </Paper>
                        </div>
                    )}
                </div>
            </Drawer>;

        const desktopPreviewDrawer = SUtils.any(this.state.articles)
            ? <DesktopPreviewDrawer
            open={this.state.desktop_preview_drawer_open}
            closer={this.closeDesktopPreview}
            articles={this.state.articles} />
            : null;

        const selected_big_prevew = this.bigPreviewSelected();
        const selected_small_prevew = this.smallPreviewSelected();

        return (
            <div>
                <ErrorMessage message={this.state.error_message} open={this.state.error_message_open} />
                <div className={classes.appFrame}>
                    {drawer}
                    <main className={classes.content}>
                        <div>
                            <Button onClick={this.jpegify} disabled={!this.getSelectedArticle() || SUtils.empty(this.getSelectedArticle().desktop_html)} className={classes.buttonUpload} raised color="primary" dense>
                                Make it JPEG
                            </Button>
                            <Button onClick={this.logArticles} className={classes.buttonUpload} raised color="primary" dense>
                                LOG[temp]
                            </Button>
                            <Button onClick={this.openUploadDialog} raised color="primary" className={classes.buttonUpload} dense>
                                Upload zip archive
                            </Button>
                            <Button onClick={this.openUploadPdfDialog} raised color="primary" className={classes.buttonUpload} dense>
                                Upload PDF
                            </Button>
                        </div>
                        <Typography  type="headline" component="h3">Title</Typography>
                        <TextField
                            className={classes.field}
                            margin="dense"
                            name={'title'}
                            type={'text'}
                            fullWidth
                            required={true}
                            value={this.getSelectedArticle()
                                ? (this.getSelectedArticle().title ? this.getSelectedArticle().title : '')
                                : ''}
                            onChange={this.changeTitle} />
                        <Typography  type="headline" component="h3">Create article with HTML editor</Typography>
                        {this.state.articles.map((article) =>
                            <div className={article.page_number !== this.state.article_number_selected ? classes.hidden : SUtils.OK_RESULT} key={article.page_number}>
                                <div className={classes.chosen}>
                                    <Typography className={classes.pageLabel}>Page {this.state.article_number_selected}</Typography>
                                    <div>
                                        <FormControlLabel control={
                                            <Switch
                                                checked={article.show_in_lists}
                                                onChange={(event, checked) => this.toggleShowInListsForArticle(article, checked)}
                                            />
                                        } label={'Show in lists'}/>
                                        <FormControlLabel control={
                                            <Switch
                                                checked={article.cover}
                                                onChange={(event, checked) => this.toggleCoverForArticle(article, checked)}
                                            />
                                        } label={'Cover'}/>
                                        <FormControlLabel control={
                                            <Switch
                                                checked={article.chosen}
                                                onChange={(event, checked) => this.toggleChosenForArticle(article, checked)}
                                            />
                                        } label={'Chosen'}/>
                                        <FormControlLabel control={
                                            <Switch
                                                checked={article.linked}
                                                onChange={(event, checked) => this.toggleLinkedForArticle(article, checked)}
                                            />
                                        } label={'Linked with next'}/>
                                    </div>
                                </div>
                                <Editor
                                    key={`ed${article.page_number}`}
                                    html={article.html}
                                    page_number={article.page_number}
                                    ref={editor => {this.article_refs[article.page_number] = editor}}
                                />
                                <Typography  type="headline" component="h3">Images</Typography>
                                <Dropzone
                                    onDrop={this.onDrop}
                                    accept="image/jpeg"
                                >
                                    <div className={classes.drop_wrapper}>
                                        <Typography className={classes.drop_label} type="headline" component="h5">Drop images to upload.</Typography>
                                    </div>
                                </Dropzone>
                            </div>
                        )}
                        <Typography type="headline" component="h3">Uploaded images</Typography>
                        <div className={classes.images_container}>{this.uploadedImagesForPage(this.state.article_number_selected).map(image =>
                            <div key={`uploaded_images${image.id}`}>
                                <div className={classes.icon_wrapper}>
                                    <Clipboard option-text={() => this.getText(image.path)} onSuccess={this.onSuccess}>
                                        <PublishIcon/>
                                    </Clipboard>
                                    <IconButton onClick={() => this.removeImage(image.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => this.bigPreviewDialogOpen(image)}>
                                        <BigPreviewIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => this.smallPreviewDialogOpen(image)}>
                                        <SmallPreviewIcon/>
                                    </IconButton>
                                </div>
                                <img className={classes.drop_image} src={image.path} alt=""/>
                            </div>
                        )}</div>
                        <div className={classes.previews}>
                            <Typography type="headline" component="h3">Big Preview</Typography>
                            {selected_big_prevew ? <div className={classes.images_container}>
                                <img
                                    className={classes.drop_image}
                                    src={selected_big_prevew.image.path}
                                    alt=""
                                />
                            </div> : ' - Not selected'}
                            <Typography type="headline" component="h3">Small preview</Typography>
                            {selected_small_prevew ? <div className={classes.images_container}>
                                <img
                                    className={classes.drop_image}
                                    src={selected_small_prevew.image.path}
                                    alt=""
                                />
                            </div> : ' - Not selected'}
                        </div>
                    </main>
                    {desktopPreviewDrawer}
                </div>
                <div className={classes.buttonContainer}>
                    <Button onClick={this.openDesktopPreview} className={classes.button} raised color="primary" dense>
                        <PreviewIcon className={classes.leftIcon} />
                        Desktop Preview
                    </Button>
                    <Button onClick={this.openPreview} className={classes.button} raised color="primary" dense>
                        <PreviewIcon className={classes.leftIcon} />
                        Preview
                    </Button>
                    <Button onClick={this.saveAll} className={classes.button} raised color="primary" dense>
                        <Save className={classes.leftIcon} />
                        Save
                    </Button>
                </div>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.snackbar_open}
                    onClose={this.snackbarClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Saved</span>}
                />
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.remove_article_snackbar_open}
                    onClose={this.removeArticleSnackbarClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Removed</span>}
                />
                <PreviewDialog
                    open={this.state.preview_dialog_open}
                    closer={this.closePreview}
                    selected_number={this.state.article_number_selected}
                    articles={this.state.articles} />

                <CropDialog
                    type={'big'}
                    title={'Big preview selection'}
                    enable_waiter={this.enableWaiter}
                    disable_waiter={this.disableWaiter}
                    article_id={this.getSelectedArticle().id}
                    image={this.state.selected_preview_image}
                    open={this.state.big_preview_dialog_open}
                    closer={this.closeBigPreviewDialog}
                    crop_callback={this.cropBigCallback}
                />
                <CropDialog
                    type={'small'}
                    title={'Small preview selection'}
                    enable_waiter={this.enableWaiter}
                    disable_waiter={this.disableWaiter}
                    article_id={this.getSelectedArticle().id}
                    image={this.state.selected_preview_image}
                    open={this.state.small_preview_dialog_open}
                    closer={this.closeSmallPreviewDialog}
                    crop_callback={this.cropSmallCallback}
                />

                <Dialog
                    className={classes.dialog}
                    open={this.state.uploader_dialog_open}
                    onRequestClose={this.closeUploadDialog}
                    onClose={this.closeUploadDialog}>
                    {/*<DialogTitle id="simple-dialog-title">Drop zip archive below</DialogTitle>*/}
                    <div>
                        <Dropzone
                            onDrop={this.onUploadDrop}
                            accept="application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream"
                        >
                            <div className={classes.drop_wrapper}>
                                <Typography className={classes.drop_label} type="headline" component="h5">Drop archive to upload</Typography>
                            </div>
                        </Dropzone>
                    </div>
                </Dialog>
                <Dialog
                    className={classes.dialog}
                    open={this.state.uploader_pdf_dialog_open}
                    onRequestClose={this.closeUploadPdfDialog}
                    onClose={this.closeUploadPdfDialog}>
                    <div>
                        <Dropzone
                            onDrop={this.onUploadPdfDrop}
                            accept="application/pdf"
                        >
                            <div className={classes.drop_wrapper}>
                                <Typography className={classes.drop_label} type="headline" component="h5">Drop PDF file to upload</Typography>
                            </div>
                        </Dropzone>
                    </div>
                </Dialog>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={this.state.uploader_snackbar_open}
                    onClose={this.uploadSnackbarClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Uploaded</span>}
                />
                <Waiter enabled={this.state.waiter_enabled}/>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(ContentAdder)