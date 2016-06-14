import React from 'react';
import {changeSortingField} from '../actions/ActionsCreators';
import {URL} from '../config/config';

export default class Sorting extends React.Component {
    static contextTypes = {
        store: React.PropTypes.object
    };
    
    state = {
        sort_fields: [],
        key_sort: this.context.store.getState().query.key_sort,
        sort_direction: +this.context.store.getState().query.sort_direction
    };

    icon_mapping = {
        name: 'glyphicon-sort-by-alphabet'
    };

    default_icon = 'glyphicon-sort-by-attributes';

    getClassForButton(key_sort) {
        return this.icon_mapping[key_sort] || this.default_icon;
    }

    componentDidMount() {
        fetch(URL.sort_fields)
            .then(res => res.json())
            .then(json => this.setState({sort_fields: json}));
    }

    onClick(key_sort) {
        this.setState({
            sort_direction: key_sort === this.state.key_sort ? -this.state.sort_direction : -1,
            key_sort: key_sort
        }, () => {
            this.context.store.dispatch(changeSortingField(this.state.key_sort, this.state.sort_direction));
        });
    }

    renderSortFields() {
        var is_active;
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    {this.state.sort_fields.map((field, i) => {
                        is_active = this.state.key_sort === field.key_sort;
                        return <SortButton
                            {...field}
                            key={i}
                            is_active={is_active}
                            icon={this.getClassForButton(field.key_sort)}
                            icon_sub={(this.state.sort_direction === 1 && is_active)  ? '' : '-alt'}
                            onClick={this.onClick.bind(this)} />
                    })}
                </div>
            </div>
        );
    }

    render(){
        var render_element = (this.state && this.state.sort_fields.length > 0) ? this.renderSortFields() : <span>loader</span>;

        return render_element;
    }
}

class SortButton extends React.Component {
    static propTypes = {
        text: React.PropTypes.string.isRequired,
        key_sort: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        is_active: React.PropTypes.bool.isRequired,
        icon: React.PropTypes.string.isRequired,
        icon_sub: React.PropTypes.string.isRequired
    };

    render () {
        var {text, key_sort, onClick, is_active, icon, icon_sub} = this.props;
        return (
            <button onClick={(e) => onClick(key_sort)} type="button" className={"btn btn-default btn--sort btn-sm " + (is_active ? ' active ' : '')}>
                <span className={`glyphicon ${icon}${icon_sub}`} />
                {text}
            </button>
        );
    };
};