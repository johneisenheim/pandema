import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Box, Center} from 'react-layout-components';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import update from 'react-addons-update';
import TextField from 'material-ui/TextField';

import Compile from 'material-ui/svg-icons/action/assignment';
import Attach from 'material-ui/svg-icons/editor/attach-file';
import NextIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import PrevIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import Check from 'material-ui/svg-icons/action/check-circle';

//D4D4D4

class Step3 extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    a : 'Non caricato',
    b : 'Non caricato',
    c : 'Non caricato',
    d : 'Non caricato',
    e : 'Non caricato',
    f : 'Non caricato',
    g : 'Non caricato',
    h : 'Non caricato',
    i : 'Non caricato',
    l : 'Non caricato',
    currentTitle : '',
    currentLetter : '',
    checkColor : '#D6D6D6',
    open : false
  }

  _onFileInputChange(index, who, letter){
    this.state.open = true;
    this.state.currentTitle = who;
    this.state.currentLetter = letter;
    this.setState(this.state);
  }

  _onFileSelection(){
    //this.state[this.state.currentLetter] = 'Caricato';
    this.state.checkColor = 'green';
    this.setState(this.state);
  }

  handleClose(){
    this.state[this.state.currentLetter] = 'Caricato';
    this.state.checkColor = '#D6D6D6';
    this.state.open = false;
    this.setState(this.state);
  }

  _handleClose(){
    this.state.checkColor = '#D6D6D6';
    this.state.open = false;
    this.setState(this.state);
  }


  render (){
    const actions = [
      <FlatButton
        label="Annulla"
        primary={false}
        onTouchTap={this._handleClose.bind(this)}
      />,
      <FlatButton
        label="Invia"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
    ];
      return (
        <div style={{marginBottom:'60px'}}>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Documento</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Azioni</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} selectable={false}>
              <TableRow>
                <TableRowColumn>Agenzia della dogana</TableRowColumn>
                <TableRowColumn><span style={this.state.a == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.a}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this, 0,'Agenzia della dogana', 'a')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Agenzia del demanio</TableRowColumn>
                <TableRowColumn><span style={this.state.b == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.b}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this,1,'Agenzia del demanio', 'b')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere tecnico</TableRowColumn>
                <TableRowColumn><span style={this.state.c == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.c}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this,2,'Parere tecnico','c')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere urbanistico</TableRowColumn>
                <TableRowColumn><span style={this.state.d == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.d}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this,3,'Parere urbanistico','d')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere sopraintendenza beni paesaggistici</TableRowColumn>
                <TableRowColumn><span style={this.state.e == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.e}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this,4,'Parere sopraintendenza dei beni paesaggistici','e')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere in aree SIC</TableRowColumn>
                <TableRowColumn><span style={this.state.f == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.f}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this,5,'Parere in aree SIC','f')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere autorità marittima</TableRowColumn>
                <TableRowColumn><span style={this.state.g == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.g}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this,6,'Parere autorità marittime','g')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere sopraintendenza archeologica</TableRowColumn>
                <TableRowColumn><span style={this.state.h == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.h}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this,7,'Parere sopraintendenza archeologica','h')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere autorità bacino</TableRowColumn>
                <TableRowColumn><span style={this.state.i == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.i}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF' onClick={this._onFileInputChange.bind(this,8,'Parere autorità bacino','i')}>
                  </FlatButton>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          <Dialog
            title={this.state.currentTitle}
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose.bind(this, 1)}
            titleStyle={{color:'#59C2E6'}}
            contentStyle = {{color:'#666666'}}
          >
          <p>Completa le azioni per ultimare il caricamento del documento:</p>
          <div>
              <TextField hintText="Numero di pratica" />
              <FlatButton icon={<Attach/>} label="Allega il file di riferimento" backgroundColor='#FFFFFF'>
                <input type="file" style={styles.inputFile} onChange={this._onFileSelection.bind(this)}/>
              </FlatButton>
              <Check style={{position:'relative',top:'6px', marginLeft:'7px'}} color={this.state.checkColor}/>
          </div>
          </Dialog>
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

export default Step3;
