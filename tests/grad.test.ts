import { Value } from "../lib/Value";

// Testing the Value object assignment of grad parameter
test("Value object assigns grad parameter properly", () => {
    const grad = 0.5;
    const value = new Value("a", "Reeve", 1, null, "+", grad);

    expect(value.grad).toBe(grad);
});

// Testing the Value object assignment of _backward function
test("Value object assigns _backward function properly", () => {
    const value = new Value("a", "Reeve", 1, null, "+", 0);
    const mockBackwardFunction = jest.fn();
    value._backward = mockBackwardFunction;

    value._backward(); // Call the assigned function

    expect(value._backward).toBe(mockBackwardFunction);
    expect(mockBackwardFunction).toHaveBeenCalled();
});
