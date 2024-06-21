import Network from "../lib/Network";
import { Value } from "../lib/Value";
import compareValuesDeep from "./CompareValue";

describe("MLP", () => {
    it("should forward propagate input through the network", () => {
        // Create a new MLP with 2 input neurons and 2 output neurons
        const mlp = new Network(2, [1]);

        // Set the weights and biases manually for simplicity
        mlp.layers[0].neurons[0].w = [
            new Value("1", "w0_0", 0.5, null, ""),
            new Value("2", "w0_1", 0.8, null, ""),
        ];
        mlp.layers[0].neurons[0].b = new Value("3", "b0", 0.2, null, "");

        // Input values
        const x = [
            new Value("10", "x0", 0.1, null, ""),
            new Value("11", "x1", 0.9, null, ""),
        ];

        // Expected output value (not wrapped in an array)
        const expectedOutput = new Value(
            "3110211",
            "tanh(b0 + w0_0 * x0 + w0_1 * x1)",
            0.7487042869693088,
            [
                new Value(
                    "3110211",
                    "b0 + w0_0 * x0 + w0_1 * x1",
                    0.9700000000000001,
                    [
                        new Value(
                            "3110",
                            "b0 + w0_0 * x0",
                            0.25,
                            [
                                new Value("3", "b0", 0.2, null, ""),
                                new Value(
                                    "110",
                                    "w0_0 * x0",
                                    0.05,
                                    [
                                        new Value("1", "w0_0", 0.5, null, ""),
                                        new Value("10", "x0", 0.1, null, ""),
                                    ],
                                    "*"
                                ),
                            ],
                            "+"
                        ),
                        new Value(
                            "211",
                            "w0_1 * x1",
                            0.72,
                            [
                                new Value("2", "w0_1", 0.8, null, ""),
                                new Value("11", "x1", 0.9, null, ""),
                            ],
                            "*"
                        ),
                    ],
                    "+"
                ),
            ],
            "tanh"
        );

        // Forward propagate the input through the network
        const output = mlp.forward(x);

        expect(compareValuesDeep(output as Value, expectedOutput, 1e-10)).toBe(
            true
        );
    });

    it("should return the correct number of parameters", () => {
        // Create a new MLP with 3 input neurons and 2 output neurons
        const mlp = new Network(3, [2]);

        // Check the number of parameters
        expect(mlp.parameters().length).toEqual(8);
    });
});
