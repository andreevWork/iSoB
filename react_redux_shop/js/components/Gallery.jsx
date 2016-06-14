import React from 'react';
import Queue from 'triple-queue';
import {getNumberWithSpace} from './../utils/StringFormat'
import {DEFAULT_COLLECTION_SIZE} from "../config/config";
import {changeSkip} from "../actions/ActionsCreators";
import {QueueActionsTypes} from "./../actions/ActionsTypes";

export default class Gallery extends React.Component {

    static contextTypes = {
        store: React.PropTypes.object
    };

    state = {
        data: [],
        last_update: Date.now(),
        queue_action: null
    };

    initQueue() {
        this.queue = new Queue();
        this.queue.setSize(DEFAULT_COLLECTION_SIZE);
    }
    
    changeState(queue_action = null) {
        this.setState({
            queue_action,
            data: this.queue.getActual(),
            from: this.queue.getActualRange().from,
            to: this.queue.getActualRange().to,
            count: this.queue.getCount(),
            has_next: !!this.queue.getNext().length,
            has_prev: !!this.queue.getPrev().length,
            last_update:  Date.now()
        });
    }

    componentDidMount() {
        this.context.store.subscribe(() => {
            let {count, data, last_update} = this.context.store.getState().collection;

            if(this.state.last_update < last_update) {

                switch(this.state.queue_action) {
                    case QueueActionsTypes.FORWARD:
                        this.queue.setPiece(data);
                        break;
                    
                    case QueueActionsTypes.BACK:
                        this.queue.setPrevPiece(data);
                        break;

                    default:
                        this.initQueue();
                        this.queue.setCount(count);
                        data.length && this.queue.setPiece(data.splice(0, DEFAULT_COLLECTION_SIZE));
                        data.length && this.queue.setPiece(data);
                        break;
                }

                this.changeState();
            }

        });
    }

    goForward() {
        this.queue.moveForward();

        if(!this.queue.isEnd()) {
            this.changeState(QueueActionsTypes.FORWARD);
            this.context.store.dispatch(changeSkip(this.queue.getActualRange().to));
        } else {
            // Если дошли до конца очереди, грузить уже нечего, просто обновляем состояние
            this.changeState();
        }
    }

    goBack() {
        this.queue.moveBack();

        if(!this.queue.isStart()) {
            // Если не дошли до начала просто двигаем указатель в очереди назад
            this.changeState(QueueActionsTypes.BACK);

            let skip = this.queue.getActualRange().to - DEFAULT_COLLECTION_SIZE * 2;
            skip = skip > 0 ? skip : 0;
            this.context.store.dispatch(changeSkip(skip));
        } else {
            // Если дошли в начало ничего грузить не нужно, просто обновить состояние компонента
            this.changeState();
        }


    }

    render() {
        return (
            <div className="row">
                {this.state.data.length ? this.renderCollection() : null}
            </div>
        );
    }

    renderCollection() {
        return (<div>
            {this.renderNavigator()}
            {this.state.data.map((item, i) => <GalleryItem key={i} {...item} />)}
            {+this.state.to - +this.state.from > DEFAULT_COLLECTION_SIZE / 2 ? this.renderNavigator() : null}
        </div>);
    }

    renderNavigator() {
        return <div className="col-lg-12 col-xs-12">
            <div className="well well-lg">{`Показано ${this.state.from} - ${this.state.to} из ${this.state.count}`}
                <div className="btn-group pull-right">
                    {this.state.has_prev && <button onClick={() => this.goBack()} type="button" className="btn btn-primary btn-xs">Назад</button>}
                    {this.state.has_next && <button type="button" onClick={() => this.goForward()} className="btn btn-primary btn-xs">Далее</button>}
                </div>
            </div>
        </div>;
    }
}

const GalleryItem = ({name, rating, price, ORM, MORM, material, processor, video_memory, screen_size}) => {
    return (
        <div className="col-lg-6 col-md-12 col-sm-6 col-xs-12">
            <div className="panel panel-default">
                <div className="panel-body">
                    <div className="pull-right">
                        <div>{rating}  <span className="glyphicon glyphicon-star" /></div>
                        <div>{screen_size} <span className="glyphicon glyphicon-resize-full" /></div>
                    </div>
                    <div className="text-center">
                        <img src="/public/1.png" width="310" className="img-rounded" />
                        <h4>{name}</h4>
                    </div>
                    <div className="caption">
                        <ul className="list-group">
                            <li className="list-group-item">
                                Цена:
                                <span className="badge">{getNumberWithSpace(price + '')} руб</span>
                            </li>
                            <li className="list-group-item">
                                ORM (max ORM):
                                <span className="badge">{ORM} ({MORM}) GB</span>
                            </li>
                            <li className="list-group-item">
                                Процессор:
                                <span className="badge">{processor}</span>
                            </li>
                            <li className="list-group-item">
                                Видео память:
                                <span className="badge">{video_memory}</span>
                            </li>
                            <li className="list-group-item">
                                Материал:
                                <span className="badge">{material.join(', ')}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};