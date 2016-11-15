import flux from 'flux-react';
import actions from '../actions/actions.js';


var D1HandlerStore = flux.createStore({
  values : {
    currentComp : 1
  },
  actions: [
      actions.toggleCompatibility
  ],
  toggleCompatibility : function(){
      return 1 ? this.values.currentComp == 0 : 0;
  },
  exports : {
    getD1Store : function(){
      return this.values;
    }
  }
});

export default D1HandlerStore;
