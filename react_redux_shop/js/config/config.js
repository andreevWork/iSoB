export class DEFAULT_SORTING {
    /*
     * дефолтная сортировка
     */
    static key_sort = 'rating';
    static sort_direction = -1;
}

export const BASE_URL =  'http://localhost:3002/notebooks';

export class URL {
    static base = BASE_URL;
    static filters = `${BASE_URL}/filter_fields`;
    static sort_fields = `${BASE_URL}/sort_fields`;
}

/*
 * Дефолтное количество элементов на странице
 */
export const DEFAULT_COLLECTION_SIZE = 15;

/*
 * Объект для мержа в объект запроса, изначальные значение для размера запрашиваемых данных
 */
export const DEFAULT_SIZE_OBJECT = {
    skip: 0,
    limit: DEFAULT_COLLECTION_SIZE * 2
};

/*
 * Дефолтное значение задержки отправки данных при вводе
 */
export const DEFAULT_ENTER_DELAY = 1000;
