export function getNumberWithSpace(str) {
    return str ? str.replace(/(?!^)(?=(\d{3})+$)/g, ' ') : '';
}

export function getOnlyNumber(str) {
    return str ? str.replace(/[\D]/g, '') : '';
}