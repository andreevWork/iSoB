import React from 'react';
import {changeQuery} from '../actions/ActionsCreators';
import {getNumberWithSpace, getOnlyNumber} from '../utils/StringFormat';
import {DEFAULT_ENTER_DELAY} from "../config/config";
import {URL} from '../config/config';

export default class Filter extends React.Component {
    state = {
        filters: []
    };

    componentDidMount() {
        fetch(URL.filters)
            .then(res => res.json())
            .then(json => this.setState({filters: json}));
    }

    renderFilter() {
        return (
            <div className="col-lg-4 col-md-5 col-sm-12 col-xs-12`">
            <div className="panel panel-default">
                <div className="panel-body">
                    <form  role="form">
                        {this.state.filters.map((filter, i) => {
                            return filter.type == 'range' ?
                                <Range key={i} {...filter} /> :
                                <Check key={i} {...filter} />;
                        })}
                    </form>
                </div>
            </div>
            </div>
        );
    }

    render(){
        return (this.state && this.state.filters.length > 0) ? this.renderFilter() : <span>loader</span>;
    }
}


class Range extends React.Component {

    static contextTypes = {
        store: React.PropTypes.object
    };

    static propTypes = {
        text: React.PropTypes.string.isRequired,
        unit: React.PropTypes.string.isRequired,
        min: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        key_min: React.PropTypes.string.isRequired,
        key_max: React.PropTypes.string.isRequired
    };

    state = {
        min_val : this.context.store.getState().query[this.props.key_min] || '',
        max_val : this.context.store.getState().query[this.props.key_max] || '',
        id_timeout : 0
    };

    componentDidMount() {
    }
    
    onChange(value, query_key, state_key) {
        var	real_val = getOnlyNumber(value);
        
        // Небольшая оптимизация, если значение не состоит из цифр или не изменилось, опять же в плане цифр, ничего не апдейтим.
        if((!real_val && value) || real_val === this.state[state_key]) return;

        clearInterval(this.state.id_timeout);

        this.setState({
            [state_key]: real_val,
            id_timeout: setTimeout(() => this.context.store.dispatch(changeQuery(query_key, real_val)), DEFAULT_ENTER_DELAY)
        });
    }

    render () {
        var {text, unit, min, max, key_min, key_max} = this.props;
            return (
                <div className="form-group">
                    <label>{`${text}, ${unit}`}</label>
                    <div className="input-group" style={{marginTop: 10}}>
                        <span className="input-group-addon">от: </span>
                        <input
                            onChange={(e) => this.onChange(e.target.value, key_min, 'min_val')}
                            className="form-control"
                            placeholder={min} value={getNumberWithSpace(this.state.min_val)} />

                        <span className="input-group-addon" style={{ borderLeft: 0, borderRight: 0}}>до: </span>
                        <input
                            onChange={(e) => this.onChange(e.target.value, key_max, 'max_val')}
                            className="form-control"
                            placeholder={max}
                            value={getNumberWithSpace(this.state.max_val)} />
                    </div>
                </div>
            );
    };
}


class Check extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object
    };

    static propTypes = {
        text: React.PropTypes.string.isRequired,
        query_key: React.PropTypes.string.isRequired,
        values: React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])).isRequired
    };


    componentDidMount() {
    }

    onChange(e, key) {
        // Значение отдается обернутое в массив, чтобы в редьюсере различать фильтра, не передавая тип явно
        this.context.store.dispatch(changeQuery(key, [e.target.value]));
    }

    render () {
        var {text, query_key, values} = this.props;
        return (
            <div className="form-group">
                <label>{text}</label>
                <div className="checkbox checkbox--padding">
                    {values.map((value, i) => {
                        return (
                            <label key={i} >
                                <input
                                    defaultChecked={
                                        !!(this.context.store.getState().query[query_key]
                                        &&
                                        ~this.context.store.getState().query[query_key].indexOf(value))
                                    }
                                    onChange={(e) => this.onChange(e, query_key)}
                                    type="checkbox"
                                    value={value}  /> {value}
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    };
}