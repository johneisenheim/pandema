import flux from 'flux-react';

const actions = flux.createActions([
    'toggleTextFieldStatus',
    'startLoading',
    'endLoading',
    'selectMenuItem',
    'hoverMenuItem',
    'dehoverMenuItem',
    'toggleCompatibility',
    'addChip'
]);

export default actions;
