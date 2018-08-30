import * as React from 'react';
import {PureComponent} from 'react';
import IssuesBoard from '../IssuesBoard';

export default class Home extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <IssuesBoard {...this.props}/>
            </div>
        )
    }
}