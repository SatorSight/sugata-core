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

import sKey from './helpers/sKey';

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
});

class DataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order: 'desc',
            orderBy: 'id',
            data: props.data,
            page: 0,
            rowsPerPage: 25,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.data !== this.props.data || this.state !== nextState;
    }

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

        this.setState({ data, order, orderBy });
    };

    createSortHandler = property => event => {
        this.handleRequestSort(event, property);
    };

    handleChangePage = (event, page) => this.setState({ page });
    handleChangeRowsPerPage = event => this.setState({ rowsPerPage: event.target.value });

    tableColumns = data => {
        const row = data.rows.find(() => true);
        return Object.keys(row);
    };

    render() {
        const {classes} = this.props;
        const { data, order, orderBy, rowsPerPage, page } = this.state;

        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        {data.columns.map(column => {
                            return (
                                <TableCell
                                    key={column.id}
                                    numeric={column.numeric}
                                    padding={column.disablePadding ? 'none' : 'default'}
                                >
                                    <Tooltip
                                        title="Sort"
                                        placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                        return (
                            <TableRow key={sKey('dt')} hover tabIndex={-1}>
                                {this.tableColumns(data).map(col =>
                                    <TableCell key={sKey('dt')}>{n[col]}</TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            count={data.rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        )
    }
}

export default withStyles(styles, {withTheme: true})(DataTable)