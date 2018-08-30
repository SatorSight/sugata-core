export function in_array(needle, haystack) {
    if(empty(haystack) || !needle)
        return false;

    return haystack.indexOf(needle) !== -1;
}

export const OK_RESULT = 'ok';

export function capitalize(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function push_if_not_there(needle, haystack) {
    if (!in_array(needle, haystack))
        haystack.push(needle);
    return haystack;
}

export function toggle_array_element(needle, haystack) {
    if (!in_array(needle, haystack))
        haystack.push(needle);
    else
        haystack = remove_array_element(needle, haystack);

    return haystack;
}

export function toggle_array_element_by(new_element, haystack, finder){
    const array_copy = haystack.slice(0);
    const _element = array_copy.find(finder);
    const index = array_copy.findIndex(el => el === _element);

    if(index === -1)
        array_copy.push(new_element);
    else
        array_copy.splice(index, 1);

    return array_copy;
}

export function change_array_element(array, find, change){
    const array_copy = array.slice(0);
    const _element = array.find(find);
    let element = Object.assign({}, _element);
    const index = array_copy.findIndex(el => el === _element);

    change(element);
    array_copy[index] = element;
    return array_copy;
}

export function remove_array_element(needle, haystack) {
    let resulting_array = [];
    haystack.map((element) => {
        if (element !== needle)
            resulting_array.push(element);
    });
    return resulting_array;
}

export function not_single(haystack) {
    return haystack.length !== 1
}

export function single(haystack) {
    return haystack.length === 1
}

export function any(haystack) {
    if(haystack === undefined)
        return false;
    return haystack.length > 0
}

export function build_query(params){
    // const esc = encodeURIComponent;
    let query = Object.keys(params)
        .map(k => k + '=' + params[k])
        .join('&');
    if(query.length > 0)
        query = '?' + query;

    return query;
}

export function empty(haystack){
    if(!haystack)
        return true;
    if(Number.isInteger(haystack) && isNaN(haystack))
        return true;
    if(haystack === null)
        return true;
    if(haystack === undefined)
        return true;
    if(haystack === '')
        return true;
    if(haystack === false)
        return true;
    if(haystack.length === 0)
        return true;
    if(haystack.constructor === Object && Object.keys(haystack).length === 0)
        return true;
    if((haystack instanceof DateRange) && empty(haystack.from) && empty(haystack.to))
        return true;
    return false;
}

export function first(haystack) {
    return haystack.find(() => true);
}

export function last(haystack) {
    if(haystack && haystack.length > 0)
        return haystack[haystack.length - 1];
    else
        return false;
}

export function clone_array(haystack) {
    return haystack.slice(0);
}

export function buildParamStringFromObject(object){
    let params_array = [];
    Object.keys(object).map(key => params_array.push(`${key}=${object}`));
    let param_string = params_array.join('&');
    if(param_string.length > 0)
        param_string = `/?${param_string}`;
    return param_string;
}


export function makeQuery(payload, method, query, callback) {
    let data = new FormData();
    data.append("json", JSON.stringify(payload));

    fetch(`/${query}/`,
        {
            method: method,
            body: data,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => callback())
}

export function updateStateWithApiRequestFor(entity, _this) {
    fetch('/api/' + entity)
        .then(data => data.json())
        .then(json => {
            let data = { ..._this.state.data };
            data[entity] = json;
            _this.setState({ data });
        })
}

export function idOrNull(something){
    if(something === null)
        return null;
    if(!something.hasOwnProperty('id'))
        return null;
    return something.id;
}

export function appendStateWithApiRequestFor(entity, apiRoute, _this) {
    const current_data = _this.state.data[entity];
    console.log(current_data);
    console.log(typeof current_data);
    const last_id = empty(current_data) ? 0 : current_data[current_data.length - 1].id;
    fetch('/api/' + apiRoute + '/' + last_id + '/')
        .then(data => data.json())
        .then(json => {
            let data = { ..._this.state.data };
            data[entity] = data[entity].concat(json);
            _this.setState({ data });
        })
}

// js wtf ...
export function dateToFormattedInputString(date){
    return date
        .toLocaleDateString('ru-RU', {year: 'numeric', month: '2-digit', day: '2-digit'})
        .split('.')
        .reverse()
        .join('-');
}

export class DateRange{
    constructor(from = null, to = null){
        this.from = from || '';
        this.to = to || '';
    }

    static plain(){
        return {
            from: this.from,
            to: this.to
        }
    }


    // toString(){
    //     return 'lol';
    // }
}