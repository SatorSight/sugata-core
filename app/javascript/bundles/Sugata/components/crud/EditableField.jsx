import * as React from 'react';
import {Component} from 'react';

import {withStyles} from 'material-ui/styles';

import TextField from 'material-ui/TextField';

import Select from 'material-ui/Select';
import Checkbox from 'material-ui/Checkbox';
import { MenuItem } from 'material-ui/Menu';

import PropTypes from 'prop-types';

import Dropzone from 'react-dropzone'
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import { ListItemText } from 'material-ui/List';
import Chip from 'material-ui/Chip';

// import InfiniteCalendar from 'react-infinite-calendar';
// import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet

import * as SUtils from '../helpers/SUtils';

const request = require('superagent');

const styles = theme => ({
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
        // maxWidth: '500px',
        // maxWeight: '500px',
        maxWidth: '100%',
        maxWeight: '100%',
    },
    field: {
        marginBottom: '20px'
    },
    drop_upper_label: {
        height: '25px',
        // margin: '28px 0 0px 0',
        fontSize: '1rem',
        textAlign: 'left',
        color: 'rgba(0, 0, 0, 0.54)'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    dropzone: {
        width: '400px',
        height: '400px',
        borderWidth: '2px',
        borderColor: 'rgb(102, 102, 102)',
        borderStyle: 'dashed',
        borderRadius: '5px'
    }
});

class EditableField extends Component {
    constructor(props) {
        super(props);

        this.state  = {
            field: this.props.field,
            accepted: [],
            rejected: []
        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getFieldFromChild = () => {
        return this.state.field;
    };

    changeValue = event => {
        let field = this.state.field;
        field.value = event.target.value;

        this.setState({ field });
    };

    changeValueSelect = event => {
        let value = null;
        this.state.field.values.map(val => {
            if(val.id === event.target.value)
                value = val;
        });

        let field = this.state.field;
        field.value = value;

        this.setState({ field });
    };

    getValueByID = id => {
        return this.state.field.values.find(el => el.id === id);
    };

    changeValueMultiSelect = event => {
        const value = this.getValuesByIdArray(event.target.value);
        const field = this.state.field;
        field.value = value;
        this.setState({ field });
    };

    getValuesByIdArray = array => {
        let values = [];
        this.state.field.values.map(el => {
            if(SUtils.in_array(el.id, array))
                values.push(el);
        });
        return values;
    };

    changeDateValue = date => {
        //todo rewrite without mutations

        let field = this.state.field;
        field.value = date.target.value;

        // if(!SUtils.empty(date.target.value)) {
        //     field = Object.assign({}, this.state.field, {value: date.target.value});
        //
        //     console.log('field');
        //     console.log(field);
        //
        //
        // }else{
        //     console.log('nothin changed?');
        // }

        this.setState({field});
    };

    changeCheckbox = (event, checked) => {
        let field = this.state.field;
        field.value = checked;

        this.setState({ field });
    };

    onDrop = name => (accepted, rejected) => {
        this.setState({ accepted, rejected });

        if(SUtils.single(accepted)){
            const req = request.post(`/${name}/new`);
            accepted.forEach(file => {
                req.attach('image', file);
            });
            req.end((err, res) => {
                let result = JSON.parse(res.text);
                if(result.result === SUtils.OK_RESULT){
                    const value  = result.id;
                    let field = this.state.field;
                    field.value = value;
                    console.log('value set: '+value);
                    this.setState({ field });
                }
            });
        }
    };

    getExistingImage = classes => {
        if(this.props.empty)
            return null;
        let src = null;
        if(!SUtils.empty(this.props.field.value))
            src = this.props.field.value.path;
        return src ? <img className={classes.drop_image} src={src}/> : null;
    };

    firstSelectValue = (field) => {
        if(SUtils.empty(field.values))
            return '';
        return SUtils.first(field.values);
    };

    multiselectValueChecked = val => SUtils.in_array(val.id, this.state.field.value.map(v => v.id));

    renderType = (type, classes, name) => {
        if(type === 'text' || type === 'password' || type === 'integer'){
            return <TextField
                    className={classes.field}
                    margin="dense"
                    id={this.props.field.field_id}
                    label={this.props.field.label}
                    name={this.props.field.name}
                    type={type === 'integer' ? 'number' : type}
                    fullWidth
                    required={this.props.required}
                    value={this.state.field.value}
                    onChange={this.changeValue}
                />
        }else if(type === 'boolean') {
            return <div>
                <InputLabel style={{position: 'relative'}}>
                    {this.props.field.label}
                    <Checkbox
                        value={this.state.field.value}
                        onChange={this.changeCheckbox}
                        name={this.props.field.name}
                        checked={!!this.state.field.value}
                        //wtf that's not working
                        label={this.props.field.label}
                        style={{position: 'relative', top: '6px'}}
                    />
                </InputLabel>
            </div>
        }else if(type === 'image'){
            const existingImage = this.getExistingImage(classes);
            return <div>
                <div className={classes.drop_upper_label}>{this.props.field.label}</div>
                <Dropzone
                    onDrop={this.onDrop(name)}
                    accept="image/jpeg, image/png"
                    multiple={false}
                    className={classes.dropzone}
                >
                    <div className={classes.drop_wrapper}>
                        {SUtils.empty(this.state.accepted)
                            ? (existingImage
                                ? existingImage
                                : <Typography className={classes.drop_label} type="headline" component="h5">Drop file to upload.</Typography>)
                            : <img className={classes.drop_image} src={SUtils.first(this.state.accepted).preview} alt=""/>
                        }
                    </div>

                </Dropzone>
            </div>
        }else if(type === 'datetime'){
            const field_value = this.state.field.value;
            const current_value = field_value ? new Date(field_value) : new Date();
            const formatted_value = SUtils.dateToFormattedInputString(current_value);

            return <div>
                <div className={classes.drop_upper_label}>{this.props.field.label}</div>
                <TextField
                    onChange={this.changeDateValue}
                    name={this.props.field.name}
                    id={this.props.field.name}
                    type="date"
                    value={formatted_value || ''}
                />
            </div>
        }else if(type === 'select') {
            return (<div><div className={classes.drop_upper_label}>{this.props.field.label}</div><Select
                className={classes.field}
                value={SUtils.idOrNull(this.state.field.value) || this.firstSelectValue(this.state.field)}
                onChange={this.changeValueSelect}
                autoWidth
                name={this.props.field.name}
            >
                {this.props.field.values.map(val =>
                    <MenuItem key={`field.${name}.select.${val.id}`} value={val.id}>{val.name}</MenuItem>
                )}
            </Select></div>)
        }else if(type === 'multiselect'){
            return <div>
                <div className={classes.drop_upper_label}>{this.props.field.label}</div>
                <Select
                    multiple
                    value={this.state.field.value.map(v => v.id)}
                    onChange={this.changeValueMultiSelect}
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={selected => {
                        return (
                        <div className={classes.chips}>
                            {selected.map(value =>
                                <Chip
                                    key={`multiselect.chip.${value}`}
                                    label={this.getValueByID(value).name}
                                    className={classes.chip} />)}
                        </div>)}}
                >
                    {this.state.field.values.map(val => (
                        <MenuItem
                            key={`field.${this.state.field.name}.multiselect.${val.id}`}
                            value={val.id}
                        >
                            <Checkbox checked={this.multiselectValueChecked(val)} />
                            <ListItemText primary={val.name} />
                        </MenuItem>
                    ))}
                </Select>
            </div>
        }
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                {this.renderType(this.props.field.type, classes, this.props.field.name)}
                <br/>
            </div>
        )
    }
}

EditableField.propTypes = {
    // field_id: PropTypes.object.isRequired,
    // label: PropTypes.string.isRequired,
    // value: PropTypes.object.isRequired,
    // changer: PropTypes.object.isRequired,
    // name: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(EditableField)