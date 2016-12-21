import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import TextField from 'material-ui/TextField';
import Box from 'react-layout-components';


class ReqFac extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    rows : [] //push json {'a','b',...}
  }

  _onFileInputChange(e, index){
    e.stopPropagation();

  }

  render(){
    let rows = [];
    console.log(this.state.rows.length);
    if(this.state.rows.length == 0){
      rows.push(
        <TableRow key={0}>
          <TableRowColumn>-</TableRowColumn>
          <TableRowColumn>-</TableRowColumn>
          <TableRowColumn>-</TableRowColumn>
          <TableRowColumn>-</TableRowColumn>
        </TableRow>
      );
    }else{
      for (var i = 0; i < this.state.rows.length; i++ ){
        let a = this.state.rows[i][0];
        let b = this.state.rows[i][1];
        let c = this.state.rows[i][2];
        let d = this.state.rows[i][3];
        rows.push(
          <TableRow key={i}>
            <TableRowColumn>{a}</TableRowColumn>
            <TableRowColumn>{b}</TableRowColumn>
            <TableRowColumn>{c}</TableRowColumn>
            <TableRowColumn>{d}</TableRowColumn>
          </TableRow>
        );
      }
    }
    return(
      <div>
        <div style={{width:'100%', marginTop:'30px'}}>
          <Box flow alignItems='flex-end' justifyContent='flex-end' style={{marginRight:'20px'}}>
              <RaisedButton icon={<Attach/>} label="Allega nuovo documento" primary={true} labelStyle={{color:'#FFFFFF'}}/>
          </Box>
        </div>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>ID Documento</TableHeaderColumn>
              <TableHeaderColumn>Tipo</TableHeaderColumn>
              <TableHeaderColumn>N°Pratica</TableHeaderColumn>
              <TableHeaderColumn>Allegati</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} selectable={false}>
            {rows}
          </TableBody>
        </Table>
      </div>
    );
  }

}

const styles = {
  notLoaded : {
    backgroundColor:'#FFA726',
    padding:'8px',
    color:'white',
    fontWeight:'bold'
  },
  loaded : {
    backgroundColor:'#2E7D32',
    padding:'8px',
    color:'white',
    fontWeight:'bold'
  },
  inputFile : {
    cursor: 'pointer',
    position: 'absolute',
    top: 5,
    bottom: 0,
    right: 0,
    left: 20,
    zIndex:3,
    width: '100%',
    opacity: 0,
  },
  raisedButton : {
    backgroundColor : '#FFFFFF'
  }
}
export default ReqFac;
