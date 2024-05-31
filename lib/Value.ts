/**
 * Represents a value.
 */
export class Value {
    id: string;
    name: string;
    value: number;
    children: Array<Value> | null;
    op: string;

    /**
     * Constructs a new Value object.
     * @param {string} name - The name of the value.
     * @param {number} value - The numeric value.
     * @param {Array<Value>} children - The children values.
     * @param {string} op - The operation associated with the value.
     */
    constructor(
        id: string,
        name: string,
        value: number,
        children: Array<Value> | null,
        op: string
    ) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.children = children;
        this.op = op;
    }
}
