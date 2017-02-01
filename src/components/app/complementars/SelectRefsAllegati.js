import React from 'react';
import $ from 'jquery';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { browserHistory } from 'react-router';

class SelectRefsAllegati extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      value : 0,
      abusi : this.props.abusi,
      abusiItems : []
    }
  }

  componentWillMount(){
    var _items = [];
    _items.push(<MenuItem key={0} value={0} primaryText={"Seleziona"} />);
    for(var i = 0; i < this.props.abusi.length; i++){
      var _value = this.props.abusi[i].id+'/'+this.props.abusi[i].pandema_abuso_id;
      _items.push(<MenuItem key={i+1} value={_value} primaryText={this.props.abusi[i].pandema_abuso_id} />)
    }
    this.setState({
      ...this.state,
      abusiItems : _items
    })
  }

  changePraticaStatus(e,v,m){
    //valore nuovo è m
    this.setState({
      ...this.state,
      value : m
    }, function(){
      if( m == 0 ){
        this.props.createTable(undefined, undefined);
      }else{
        var splitted = m.split('/');
        this.props.createTable(splitted[0], splitted[1])
      }
    });

  }

  render(){
    return(
      <DropDownMenu ref="status" value={this.state.value} labelStyle={{fontSize:'14px'}} underlineStyle={{borderTopColor:'transparent'}} onChange={this.changePraticaStatus.bind(this)}>
        {this.state.abusiItems}
      </DropDownMenu>
    )
  }

}

export default SelectRefsAllegati;
