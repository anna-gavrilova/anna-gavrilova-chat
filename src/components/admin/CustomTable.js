import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import ConvService from '../../services/conv.service'


const _=require('underscore')
function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {


  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1].id - b[1].id;
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

// const rows = [
//   { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
//   { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
//   { id: 'message', numeric: false, disablePadding: false, label: 'Message' },
//   { id: 'sender', numeric: false, disablePadding: false, label: 'Sender' },
//   { id: 'time', numeric: false, disablePadding: false, label: 'Timestamp' }
// ];

function makeRows(keys){
    var a=keys.map(key=>{
        return {id:key,numeric:false,disablePadding:false,label:key.toUpperCase()} })
        a.unshift({id:"id",numeric:false,disablePadding:true,label:"ID"} )
        return a
}

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };


  render() {

    const { order, orderBy, numSelected, rowCount,rows } = this.props;

    return (
      <TableHead>
        <TableRow>

          {rows.map(
            row => (
                
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Nutrition
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});



class EnhancedTable extends React.Component {

 constructor(props){
        super(props);


}
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    page: 0,
    rowsPerPage: 5,
    data:[]
  };

  

  componentWillMount(){

  }

  componentDidMount(){
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };





  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  renderRow=(name,n,isSelected)=>{

    switch(name){
        case "log": return(
            <TableRow
            hover 
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={-1}
            key={n.id}
            selected={isSelected}
          >
           <TableCell component="th" scope="row" padding="none">
              {n.id}
            </TableCell>
          <TableCell align="right">{n.time}</TableCell>
          
            <TableCell align="right">{n.type}</TableCell>
            <TableCell align="right">{n.message}</TableCell>
            <TableCell align="right">{n.sender}</TableCell>
           
            
            
          </TableRow>
        )
        case "history": return(
            <TableRow
            hover 
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={-1}
            key={n.id}
            selected={isSelected}
          >
            <TableCell component="th" scope="row" padding="none">
              {n._id}
            </TableCell>
          <TableCell align="right">{n.text}</TableCell>
          <TableCell align="right">{n.sender}</TableCell>
          <TableCell align="right">{n.time}</TableCell>
          
            
            
            
            
          </TableRow>
        )
        case "roomresult": return(
            <TableRow
            hover 
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={-1}
            key={n.id}
            selected={isSelected}
          >
            <TableCell component="th" scope="row" padding="none">
              {n.id}
            </TableCell>
          <TableCell align="right">{n.name}</TableCell>
          <TableCell align="right">{n.lastMessage}</TableCell>
          <TableCell align="right">{n['Date of Creation']}</TableCell>
          <TableCell align="right">{n['Participants']}</TableCell>
          
            
            
            
            
          </TableRow>
        )
    }

  }

  render() {
    const { classes } = this.props;
    const {order, orderBy, selected, rowsPerPage, page } = this.state;
    console.log(this.props.data)
    const data = this.props.data?this.props.data.data:[{}]
    //console.log(data)
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              rows = {makeRows(_.without(Object.keys(data[0]),"__v","_id","id"))}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                      this.renderRow(this.props.name,n,isSelected)

                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);