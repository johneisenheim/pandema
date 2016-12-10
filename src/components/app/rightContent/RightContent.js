import React from 'react';
import Box from 'react-layout-components';
import styles from './RightContent.css.js';

import NavBar from './navbar/NavBar';

class RightContent extends React.Component{
  render(){
    return (
      <div id="bar" style={{backgroundColor:"#EEF0F4", width:"100%"}}>
        <NavBar />
        <Box style={{flex:1, width : '100%'}}>
          <Box style={{flex:1, marginLeft : '15px', marginRight:'15px', width : '100%'}}>
            {this.props.children}
          </Box>
        </Box>
      </div>
    )
  }
}

export default RightContent;
