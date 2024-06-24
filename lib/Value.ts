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
        let out = new Value(
            this.id + other.id,
            `${this.name} + ${other.name}`,
            this.value + other.value,
            [this, other],
            "+"
        );

        // Define the backward function
        out._backward = () => {
            this.grad += out.grad;
            other.grad += out.grad;
        };

        return out;
    }

    /**
     * Subtracts two Value objects.
     * @param {Value} other - The other Value to subtract.
     * @returns {Value} The result of the subtraction.
     */
    subtract(other: Value): Value {
        let out = new Value(
            this.id + other.id,
            `${this.name} - ${other.name}`,
            this.value - other.value,
            [this, other],
            "-"
        );

        // Define the backward function
        out._backward = () => {
            this.grad += out.grad;
            other.grad -= out.grad;
        };

        return out;
    }

    /**
     * Multiplies two Value objects.
     * @param {Value} other - The other Value to multiply.
     * @returns {Value} The result of the multiplication.
     */
    multiply(other: Value): Value {
        let out = new Value(
            this.id + other.id,
            `${this.name} * ${other.name}`,
            this.value * other.value,
            [this, other],
            "*"
        );

        // Define the backward function
        out._backward = () => {
            this.grad += other.value * out.grad;
            other.grad += this.value * out.grad;
        };

        return out;
    }

    /**
     * Applies the tanh function to the Value.
     * @returns {Value} The result of the tanh function.
     */
    tanh(): Value {
        const t = Math.tanh(this.value);
        let out = new Value(this.id, `tanh(${this.name})`, t, [this], "tanh");

        // Define the backward function
        out._backward = () => {
            this.grad += (1 - t * t) * out.grad;
        };

        return out;
    }

    backward(): void {
        const topo: Value[] = [];
        const visited = new Set<Value>();

        const buildTopo = (v: Value) => {
            if (!visited.has(v)) {
                visited.add(v);
                if (v.children) {
                    for (const child of v.children) {
                        buildTopo(child);
                    }
                    topo.push(v);
                }
            }
        };

        buildTopo(this);

        this.grad = 1.0;
        for (const node of topo.reverse()) {
            node._backward();
        }
    }
}
