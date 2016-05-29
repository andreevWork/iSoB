import React from 'react';
import {createStore} from 'redux';

var red = function(state = {}, action) {

    if(action.type == 'a'){
        return { arr : 1};
    }

    return state;
};
var s = createStore(red);

export default class T extends React.Component {
    componentDidMount() {
        fetch('http://localhost:3002/notebooks/filter_fields')
            .then(r => r.json())
            .then(r => this.setState({arr: r}));

        s.subscribe(() => {
            this.setState({
                a: s.getState().arr 
            })
        });

        setTimeout(() => {
            s.dispatch({ type: 'a'});
        }, 2000)
    }
    render(){
        return <div>
            <div>{(this.state && this.state.arr[0].text) || '111111'}</div>
            <div>{(this.state && this.state.a) || '22222'}</div>
        </div>;
    }
}