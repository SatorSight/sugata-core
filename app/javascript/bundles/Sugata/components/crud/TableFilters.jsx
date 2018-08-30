import * as React from 'react';
import { Component } from 'react';
import TextField from 'material-ui/TextField';
import ApplyIcon from 'material-ui-icons/Check';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import * as SUtils from '../helpers/SUtils';

import AppBar from 'material-ui/AppBar';

const classes = {
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginLeft: '10px'
    },
    button: {
        width: '80px'
    },
    filter: {
        width: '200px'
    },
    formControl: {
        minWidth: 120,
    },
};

export default class TableFilters extends Component {
    constructor(props) {
        super(props);

        const filters = props.columns.map(col => {
            return {
                id: col.id,
                display_value: '',
                value: col.type === 'datetime' ? (new SUtils.DateRange()) : '',
                type: col.type === 'datetime' ? 'date' : 'string'
            }
        });

        this.state = {
            columns: props.columns,
            fields: props.fields,
            filters: filters
        };
    }

    colIsSelect = col => {
        const field = this.getFieldByCol(col);
        return field.type === 'select';
    };

    getFieldByCol = col => {
        let field = null;
        this.props.fields.map(f => {
            if(f.name === col.id)
                field = f;
        });
        return field;
    };

    apply = () => {
        this.props.apply(this.state.filters);
    };

    getSelectDataForCol = col => {
        const field = this.getFieldByCol(col);
        return field.values;
    };

    handleChange = event => {
        const changer = el => {
            if(el.type === 'date'){
                if(event.target.id === 'date_from'){
                    el.value.from = event.target.value;
                    el.display_value = event.target.value;
                }
                if(event.target.id === 'date_to'){
                    el.value.to = event.target.value;
                    el.display_value = event.target.value;
                }
            }else{
                el.value = event.target.value;
                el.display_value = event.target.value;
            }
        };

        const filters = SUtils.change_array_element(
            this.state.filters,
            el => el.id === event.target.name,
            changer);
        this.setState({ filters });
    };

    getFilterColumn = filter => {
        let column = null;
        this.state.columns.map(c => {
            if(filter.id === c.id)
                column = c
        });
        return column;
    };

    getFilters = () => {
        let output_filters = [];

        this.state.filters.map(f => {
            const col = this.getFilterColumn(f);

            if(col.hidden)
                return false;

            if(col.type === 'integer')
                output_filters.push(
                    <TextField
                        type={'number'}
                        name={col.id}
                        id={col.name}
                        label={col.label}
                        value={f.display_value || ''}
                        onChange={this.handleChange}
                        margin="normal"
                    />);
            if(col.type === 'string')
                output_filters.push(
                    <TextField
                        name={col.id}
                        id={col.name}
                        label={col.label}
                        value={f.display_value || ''}
                        onChange={this.handleChange}
                        margin="normal"
                    />);
            if(col.type === 'datetime')
                output_filters.push(
                    <div>
                        <TextField
                            onChange={this.handleChange}
                            name={col.id}
                            id="date_from"
                            type="date"
                            value={f.value.from || ''}
                        />
                        <TextField
                            onChange={this.handleChange}
                            name={col.id}
                            id="date_to"
                            type="date"
                            value={f.value.to || ''}
                        />
                    </div>);
            if(!col.type) {
                if(this.colIsSelect(col)) {
                    const select_data = this.getSelectDataForCol(col);
                    output_filters.push(
                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel style={{top: '15px'}} htmlFor={`select-${col.id}`}>{col.label}</InputLabel>
                                <Select
                                    autoWidth
                                    style={{marginTop: '30px', minWidth: '150px'}}
                                    inputProps={{
                                        name: col.id,
                                        id: `select-${col.id}`,
                                    }}
                                    name={col.id}
                                    value={f.display_value || ''}
                                    onChange={this.handleChange}
                                >
                                    {select_data.map(col_select =>
                                        <MenuItem key={`table.filters.select.${col_select.id}.${col_select.name}`} value={col_select.id}>
                                            {col_select.name}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>);
                }
            }
        });

        return output_filters;
    };

    render() {
        return (
            <AppBar position="static" color="default">
                <div style={classes.wrapper}>
                    {this.getFilters().map((filter, i) =>
                        <div style={classes.filter} key={`table.filters.${i}`}>
                            {filter}
                        </div>)}
                    <div style={classes.button}>
                        <Button raised color="primary" style={{marginTop: '30px'}} onClick={this.apply}>
                            <ApplyIcon/>
                        </Button>
                    </div>
                </div>
            </AppBar>
        )

    }
}