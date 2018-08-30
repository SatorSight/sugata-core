import * as React from 'react';
import {PureComponent} from 'react';
import {withStyles} from 'material-ui/styles';
import ImageAsync from './crud/ImageAsync';
import Typography from 'material-ui/Typography';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    issue: {
        width: '10%',
        margin: '0.5rem 1rem',
        fontSize: '1rem',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        minHeight: '20rem',
    },
    title: {
        height: '2.5em',
        fontWeight: 'bold',
    },
    link: {
        textDecoration: 'none',
        color: 'black',
    }
});

class IssuesBoard extends PureComponent {
    constructor(props) {
        super(props);
    }

    getDateString = date => {
        const dateObj = new Date(date);
        return dateObj.toDateString()
    };

    render() {
        const {classes} = this.props;
        return <div>
            <Typography type="headline" component="h2">Last issues added</Typography>
            <br/>
            <br/>
            <div className={classes.container}>
                {this.props.data.map(issue =>
                    <div key={`issues_board_${issue.id}`} className={classes.issue}>
                        <a className={classes.link} href={`/content/add?id=${issue.id}`}>
                            <div className={classes.image}>
                                <ImageAsync
                                    klass={classes.image}
                                    src={issue.image_path}
                                    alt={`issue ${issue.id}`}
                                />
                            </div>
                            <div>
                                <div className={classes.title}>
                                    {issue.journal_name}
                                </div>
                                <div>
                                    {this.getDateString(issue.content_date)}
                                    <br/>
                                    №{issue.number}
                                </div>
                            </div>
                        </a>
                    </div>
                )}
            </div>
        </div>
    }
}

export default withStyles(styles, {withTheme: true})(IssuesBoard);