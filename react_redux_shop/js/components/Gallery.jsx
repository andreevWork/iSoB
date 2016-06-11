import React from 'react';
import {getNumberWithSpace} from './../utils/StringFormat'

export default class Gallery extends React.Component {

    static contextTypes = {
        store: React.PropTypes.object
    };

    state = {
        data: []
    };

    componentDidMount() {
        this.context.store.subscribe(() => {
            this.setState({data: this.context.store.getState().collection.data || []});
        });
    }

    render() {
        console.log(this.state.data);
        return (
            <div className="row">
                {this.state.data.length && this.state.data.map(item => <GalleryItem {...item} />)}
            </div>
        );
    }
}

const GalleryItem = ({name, rating, price}) => {
    return (
        <div className="col-lg-6 col-md-12 col-sm-6 col-xs-12">
            <div className="panel panel-default">
                <div className="panel-body">
                    <div className="text-center">
                        <img src="/public/1.png" width="310" className="img-rounded" />
                    </div>
                    <div className="caption">
                        <h4>{name}</h4>
                        <p>
                            Рэйтинг: {rating}
                        </p>
                        <p>
                            Цена: {getNumberWithSpace(price + '')} руб.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}