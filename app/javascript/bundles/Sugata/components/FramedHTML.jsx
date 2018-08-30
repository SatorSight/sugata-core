import * as React from 'react';
import {Component} from 'react';

export default class FramedHTML extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._updateIframe();
    }

    shouldComponentUpdate(){
        return false;
    }

    _updateIframe() {
        const iframe = this.refs.iframe;
        const document = iframe.contentDocument;
        const styles = '<style>html{zoom:0.7} #pf1{position:absolute}</style>';
        document.body.innerHTML = styles + this.props.html;
    }

    render() {
        return <iframe ref="iframe" style={{width: '100%', height: '100%', border: 'none', pointerEvents: 'none'}}/>
    }
}