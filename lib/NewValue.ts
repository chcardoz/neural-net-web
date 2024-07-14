import { v4 as uuidv4 } from "uuid";

type op = "+" | "-" | "*" | "**" | "new" | "ReLU" | "Tanh" | "=";

export class Value {
    id: string;
    name: string;
    data: number;
    grad: number;
    _prev: Set<Value>;
    _op: string;
    _backward: () => void;

    constructor(
        data: number,
        name: string,
        _children: Array<Value> = [],
        _op: op = "new"
    ) {
        this.id = uuidv4();
        this.data = data;
        this.name = name;
        this.grad = 0;
        this._prev = new Set(_children);
        this._op = _op;
        this._backward = () => {};
    }

    __add__(other: Value | number): Value {
        other =
            other instanceof Value ? other : new Value(other, String(other));
        let out = new Value(
            this.data + other.data,
            this.name + "+" + other.name,
            [this, other],
            "+"
        );
        out._backward = () => {
            this.grad += out.grad;
            other.grad += out.grad;
        };
        return out;
    }

    __mul__(other: Value | number): Value {
        other =
            other instanceof Value ? other : new Value(other, String(other));
        let out = new Value(
            this.data * other.data,
            this.name + "*" + other.name,
            [this, other],
            "*"
        );
        out._backward = () => {
            this.grad += other.data * out.grad;
            other.grad += this.data * out.grad;
        };
        return out;
    }

    __pow__(other: Value | number): Value {
        other =
            other instanceof Value ? other : new Value(other, String(other));
        let out = new Value(
            this.data ** other.data,
            this.name + "**" + other.name,
            [this],
            `**`
        );
        out._backward = () => {
            this.grad += other.data * this.data ** (other.data - 1) * out.grad;
        };
        return out;
    }

    relu(): Value {
        let out = new Value(
            this.data < 0 ? 0 : this.data,
            "ReLU(" + this.name + ")",
            [this],
            "ReLU"
        );
        out._backward = () => {
            this.grad += (out.data > 0 ? 1 : 0) * out.grad;
        };
        return out;
    }

    tanh(): Value {
        const t = Math.tanh(this.data);
        let out = new Value(t, "Tanh(" + this.name + ")", [this], "Tanh");
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
                v._prev.forEach((child) => buildTopo(child));
                topo.push(v);
            }
        };

        buildTopo(this);
        this.grad = 1.0;
        topo.reverse().forEach((node) => node._backward());
    }

    __neg__(): Value {
        return this.__mul__(-1);
    }

    __radd__(other: Value | number): Value {
        return this.__add__(other);
    }

    __sub__(other: Value | number): Value {
        other =
            other instanceof Value ? other : new Value(other, String(other));
        return this.__add__(other.__neg__());
    }

    __truediv__(other: Value | number): Value {
        return this.__mul__(
            (other instanceof Value
                ? other
                : new Value(other, String(other))
            ).__pow__(-1)
        );
    }

    __eq__(other: Value | number): Value {
        other =
            other instanceof Value ? other : new Value(other, String(other));
        return new Value(other.data, this.name, [this, other], "=");
    }

    toString(): string {
        return `Value(data=${this.data}, grad=${this.grad})`;
    }

    toName(): string {
        return `${this.data}`;
    }

    __eval__(other: Value, _op: string): Value {
        if (_op === "+") {
            return this.__add__(other);
        } else if (_op === "-") {
            return this.__sub__(other);
        } else if (_op === "*") {
            return this.__mul__(other);
        } else if (_op === "**") {
            return this.__pow__(other);
        } else if (_op === "ReLU") {
            return this.relu();
        } else if (_op === "Tanh") {
            return this.tanh();
        } else if (_op === "=") {
            return this.__eq__(other);
        } else {
            throw new Error(`Unsupported operator ${_op}`);
        }
    }
}
