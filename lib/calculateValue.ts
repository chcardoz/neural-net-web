import { Value } from "@/lib/Value";

export function calculateValue(
    valueLeft: Value,
    valueRight: Value,
    op: string
): number {
    if (op === "+") {
        return valueLeft.value + valueRight.value;
    } else if (op === "-") {
        return valueLeft.value - valueRight.value;
    } else if (op === "*") {
        return valueLeft.value * valueRight.value;
    } else if (op === "/") {
        return valueLeft.value / valueRight.value;
    } else if (op === "=") {
        return valueRight.value;
    } else {
        throw new Error(`Unsupported operation: ${op}`);
    }
}

export function calculateNameString(
    valueLeft: Value,
    valueRight: Value,
    op: string
): string {
    if (op === "=") {
        return valueLeft.name;
    } else {
        return valueLeft.name + op + valueRight.name;
    }
}
