import React from 'react';
import CKEditor from "react-ckeditor-component";

export default class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            html: this.props.html
        };
    }

    onChange = evt => {
        this.setState({ html: evt.editor.getData() });
        console.log(this.state.html);
    };

    render() {
        return (
            <CKEditor
                activeClass="p10"
                config={{
                    height: 500
                }}
                content={this.state.html}
                events={{
                    "change": this.onChange
                }}
            />
        )
    }
}