import React from 'react';
import ReactQuill, {Quill} from 'react-quill';

import {ImageDrop} from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/ImageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);


import 'react-quill/dist/quill.snow.css'; // ES6


export default class Editor2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            html: this.props.html,
        };
    }

    handleChange = html => {
        this.setState({ html });
    };

    setHtml = html => {
        this.setState({ html });
    };

    insertImage = src => {
        let e = this.reactQuillRef.editor;
        const html = `<img src="${src}"/>`;
        const cursorPosition = e.getSelection() ? e.getSelection().index : 0;
        e.clipboard.dangerouslyPasteHTML(cursorPosition, html);
    };

    render() {
        return (
            <div>
                <ReactQuill value={this.state.html}
                            ref={(el) => { this.reactQuillRef = el }}
                            onChange={this.handleChange}
                            modules={{
                                imageDrop: true,
                                ImageResize: {},
                                toolbar: [
                                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                                    ['blockquote'],
                                    ['link', 'image'],

                                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                                    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                                    [{ 'direction': 'rtl' }],                         // text direction

                                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                                    [{ 'font': [] }],
                                    [{ 'align': [] }],

                                    ['clean']                                         // remove formatting button

                                ]

                            }}
                />
            </div>
        )
    }
}