import { Value } from "./Value";

class Neuron {
    w: Value[];
    b: Value;

    constructor(nin: number) {
        this.w = Array.from(
            { length: nin },
            () => new Value("", "", Math.random() * 2 - 1, [], "")
        );
        this.b = new Value("", "", Math.random() * 2 - 1, [], "");
    }

    forward(x: Value[]): Value {
        let act = this.b;
        for (let i = 0; i < this.w.length; i++) {
            act = act.add(this.w[i].multiply(x[i]));
        }
        return act.tanh();
    }

    parameters(): Value[] {
        return [...this.w, this.b];
    }
}

class Layer {
    neurons: Neuron[];

    constructor(nin: number, nout: number) {
        this.neurons = Array.from({ length: nout }, () => new Neuron(nin));
    }

    forward(x: Value[]): Value | Value[] {
        const outs = this.neurons.map((neuron) => neuron.forward(x));
        return outs.length === 1 ? outs[0] : outs;
    }

    parameters(): Value[] {
        return this.neurons.flatMap((neuron) => neuron.parameters());
    }
}

class MLP {
    layers: Layer[];

    constructor(nin: number, nouts: number[]) {
        const sizes = [nin, ...nouts];
        this.layers = sizes
            .slice(0, -1)
            .map((size, i) => new Layer(size, sizes[i + 1]));
    }

    forward(x: Value[]): Value | Value[] {
        for (const layer of this.layers) {
            x = layer.forward(x) as Value[];
        }
        return x;
    }

    parameters(): Value[] {
        return this.layers.flatMap((layer) => layer.parameters());
    }
}
