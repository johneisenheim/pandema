import React from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import LogoWhite from '../../../../static/pandemalogowhite.png';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Book from 'material-ui/svg-icons/action/book';
import Judge from 'material-ui/svg-icons/action/gavel';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ImportContacts from 'material-ui/svg-icons/communication/import-contacts';
import Storage from 'material-ui/svg-icons/device/storage';
import AbusiIcon from 'material-ui/svg-icons/maps/layers-clear';
import styles from './Sidebar.css.js';
import {Router, Route, browserHistory} from "react-router";

import DrawerStore from '../../../stores/DrawerStore';
import actions from '../../../actions/actions.js';
import {Link} from "react-router";



class Sidebar extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = DrawerStore.getListItemsState();
  }

  componentWillMount(){
    DrawerStore.on('app.drawerchanged', this.updateState.bind(this));
    DrawerStore.on('app.drawerhovered', this.updateState.bind(this));
    DrawerStore.on('app.drawerdehovered', this.updateState.bind(this));
  }

  _onClick(index){
    actions.selectMenuItem(index);
  }

  _onMouseEnter(index){
    actions.hoverMenuItem(index);
  }

  _onMouseLeave(index){
    actions.dehoverMenuItem(index);
  }

  updateState(){
    this.setState(DrawerStore.getListItemsState());
  }

  render(){
    return (
            <div style={styles.drawer}>
              <center><img src = {LogoWhite} style = {styles.logo}/></center>
              <List ref = "menu">
                <Link to="/" style={{color: 'white', textDecoration:'none'}} activeStyle={{color: 'white'}}>
                  <ListItem primaryText="Provvedimenti"
                    style={{backgroundColor:this.state.values[0]!=='' ? this.state.values[0] : '', fontSize:'14px', fontWeight:'500', height:'60px'}}
                    innerDivStyle = {{paddingLeft:'65px', paddingTop:'21px'}}
                    leftIcon={<Judge style={{fill:'#FFFFFF', marginTop:'17px'}}/>}
                    onClick={this._onClick.bind(this, 0)}
                    onMouseEnter={this._onMouseEnter.bind(this,0)}
                    onMouseLeave={this._onMouseLeave.bind(this,0)}
                  />
                </Link>
                <Link to="/archivio" style={{color: 'white', textDecoration:'none'}} activeStyle={{color: 'white'}}>
                <ListItem primaryText="Archivio Pratiche"
                  style={{backgroundColor:this.state.values[1]!=='' ? this.state.values[1] : '', fontSize:'14px', fontWeight:'500', height:'60px'}}
                  innerDivStyle = {{paddingLeft:'65px', paddingTop:'21px'}}
                  leftIcon={<Storage style={{fill:'#FFFFFF', marginTop:'17px'}}/>}
                  onClick={this._onClick.bind(this, 1)}
                  onMouseEnter={this._onMouseEnter.bind(this,1)}
                  onMouseLeave={this._onMouseLeave.bind(this,1)}
                />
                </Link>
                <Link to="/registri" style={{color: 'white', textDecoration:'none'}} activeStyle={{color: 'white'}}>
                <ListItem primaryText="Registri"
                  style={{backgroundColor:this.state.values[2]!==''  ? this.state.values[2] : '', fontSize:'14px', fontWeight:'500', height:'60px'}}
                  innerDivStyle = {{paddingLeft:'65px', paddingTop:'21px'}}
                  leftIcon={<Book style={{fill:'#FFFFFF', marginTop:'17px'}}/>}
                  onClick={this._onClick.bind(this, 2)}
                  onMouseEnter={this._onMouseEnter.bind(this,2)}
                  onMouseLeave={this._onMouseLeave.bind(this,2)}
                />
                </Link>
              <Link to="/gestioneabusi" style={{color: 'white', textDecoration:'none'}} activeStyle={{color: 'white'}}>
              <ListItem primaryText="Gestione Abusi"
                  style={{backgroundColor:this.state.values[3]!==''  ? this.state.values[3] : '', fontSize:'14px', fontWeight:'500', height:'60px'}}
                  innerDivStyle = {{paddingLeft:'65px', paddingTop:'21px'}}
                  leftIcon={<AbusiIcon style={{fill:'#FFFFFF', marginTop:'17px'}}/>}
                  onClick={this._onClick.bind(this, 3)}
                  onMouseEnter={this._onMouseEnter.bind(this,3)}
                  onMouseLeave={this._onMouseLeave.bind(this,3)}
                />
              </Link>
              </List>
          </div>
    )
  }

}

export default Sidebar;
