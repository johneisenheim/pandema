import React from 'react';
import $ from 'jquery';

class PDFView extends React.Component{
  constructor(props, context){
    super(props, context);
    var _self = this;
    $.ajax({
        type: 'GET',
        data: {praticaID : 1, pandemaPraticaID: this.props.params.id},
        url: 'http://127.0.0.1:8001/viewDocument?allegatoID='+this.props.params.id,
        processData: false,
        contentType: false,
        success: function(data) {
          console.log('success');
          console.log(data);
        },
        error : function(err){
          ;
        }
    });
  }


  render(){
    /*return(
      <PDFViewer
        document={{
          url: 'https://localhost:8080/documents/'
        }}
      />
    );*/
    return null;
  }

}

export default PDFView;
