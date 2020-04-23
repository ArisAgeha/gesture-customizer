export function isArray(array: any): array is any[] {
    if (Array.isArray) {
        return Array.isArray(array);
    }

    if (array && typeof array.length === 'number' && array.constructor === Array) {
        return true;
    }

    return false;
}