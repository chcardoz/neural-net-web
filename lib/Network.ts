import { Value } from "./Value";
class Neuron {
    /**
     * Array of Value objects representing the weights associated with inputs to the neuron.
     * @type {Value[]}
     */
    w: Value[];

    /**
     * Value object representing the bias of the neuron.
     * @type {Value}
     */
    b: Value;

    /**
     * Constructor for Neuron class.
     * @param {number} nin - Number of input connections to the neuron.
     */
    constructor(nin: number) {
        /**
         * Array of Value objects representing the weights associated with inputs to the neuron.
         * @type {Value[]}
         */
        this.w = Array.from(
            { length: nin },
            () => new Value("", "", Math.random() * 2 - 1, [], "")
        );

        /**
         * Value object representing the bias of the neuron.
         * @type {Value}
         */
        this.b = new Value("", "", Math.random() * 2 - 1, [], "");
    }

    /**
     * Performs forward propagation through the neuron.
     * Computes the weighted sum of inputs plus bias, and applies tanh activation.
     * @param {Value[]} x - Array of input values.
     * @returns {Value} - Output value after tanh activation.
     */
    forward(x: Value[]): Value {
        let act = this.b;
        for (let i = 0; i < this.w.length; i++) {
            act = act.add(this.w[i].multiply(x[i]));
        }
        return act.tanh();
    }

    /**
     * Retrieves all parameters (weights w and bias b) of the neuron.
     * @returns {Value[]} - Array of Value objects representing parameters.
     */
    parameters(): Value[] {
        return [...this.w, this.b];
    }
}

class Layer {
    /**
     * Array of Neuron objects representing neurons in the layer.
     * @type {Neuron[]}
     */
    neurons: Neuron[];

    /**
     * Constructor for Layer class.
     * @param {number} nin - Number of input connections to each neuron in the layer.
     * @param {number} nout - Number of neurons in the layer.
     */
    constructor(nin: number, nout: number) {
        /**
         * Array of Neuron objects representing neurons in the layer.
         * @type {Neuron[]}
         */
        this.neurons = Array.from({ length: nout }, () => new Neuron(nin));
    }

    /**
     * Performs forward propagation through the layer.
     * Computes outputs from each neuron in the layer given input values.
     * @param {Value[]} x - Array of input values.
     * @returns {Value | Value[]} - Output value(s) after forward propagation.
     */
    forward(x: Value[]): Value | Value[] {
        const outs = this.neurons.map((neuron) => neuron.forward(x));
        return outs.length === 1 ? outs[0] : outs;
    }

    /**
     * Retrieves all parameters (weights and biases) of neurons in the layer.
     * @returns {Value[]} - Array of Value objects representing parameters of all neurons.
     */
    parameters(): Value[] {
        return this.neurons.flatMap((neuron) => neuron.parameters());
    }
}

/**
 * Represents a neural network composed of multiple layers.
 */
export default class Network {
    /**
     * Array of Layer objects representing layers in the network.
     * @type {Layer[]}
     */
    layers: Layer[];

    /**
     * Constructor for Network class.
     * @param {number} nin - Number of input neurons for the first layer.
     * @param {number[]} nouts - Array of numbers representing number of neurons in each subsequent layer.
     */
    constructor(nin: number, nouts: number[]) {
        /**
         * Array of Layer objects representing layers in the network.
         * @type {Layer[]}
         */
        const sizes = [nin, ...nouts];
        this.layers = sizes
            .slice(0, -1)
            .map((size, i) => new Layer(size, sizes[i + 1]));
    }

    /**
     * Performs forward propagation through the entire network.
     * @param {Value[]} x - Array of input values.
     * @returns {Value | Value[]} - Output value(s) after forward propagation.
     */
    forward(x: Value[]): Value | Value[] {
        for (const layer of this.layers) {
            x = layer.forward(x) as Value[];
        }
        return x;
    }

    /**
     * Retrieves all parameters (weights and biases) of the network.
     * @returns {Value[]} - Array of Value objects representing parameters of all neurons in the network.
     */
    parameters(): Value[] {
        return this.layers.flatMap((layer) => layer.parameters());
    }
}
