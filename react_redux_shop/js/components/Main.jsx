import React from 'react';
import Filter from './Filter.jsx';
import Sorting from './Sorting.jsx';
import Gallery from './Gallery.jsx';

export default class Main extends React.Component {

    static childContextTypes = {
        store: React.PropTypes.object
    };

    static propTypes = {
        store: React.PropTypes.object
    };

    getChildContext() {
        return {store: this.props.store};
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-4 col-md-5 col-sm-12 col-xs-12">
                        <div className="panel panel-primary">
                            <div className="panel-body">
                                Магазин ноутбуков
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <Filter />
                    <div className="col-lg-8 col-md-7 col-sm-12 col-xs-12">
                        <Sorting />
                        <Gallery />
                    </div>
                </div>
            </div>
        );
    }
}