import { Value } from "./NewValue";

export class Tensor {
    shape: [number, number];
    data: Array<Value>;

    constructor(_data: Array<Value> = [], _shape: [number, number] = [0, 0]) {
        if (_shape[0] * _shape[1] !== _data.length) {
            throw new Error("Data length does not match the dimensions!");
        }
        this.shape = _shape;
        this.data = _data;
    }

    __add__(other: Tensor): Tensor {
        if (
            this.shape[0] !== other.shape[0] ||
            this.shape[1] !== other.shape[1]
        ) {
            throw new Error(
                "Cannot add a " +
                    this.shapeString() +
                    " tensor to a " +
                    other.shapeString() +
                    " tensor"
            );
        }

        // Adding the tensors element wise
        const resultData: Array<Value> = this.data.map((value, idx) =>
            value.__add__(other.data[idx])
        );
        return new Tensor(resultData, this.shape);
    }

    __mul__(other: Tensor): Tensor {
        if (this.shape[1] !== other.shape[0]) {
            throw new Error(
                "Cannot multiply a " +
                    this.shapeString() +
                    " tensor to a " +
                    other.shapeString() +
                    " tensor"
            );
        }

        const resultShape: [number, number] = [this.shape[0], this.shape[1]];
        const resultData: Array<Value> = [];

        for (let i = 0; i < resultShape[0]; i++) {
            for (let j = 0; j < resultShape[1]; j++) {
                let sum = new Value(0, "0", [], "new");
                for (let k = 0; k < this.shape[1]; k++) {
                    sum = sum.__add__(
                        this.data[i * this.shape[1] + k].__mul__(
                            other.data[k * other.shape[1] + j]
                        )
                    );
                }
                resultData.push(sum);
            }
        }

        return new Tensor(resultData, resultShape);
    }

    transpose(): Tensor {
        const resultShape: [number, number] = [this.shape[1], this.shape[0]];
        const resultData: Array<Value> = [];

        for (let i = 0; i < this.shape[1]; i++) {
            for (let j = 0; j < this.shape[0]; j++) {
                resultData.push(this.data[j * this.shape[1] + i]);
            }
        }

        return new Tensor(resultData, resultShape);
    }

    tanh(): Tensor {
        const resultData = this.data.map((value) => value.tanh());
        return new Tensor(resultData, this.shape);
    }

    relu(): Tensor {
        const resultData = this.data.map((value) => value.relu());
        return new Tensor(resultData, this.shape);
    }

    __neg__(): Tensor {
        const resultData = this.data.map((value) => value.__neg__());
        return new Tensor(resultData, this.shape);
    }

    __sub__(other: Tensor) {
        return this.__add__(other.__neg__());
    }

    toString(): string {
        return `Tensor(data=${this.data},shape=${this.shape})`;
    }

    shapeString(): string {
        return `[${this.shape[0]},${this.shape[1]}]`;
    }
}
