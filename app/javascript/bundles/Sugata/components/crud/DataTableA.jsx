import * as React from 'react';
import {Component} from 'react';

import {withStyles} from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import List, { ListItem, ListItemText } from 'material-ui/List';

import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Checkbox from 'material-ui/Checkbox';
import { FormControl } from 'material-ui/Form';

import EditableField from './EditableField'
import FormAlerts from './FormAlerts'
import * as SUtils from '../helpers/SUtils';
import ImageAsync from './ImageAsync'
import Waiter from '../Waiter'
import TableFilters from './TableFilters'
import 'react-image-lightbox/style.css';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 800,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    button: {
        marginLeft: '10px'
    },
    dialog: {
        minWidth: '600px',
        minHeight: '600px'
    },
    image: {
        width: '200px',
        height: '200px',
        cursor: 'pointer'
    },
    controlButtonsContainer: {
        position: 'fixed',
        bottom: '25px'
    },
    formControl: {
        width: '100%',
        minWidth: 240,
    },
    alerts: {
        color: 'red',
    },
});

class DataTableA extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        let fields = {};
        props.pack.data.fields.map(field => fields[field.name] = null);

        const data = this.getFilteredData(props.pack.data, props);

        this.state = {
            data: data,

            order: 'desc',
            orderBy: 'id',

            page: 0,
            rowsPerPage: 50,

            filters: {},

            add_dialog_open: false,
            edit_dialog_open: false,
            alerts: null,
            fields: fields,
            edit_fields: [],
            selected_rows: [],
            waiter_enabled: false
        };
    }

    //not working yet probably due to mutations
    shouldComponentUpdate(nextProps){
        return this.props.pack.data !== nextProps;
    }

    getFilteredData = (data, props) => {
        const columns = data.columns.map(col => {
            col.hidden = false;
            if(props.additional && props.additional.hide_columns)
                col.hidden = SUtils.in_array(col.id, props.additional.hide_columns);
            return col;
        });

        return {
            ...data,
            columns: columns,
        }
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc')
            order = 'asc';

        const rows =
            order === 'desc'
                ? this.state.data.rows.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
                : this.state.data.rows.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

        let data = this.state.data;

        data.rows = rows;
        data = this.getFilteredData(data, this.props);

        this.setState({data, order, orderBy}, this.reloadData(this.getNavObject(null, null, order, orderBy)));
    };

    reloadData = nav_object => {
        this.enableWaiter();
        const init = {credentials: 'include'};
        const query = this.getReloadQuery(nav_object);
        fetch(query, init)
            .then(res => res.json())
            .then(data => {
                data = this.getFilteredData(data, this.props);
                this.setState({ data }, this.disableWaiter)
            })
    };

    enableWaiter = () => this.setState({waiter_enabled: true});
    disableWaiter = () => this.setState({waiter_enabled: false});

    getReloadQuery = nav_object => {
        const page = nav_object.page;
        const page_size = nav_object.page_size;
        const order = nav_object.order;
        const order_by = nav_object.order_by;
        const filters = JSON.stringify(nav_object.filters);
        const resource = this.props.pack.action;

        return `/reload_crud_data/${resource}/${page}/${page_size}/${order}/${order_by}/${filters}/`;
    };

    getNavObject = (page = null, page_size = null, order = null, order_by = null, filters = null) => {
        return {
            page: page || this.state.page,
            page_size: page_size || this.state.rowsPerPage,
            order: order || this.state.order,
            order_by: order_by || this.state.orderBy,
            filters: filters || this.state.filters
        };
    };

    updateFilters = filters => {
        const filters_hash = filters.reduce((accumulator, cur) => {
            if(!SUtils.empty(cur.value)){
                accumulator[cur.id] = cur.value;
            }
            return accumulator;
        }, {});

        this.setState({filters: filters_hash});

        // const filter_string = JSON.stringify(filters_hash);
        const nav_object = this.getNavObject(null, null, null, null, filters_hash);
        this.reloadData(nav_object);
    };

    createSortHandler = property => event => this.handleRequestSort(event, property);
    handleChangePage = (event, page) => {
        const nav_object = this.getNavObject(page);
        this.setState({page}, this.reloadData(nav_object))
    };
    handleChangeRowsPerPage = event => this.setState({rowsPerPage: event.target.value},
                                       this.reloadData(this.getNavObject(null, event.target.value)));

    tableColumns = data => {
        const row = data.rows.find(() => true);
        return Object.keys(row);
    };

    openEditDialog = () => this.setState({ edit_dialog_open: true });
    openAddDialog = () => this.setState({ add_dialog_open: true });
    closeEditDialog = () => this.setState({ edit_dialog_open: false, alerts: null });
    closeAddDialog = () => this.setState({ add_dialog_open: false, alerts: null });

    checkboxHandler = (event, checked) => {
        let selected_rows = this.state.selected_rows;
        if(checked)
            selected_rows = SUtils.push_if_not_there(event.target.name, selected_rows);
        else
            selected_rows = SUtils.remove_array_element(event.target.name, selected_rows);

        this.setState({ selected_rows }, () => {
            if(SUtils.single(selected_rows)) {
                const row = this.getRowById(SUtils.first(selected_rows));
                const edit_fields = row.fields;
                this.setState({ edit_fields });
            }
        });
    };

    addAlert = alerts => this.setState({ alerts });

    getCallback = action => {
        if(this.props.additional){
            if(this.props.additional.callbacks){
                if(this.props.additional.callbacks[action]){
                    return this.props.additional.callbacks[action];
                }
            }
        }
        return () => location.reload();
    };

    constructPayloadWithFields = fields => {
        let payload = {id: SUtils.first(fields).id};
        fields.forEach(f => {
            if(f.type === 'select')
                payload[f.name] = f.value.id;
            else if(f.type === 'multiselect') {
                payload[f.name] = f.value.map(v => v.id);
            }else
                payload[f.name] = f.value;
        });
        return payload;
    };

    addHandler = () => {
        let payload = {};
        Object.keys(this.state.fields).map(key => {
            const f = this.state.fields[key].getFieldFromChild();

            if(f.type === 'select')
                payload[f.name] = f.value.id;
            else if(f.type === 'multiselect') {
                payload[f.name] = f.value.map(v => v.id);
            }else
                payload[f.name] = f.value;
        });

        this.makeQuery(payload, 'POST', 'add', {}, this.getCallback('add'));
    };

    editHandler = () => {
        const fields = SUtils.clone_array(this.state.edit_fields);
        const payload = this.constructPayloadWithFields(fields);

        // return false;


        // let payload = {id: SUtils.first(fields).id};
        // fields.map(field => payload[field.name] = (field.type === 'select' ? field.value.id : field.value));

        this.makeQuery(payload, 'PATCH', 'edit', {}, this.getCallback('edit'));
    };

    deleteSelected = () => confirm('Sure?') ? this._deleteSelected() : false;
    _deleteSelected = () => {
        const selected_ids = JSON.stringify(this.state.selected_rows);
        this.makeQuery(null, 'DELETE', 'delete', {ids: selected_ids}, this.getCallback('delete'));
    };

    makeQuery = (payload, method, action, params = {}, callback = null) => {
        let params_string = '';
        let init = {
            method: method,
            credentials: 'include'
        };

        if(payload) {
            let data = new FormData();
            data.append("json", JSON.stringify(payload));
            init.body = data;
        }

        if(!SUtils.empty(params))
            params_string = SUtils.build_query(params);

        let _this = this;
        fetch(`/${this.props.pack.resource}/${action}/${params_string}`, init)
            .then(res => res.json())
            .then(function(data){
                if(data['result'] === SUtils.OK_RESULT){
                    if(callback)
                        callback(data);
                }else
                    _this.addAlert(data.messages);
            })
    };

    getRowById = id => {
        let row = null;
        this.state.data.rows.map(r => {
            if(r.id.toString() === id.toString())
                row = r;
        });
        return row;
    };

    onSelectAllClick = (event, checked) => {
        if(!checked)
            this.setState({selected_rows: []});
        else{
            let selected_rows = [];
            const {data} = this.state;
            data.rows.map(n => selected_rows.push(n.id.toString()));
            this.setState({selected_rows});
        }
    };

    getRowColType = col => {
        let type = null;
        this.state.data.columns.map(c => {
            if(c.id === col && c.type){
                type = c.type
            }
        });

        if(type === null) {
            this.state.data.fields.map(f => {
                if (f.name === col)
                    type = f.type
            });
        }
        return type;
    };

    modifyMaterial = id => {
        if(this.props.additional.button.to)
            window.open(this.props.additional.button.to + '?id=' + id, '_blank');
    };

    getColumnById = id => this.state.data.columns.find(col => col.id === id);

    getTableCell = (col, row, classes) => {
        if(col === 'fields')
            return null;
        const col_type = this.getRowColType(col);
        const column = this.getColumnById(col);
        if(!column)
            return null;
        if(column.hidden)
            return null;

        let cell_content = null;

        if(col_type === 'boolean')
            cell_content = row[col] ? 'Yes' : 'No';
        if(col_type === 'image')
            cell_content = row[col] ? <ImageAsync klass={classes.image} src={row[col]}/> : '';
        if(col_type === 'multiselect') {
            cell_content =
                <List component="nav">
                    {row[col].map(val =>
                        <ListItem key={`table.field.${row.id}.multiselect.${val.id}`}>
                            {val.name}
                        </ListItem>
                    )}
                </List>
        }
        if(col_type === 'datetime'){
            if(!row[col])
                cell_content = '';
            else {
                const date = new Date(row[col]);
                cell_content = date.toDateString();
            }
        }

        if(cell_content === null)
            cell_content = row[col];

        return <TableCell
            style={this.getDisplayColumnStyle(col)}
            padding={'none'}
            key={`table.cell.${col}.${row.id}`}
        >
            {cell_content}
        </TableCell>
    };

    getDisplayColumnStyle = col => col.hidden ? {display: 'none'} : {};

    render() {
        const {classes} = this.props;
        const {data, order, orderBy, rowsPerPage, page} = this.state;

        return (
            <div>
                <Waiter enabled={this.state.waiter_enabled}/>
                <TableFilters
                    apply={this.updateFilters}
                    fields={data.fields}
                    columns={data.columns}/>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    //todo rewrite, probably fails for multiple pages
                                    checked={this.state.selected_rows.length === this.state.data.rows.length}
                                    onChange={this.onSelectAllClick}
                                />
                            </TableCell>
                            {data.columns.map(column => {
                                return (
                                    <TableCell
                                        style={this.getDisplayColumnStyle(column)}
                                        key={`table.cols.${column.id}`}
                                        // numeric={column.numeric}
                                        // padding={column.disablePadding ? 'none' : 'dense'}
                                        // padding={'dense'}
                                        padding={'none'}
                                    >
                                        <Tooltip
                                            style={this.getDisplayColumnStyle(column)}
                                            title="Sort"
                                            placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                            enterDelay={300}
                                        >
                                            <TableSortLabel
                                                style={this.getDisplayColumnStyle(column)}
                                                active={orderBy === column.id}
                                                direction={order}
                                                onClick={this.createSortHandler(column.id)}
                                            >
                                                {column.label}
                                            </TableSortLabel>
                                        </Tooltip>
                                    </TableCell>
                                );
                            }, this)}
                            {this.props.additional
                                ? this.props.additional.button
                                    ? <TableCell key={`table.cell.actions`}>
                                        Actions
                                      </TableCell>
                                    : null
                                : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rows.map(n => {
                            return (
                                <TableRow key={`table.row.${n.id}`} hover tabIndex={-1}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            onChange={this.checkboxHandler}
                                            name={n.id}
                                            checked={SUtils.in_array(n.id.toString(), this.state.selected_rows)} />
                                    </TableCell>
                                    {this.tableColumns(data).map(col =>
                                        this.getTableCell(col, n, classes)
                                    )}
                                    {this.props.additional ? this.props.additional.button ? <TableCell
                                        key={`table.row.additional`}
                                    >
                                        <Button onClick={() => this.modifyMaterial(n.id)} raised color="primary" className={classes.buttonUpload}>
                                            Modify
                                        </Button>
                                    </TableCell> : null : null}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={this.props.pack.total_rows_count}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className={classes.controlButtonsContainer}>
                    {!this.props.additional || !this.props.additional.remove_actions
                    || !SUtils.in_array('add', this.props.additional.remove_actions)
                        ? <Button onClick={this.openAddDialog} raised color="primary" className={classes.button}>Add</Button>
                        : null
                    }
                    {!this.props.additional || !this.props.additional.remove_actions
                    || !SUtils.in_array('delete', this.props.additional.remove_actions)
                        ? <Button onClick={this.deleteSelected} disabled={SUtils.empty(this.state.selected_rows)} raised color="primary" className={classes.button}>Delete selected</Button>
                        : null
                    }
                    {!this.props.additional || !this.props.additional.remove_actions
                    || !SUtils.in_array('edit', this.props.additional.remove_actions)
                        ? <Button onClick={this.openEditDialog} disabled={SUtils.not_single(this.state.selected_rows)} raised color="primary" className={classes.button}>Edit selected</Button>
                        : null
                    }

                </div>
                <Dialog maxWidth={'md'} fullWidth={true} className={classes.dialog} ignoreBackdropClick={true} open={this.state.add_dialog_open} onRequestClose={this.closeAddDialog}>
                    <DialogTitle>Adding {this.props.pack.resource}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please, fill all presented fields
                        </DialogContentText>
                        <div className={classes.alerts}>
                            <FormAlerts alerts={this.state.alerts}/>
                        </div>
                        <FormControl className={classes.formControl}>
                            {data.fields.map((field, i) =>
                                <EditableField
                                    key={`table.cell.${field.field_id}.${i}`}
                                    field={field}
                                    type={field.type}
                                    required={field.required}
                                    onRef={ref => (this.state.fields[field.name] = ref)}
                                    empty
                                />
                            )}
                            <br/>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeAddDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addHandler} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog maxWidth={'md'} fullWidth={true} className={classes.dialog} ignoreBackdropClick={true} open={this.state.edit_dialog_open} onRequestClose={this.closeEditDialog}>
                    <DialogTitle>Editing {this.props.pack.resource}</DialogTitle>
                    <DialogContent>
                        <FormAlerts alerts={this.state.alerts}/>
                        <FormControl className={classes.formControl}>
                            {this.state.edit_fields.map(field =>
                                <EditableField
                                    key={`table.field.${field.field_id}.${field.label}`}
                                    field={field}
                                    type={field.type}
                                    required={field.required}
                                    onRef={ref => (this.state.fields[field.name] = ref)}
                                />
                            )}
                            <br/>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeEditDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.editHandler} color="primary">
                            Edit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(DataTableA)