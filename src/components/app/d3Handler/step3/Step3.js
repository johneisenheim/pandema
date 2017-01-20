import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Box, Center} from 'react-layout-components';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import Pareri from './Pareri';
import Altro from './Altro';
import {Tabs, Tab} from 'material-ui/Tabs';

//D4D4D4

class Step3 extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      value : 'a'
    };
  }

  handleChange(v){
    this.setState({
      value : v
    })
  }


  render (){
      return (
        <Tabs
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        >
          <Tab label="Pareri" value="a" style={{backgroundColor:'white'}}>
              <div >
                <Pareri pid={this.props.pid} dbid={this.props.dbid} />
              </div>
          </Tab>
          <Tab label="Altri Pareri" value="b" style={{backgroundColor:'white'}}>
            <div>
              <Altro pid={this.props.pid} dbid={this.props.dbid}/>
            </div>
          </Tab>
        </Tabs>
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
