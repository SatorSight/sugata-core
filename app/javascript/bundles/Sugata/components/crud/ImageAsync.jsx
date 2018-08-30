import * as React from 'react';
import { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import Lightbox from 'react-image-lightbox';

export default class ImageAsync extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    open = () => this.setState({open: true});
    close = () => this.setState({open: false});

    render() {
        return (
            <div className={this.props.klass}>
                <LazyLoad height={300} offset={100} throttle once>



                    <img
                        onClick={this.open}
                        style={{maxWidth: '100%', maxHeight: '100%'}}
                        src={this.props.src}
                        alt={this.props.alt}
                    />

                    {this.state.open && (
                        <Lightbox
                            mainSrc={this.props.src}
                            onCloseRequest={this.close}
                        />
                    )}



                </LazyLoad>
            </div>
        )
    }
}