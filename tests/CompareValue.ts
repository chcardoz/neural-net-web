import { Value } from "@/lib/Value";

/**
 * Compare two Value objects deeply.
 * @param {Value} v1 - The first Value object to compare.
 * @param {Value} v2 - The second Value object to compare.
 * @param {number} tolerance - Tolerance level for comparing numeric values.
 * @returns {boolean} True if all properties and nested children match within the tolerance, false otherwise.
 */
export default function compareValuesDeep(
    v1: Value,
    v2: Value,
    tolerance: number = 1e-6
): boolean {
    // Compare id
    if (v1.id !== v2.id) {
        return false;
    }

    // Compare name
    if (v1.name !== v2.name) {
        return false;
    }

    // Compare value with tolerance
    if (Math.abs(v1.value - v2.value) > tolerance) {
        return false;
    }

    // Compare children
    if (!compareChildrenDeep(v1.children, v2.children, tolerance)) {
        return false;
    }

    // Compare operator (op)
    if (v1.op !== v2.op) {
        return false;
    }

    return true;
}

/**
 * Compare arrays of Value objects (children) deeply.
 * @param {Array<Value> | null} arr1 - The first array of Value objects to compare.
 * @param {Array<Value> | null} arr2 - The second array of Value objects to compare.
 * @param {number} tolerance - Tolerance level for comparing numeric values.
 * @returns {boolean} True if all Value objects in both arrays and their nested children match within the tolerance, false otherwise.
 */
function compareChildrenDeep(
    arr1: Array<Value> | null,
    arr2: Array<Value> | null,
    tolerance: number
): boolean {
    // Handle both arrays being null
    if (!arr1 && !arr2) {
        return true;
    }

    // Handle one array being null
    if (!arr1 || !arr2) {
        return false;
    }

    // Compare length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Compare each element
    for (let i = 0; i < arr1.length; i++) {
        if (!compareValuesDeep(arr1[i], arr2[i], tolerance)) {
            return false;
        }
    }

    return true;
}
