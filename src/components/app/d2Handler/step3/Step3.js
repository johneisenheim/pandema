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
import Delete from 'material-ui/svg-icons/action/delete';

//D4D4D4

class Step3 extends React.Component{

  constructor(props, context) {
    super(props, context);
  }

  state = {
    a : greatObject.d2.files !== undefined ? (greatObject.d2.files['agenziadogana'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    b : greatObject.d2.files !== undefined ? (greatObject.d2.files['agenziademanio'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    c : greatObject.d2.files !== undefined ? (greatObject.d2.files['pareretecnico'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    d : greatObject.d2.files !== undefined ? (greatObject.d2.files['parereurbanistico'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    e : greatObject.d2.files !== undefined ? (greatObject.d2.files['pareresopraintendenza'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    f : greatObject.d2.files !== undefined ? (greatObject.d2.files['pareresic'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    g : greatObject.d2.files !== undefined ? (greatObject.d2.files['parereautoritamarittima'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    h : greatObject.d2.files !== undefined ? (greatObject.d2.files['pareresopraintendenzaarcheologica'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    i : greatObject.d2.files !== undefined ? (greatObject.d2.files['parereautoritabacino'] !== undefined ? 'Caricato' : 'Non caricato') : 'Non caricato',
    l : 'Non caricato',
    currentTitle : '',
    currentLetter : '',
    checkColor : '#D6D6D6',
    open : false
  }

  _onFileInputChange(e){
    console.log(e);
    switch(e){
      case 'agenziadogana':
        greatObject.d2['files']['agenziadogana'] = this.refs.file1.files[0];
        this.setState({
          ...this.state,
          a : 'Caricato'
        });
      break;
      case 'agenziademanio':
        greatObject.d2['files']['agenziademanio'] = this.refs.file2.files[0];
        this.setState({
          ...this.state,
          b : 'Caricato'
        });
      break;
      case 'pareretecnico':
        greatObject.d2['files']['pareretecnico'] = this.refs.file3.files[0];
        this.setState({
          ...this.state,
          c : 'Caricato'
        });
      break;
      case 'parereurbanistico':
        greatObject.d2['files']['parereurbanistico'] = this.refs.file4.files[0];
        this.setState({
          ...this.state,
          d : 'Caricato'
        });
      break;
      case 'pareresopraintendenza':
        greatObject.d2['files']['pareresopraintendenza'] = this.refs.file5.files[0];
        this.setState({
          ...this.state,
          e : 'Caricato'
        });
      break;
      case 'pareresic':
        greatObject.d2['files']['pareresic'] = this.refs.file6.files[0];
        this.setState({
          ...this.state,
          f : 'Caricato'
        });
      break;
      case 'parereautoritamarittima':
        greatObject.d2['files']['parereautoritamarittima'] = this.refs.file7.files[0];
        this.setState({
          ...this.state,
          g : 'Caricato'
        });
      break;
      case 'pareresopraintendenzaarcheologica':
        greatObject.d2['files']['pareresopraintendenzaarcheologica'] = this.refs.file8.files[0];
        this.setState({
          ...this.state,
          h : 'Caricato'
        });
      break;
      case 'parereautoritabacino':
        greatObject.d2['files']['parereautoritabacino'] = this.refs.file9.files[0];
        this.setState({
          ...this.state,
          i : 'Caricato'
        });
      break;
    }
  }

  onDisallega(letter, who){
    switch(letter){
      case 'a':
        this.setState({
          a : 'Non caricato'
        });
        greatObject.d2['files']['agenziadogana'] = undefined;
      break;
      case 'b':
        this.setState({
          b : 'Non caricato'
        });
        greatObject.d2['files']['agenziademanio'] = undefined;
      break;
      case 'c':
        this.setState({
          c : 'Non caricato'
        });
        greatObject.d2['files']['pareretecnico'] = undefined;
      break;
      case 'd':
        this.setState({
          d : 'Non caricato'
        });
        greatObject.d2['files']['parereurbanistico'] = undefined;
      break;
      case 'e':
        this.setState({
          e : 'Non caricato'
        });
        greatObject.d2['files']['pareresopraintendenza'] = undefined;
      break;
      case 'f':
        this.setState({
          f : 'Non caricato'
        });
        greatObject.d2['files']['pareresic'] = undefined;
      break;
      case 'g':
        this.setState({
          g : 'Non caricato'
        });
        greatObject.d2['files']['parereautoritamarittima'] = undefined;
      break;
      case 'h':
        this.setState({
          h : 'Non caricato'
        });
        greatObject.d2['files']['pareresopraintendenzaarcheologica'] = undefined;
      break;
      case 'i':
        this.setState({
          i : 'Non caricato'
        });
        greatObject.d2['files']['parereautoritabacino'] = undefined;
      break;
    }
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
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file1" onChange={this._onFileInputChange.bind(this, 'agenziadogana')}/>
                  </FlatButton>
                  { this.state.a !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'a')} icon={<Delete/>}/>: null}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Agenzia del demanio</TableRowColumn>
                <TableRowColumn><span style={this.state.b == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.b}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file2" onChange={this._onFileInputChange.bind(this, 'ageziademanio')}/>
                  </FlatButton>
                  { this.state.b !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'b')} icon={<Delete/>}/>: null}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere tecnico</TableRowColumn>
                <TableRowColumn><span style={this.state.c == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.c}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file3" onChange={this._onFileInputChange.bind(this, 'pareretecnico')}/>
                  </FlatButton>
                  { this.state.c !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'c')} icon={<Delete/>}/>: null}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere urbanistico</TableRowColumn>
                <TableRowColumn><span style={this.state.d == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.d}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file4" onChange={this._onFileInputChange.bind(this, 'parereurbanistico')}/>
                  </FlatButton>
                  { this.state.d !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'d')} icon={<Delete/>}/>: null}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere sopraintendenza beni paesaggistici</TableRowColumn>
                <TableRowColumn><span style={this.state.e == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.e}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file5" onChange={this._onFileInputChange.bind(this, 'pareresopraintendenza')}/>
                  </FlatButton>
                  { this.state.e !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'e')} icon={<Delete/>}/>: null}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere in aree SIC</TableRowColumn>
                <TableRowColumn><span style={this.state.f == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.f}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file6" onChange={this._onFileInputChange.bind(this, 'pareresic')}/>
                  </FlatButton>
                  { this.state.f !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'f')} icon={<Delete/>}/>: null}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere autorità marittima</TableRowColumn>
                <TableRowColumn><span style={this.state.g == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.g}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file7" onChange={this._onFileInputChange.bind(this, 'parereautoritamarittima')}/>
                  </FlatButton>
                  { this.state.g !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'g')} icon={<Delete/>}/>: null}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere sopraintendenza archeologica</TableRowColumn>
                <TableRowColumn><span style={this.state.h == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.h}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file8" onChange={this._onFileInputChange.bind(this, 'pareresopraintendenzaarcheologica')}/>
                  </FlatButton>
                  { this.state.h !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'h')} icon={<Delete/>}/>: null}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Parere autorità bacino</TableRowColumn>
                <TableRowColumn><span style={this.state.i == 'Non caricato' ? styles.notLoaded : styles.loaded}>{this.state.i}</span></TableRowColumn>
                <TableRowColumn>
                  <FlatButton icon={<Attach/>} label="Allega file" backgroundColor='#FFFFFF'>
                    <input type="file" style={styles.inputFile} accept="application/pdf" ref="file9" onChange={this._onFileInputChange.bind(this, 'parereautoritabacino')}/>
                  </FlatButton>
                  { this.state.i !== 'Non caricato' ? <FlatButton label="Elimina file" backgroundColor='#FFFFFF' onClick={this.onDisallega.bind(this,'i')} icon={<Delete/>}/>: null}
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
