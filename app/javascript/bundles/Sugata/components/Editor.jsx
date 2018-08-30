import React from 'react';
import CKEditor from "react-ckeditor-component";


export default class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            html: this.props.html,
            editor_exists: true
        };
    }

    setHtml = html => {


        this.ck_ref.content = html;
        this.setState({editor_exists: !this.state.editor_exists});
        let _this = this;
        setTimeout(function(){
            _this.setState({editor_exists: !_this.state.editor_exists});
        },500);
        return false;
        //
        // console.log('in setHTML');
        // console.log(html);

        // this.setState({ html }, console.log(this.state.html));

        // let _this = this;
        // setTimeout(function(){
        //     console.log('this.state.html');
        //     console.log(_this.state.html);
        //     _this.ck_ref.forceUpdate(() => {console.log('ck reloaded');});
        //     _this.forceUpdate(() => {console.log(_this.state.html);});
        // }, 1000);



        //
        // this.setState({html: this.props.html},() => console.log('heeee' + this.props.html));
        //
        // // this.setState({editor_exists: false});
        //
        // setTimeout(function(){
        //     _this.setState({editor_exists: false}, console.log('set'));
        //     _this.forceUpdate();
        //     _this.ck_ref.forceUpdate();
        // },100);
        //
        //
        // setTimeout(function(){
        //     _this.setState({editor_exists: true}, console.log('set'));
        //     _this.forceUpdate();
        //     _this.ck_ref.forceUpdate();
        //
        // },2000);
        //


    };

    reload = () => {
        // console.log(this.props.html);
        // this.setState({html: this.props.html}, console.log(this.props.html));
        //
        // this.setState({editor_exists: false}, setTimeout(function () {
        //     this.setState({editor_exists: true});
        // }, 1000));


    };

    onChange = evt => {
        this.setState({ html: evt.editor.getData() });
        console.log(this.state.html);
    };

    render() {
        console.log('editor renderer');
        return this.state.editor_exists ? <CKEditor
                ref={editor => {this.ck_ref = editor}}
                activeClass="p10"
                config={{
                    allowedContent: true,
                    height: 500,
                    extraPlugins: 'colorbutton'
                }}
                // isScriptLoaded={true}
                content={this.props.html}
                events={{
                    "change": this.onChange
                }}
            /> : null

    }
}