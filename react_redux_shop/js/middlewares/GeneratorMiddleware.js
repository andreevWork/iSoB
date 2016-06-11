const GeneratorMiddleware = ({dispatch}) => next => action => {
    if(typeof action.next === 'function'){
        iterator(action);
    } else {
        return next(action);
    }

    // Итератор для прохода по генератору
    function iterator(generator) {
        let next = generator.next();
        // Если генератор кончился заканчиваем проход
        if(next.done) return;

        // Если из генератора пришел промис, ждем его завершения, отправляем результат в store и продолжаем обход.
        if(typeof next.value.then === 'function'){
            next.value.then((result) => {
                dispatch(result);
                iterator(generator);
            })
        } else {
            dispatch(next.value);
            iterator(generator);
        }
    }
};

export default GeneratorMiddleware;

export function* createActionGenerator(...args) {
    // Проходим по всем аргументам
    for(let i = 0, len = args.length; i < len; i++) {
        let val = args[i];
        // Если пришел что-то кроме объекта или промиса, тогда ошибка.
        if(Object.prototype.toString.call(val) !== "[object Object]" && typeof val.then !== 'function'){
            throw TypeError('arguments must be plain object or promise.')
        }
        // Отдаем наружу по одному
        yield args[i];
    }
}