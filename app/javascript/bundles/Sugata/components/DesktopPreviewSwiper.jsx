import * as React from 'react';
import {Component} from 'react';

import sKey from "./helpers/sKey";
import SwipeableViews from 'react-swipeable-views';
import FramedHTML from './FramedHTML';
import * as SUtils from './helpers/SUtils'

export default class DesktopPreviewSwiper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 0,
            html: []
        };
    }

    componentDidMount(){
        if(this.props.articles.length > 2)
            this.loadFirstTwoArticles();
    }

    loadFirstTwoArticles = () => {
        this.appendArticle(0, () => this.appendArticle(1))
    };

    appendArticle = (index, callback = () => {}) => {
        let _this = this;
        if(this.props.articles[index])
            this.loadArticle(index)
                .then(res => res.json())
                .then(function(data){
                    if(data.result === SUtils.OK_RESULT){
                        let html = _this.state.html;
                        html.push(data.data);
                        _this.setState({ html }, callback());
                    }
                });
    };

    lazyAppendArticle = index => {
        if(index >= this.state.html.length - 1)
            this.appendArticle(index + 1);
    };

    loadArticle = index => {
        const article_id = this.props.articles[index]['id'];
        return this.fetchArticle(article_id);
    };

    fetchArticle = id => fetch(`/content/get_article_desktop_html/${id}/`,{credentials: 'include'});

    swiped = index => this.lazyAppendArticle(index);

    render() {
        return (
            <div style={{height: '100%', width: '100%'}}>
                <style dangerouslySetInnerHTML={{__html: `.hello .react-swipeable-view-container{height: 100%}`}} />
                <SwipeableViews className={'hello'} slideStyle={{height: '100%', overflow: 'hidden'}} style={{height: '100%'}} onChangeIndex={this.swiped} enableMouseEvents index={0}>
                    {this.state.html.map(html => <FramedHTML key={sKey('ds')} html={html}/>)}
                </SwipeableViews>
            </div>
        )
    }
}