/**
 * Represents a value.
 */
export class Value {
    id: string;
    name: string;
    value: number;
    children: Array<Value> | null;
    op: string;
    grad: number;
    _backward: () => void;

    /**
     * Constructs a new Value object.
     * @param {string} name - The name of the value.
     * @param {number} value - The numeric value.
     * @param {Array<Value>} children - The children values.
     * @param {string} op - The operation associated with the value.
     * @param {number} grad - The gradient of the value.
     * @param {() => void} _backward - The backward function.
     */
    constructor(
        id: string,
        name: string,
        value: number,
        children: Array<Value> | null,
        op: string,
        grad: number = 0,
        _backward = () => {}
    ) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.children = children;
        this.op = op;
        this.grad = grad;
        this._backward = _backward;
    }

    /**
     * Adds two Value objects.
     * @param {Value} other - The other Value to add.
     * @returns {Value} The result of the addition.
     */
    add(other: Value): Value {
        return new Value(
            this.id + other.id,
            `${this.name} + ${other.name}`,
            this.value + other.value,
            [this, other],
            "+"
        );
    }

    /**
     * Multiplies two Value objects.
     * @param {Value} other - The other Value to multiply.
     * @returns {Value} The result of the multiplication.
     */
    multiply(other: Value): Value {
        return new Value(
            this.id + other.id,
            `${this.name} * ${other.name}`,
            this.value * other.value,
            [this, other],
            "*"
        );
    }

    /**
     * Applies the tanh function to the Value.
     * @returns {Value} The result of the tanh function.
     */
    tanh(): Value {
        const t = Math.tanh(this.value);
        return new Value(this.id, `tanh(${this.name})`, t, [this], "tanh");
    }
}
