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

// Testing the Value object's grad property after an operation
test("Value object updates grad correctly after operation", () => {
    // Setup initial Value objects
    const value1 = new Value("a", "Reeve", 1, null, "+", 0);
    const value2 = new Value("b", "Reeve", 2, null, "+", 0);

    // Add and mutiply the two Value objects
    const add_result = value1.add(value2);

    // Call backwards
    add_result.backward();

    // Expected grad values
    const expectedGradValue1 = 1; // Replace with the expected value
    const expectedGradValue2 = 1; // Replace with the expected value

    // Check if the grad property of value1 and value2 is updated correctly
    // The expected values here are hypothetical and should be replaced with the correct expected values based on your operation
    expect(value1.grad).toBe(expectedGradValue1); // Replace expectedGradValue1 with the actual expected value
    expect(value2.grad).toBe(expectedGradValue2); // Replace expectedGradValue2 with the actual expected value
});

// Testing the Value object's grad property after a multiplication operation
test("Value object updates grad correctly after multiplication", () => {
    // Setup initial Value objects
    const value1 = new Value("a", "Reeve", 1, null, "*", 0);
    const value2 = new Value("b", "Reeve", 2, null, "*", 0);

    // Multiply the two Value objects
    const multiply_result = value1.multiply(value2);

    // Call backward to propagate gradients
    multiply_result.backward();

    // Expected grad values after multiplication
    // These values depend on the implementation of the backward method for multiplication
    // Assuming the derivative of the multiplication with respect to each variable is the value of the other variable
    const expectedGradValue1 = value2.value; // Replace with the expected value based on your implementation
    const expectedGradValue2 = value1.value; // Replace with the expected value based on your implementation

    // Check if the grad property of value1 and value2 is updated correctly
    expect(value1.grad).toBe(expectedGradValue1); // Replace expectedGradValue1 with the actual expected value
    expect(value2.grad).toBe(expectedGradValue2); // Replace expectedGradValue2 with the actual expected value
});

// Testing the Value object's grad property after a mixed operation of addition and multiplication
test("Value object updates grad correctly after mixed operations of addition and multiplication", () => {
    // Setup initial Value objects
    const value1 = new Value("a", "Reeve", 1, null, "", 0);
    const value2 = new Value("b", "Reeve", 2, null, "", 0);
    const value3 = new Value("c", "Reeve", 3, null, "", 0);

    // Perform mixed operations: (value1 + value2) * value3
    const add_result = value1.add(value2); // value1 + value2
    const mixed_result = add_result.multiply(value3); // (value1 + value2) * value3

    // Call backward to propagate gradients
    mixed_result.backward();

    // Expected grad values after mixed operations
    // Assuming the derivative of the addition is 1 for each variable,
    // and the derivative of the multiplication with respect to each variable in the product is the value of the other variable
    const expectedGradValue1 = value3.value; // derivative of (value1 + value2) * value3 w.r.t value1 is value3
    const expectedGradValue2 = value3.value; // derivative of (value1 + value2) * value3 w.r.t value2 is value3
    const expectedGradValue3 = value1.value + value2.value; // derivative of (value1 + value2) * value3 w.r.t value3 is (value1 + value2)

    // Check if the grad property of value1, value2, and value3 is updated correctly
    expect(value1.grad).toBe(expectedGradValue1);
    expect(value2.grad).toBe(expectedGradValue2);
    expect(value3.grad).toBe(expectedGradValue3);
});

// Testing the Value object's grad property after applying the tanh function
test("Value object updates grad correctly after applying tanh function", () => {
    // Setup initial Value object
    const value = new Value("x", "Reeve", 1, null, "", 0);

    // Apply tanh function to the value
    const tanh_result = value.tanh();

    // Call backward to propagate gradients
    tanh_result.backward();

    // Expected grad value after applying tanh
    // The derivative of tanh(x) w.r.t x is 1 - tanh(x)^2
    const expectedGradValue = 1 - Math.pow(Math.tanh(value.value), 2);

    // Check if the grad property of value is updated correctly
    expect(value.grad).toBe(expectedGradValue);
});

// Testing the Value object's grad property after a complex operation involving tanh
test("Value object updates grad correctly after a complex operation involving tanh", () => {
    // Setup initial Value objects
    const value1 = new Value("a", "Reeve", 1, null, "", 0);
    const value2 = new Value("b", "Reeve", 2, null, "", 0);
    const value3 = new Value("c", "Reeve", 3, null, "", 0);

    // Perform complex operation: tanh((value1 + value2) * value3)
    const add_result = value1.add(value2); // value1 + value2
    const multiply_result = add_result.multiply(value3); // (value1 + value2) * value3
    const tanh_result = multiply_result.tanh(); // tanh((value1 + value2) * value3)

    // Call backward to propagate gradients
    tanh_result.backward();

    // Expected grad values after the complex operation
    // The derivative of tanh(x) w.r.t x is 1 - tanh(x)^2
    // Chain rule applied for gradients through the complex operation
    const derivativeOfTanh = 1 - Math.pow(Math.tanh(multiply_result.value), 2);
    const expectedGradValue1 = value3.value * derivativeOfTanh; // Chain rule applied
    const expectedGradValue2 = value3.value * derivativeOfTanh; // Chain rule applied
    const expectedGradValue3 = (value1.value + value2.value) * derivativeOfTanh; // Chain rule applied

    // Check if the grad property of value1, value2, and value3 is updated correctly
    expect(value1.grad).toBe(expectedGradValue1);
    expect(value2.grad).toBe(expectedGradValue2);
    expect(value3.grad).toBe(expectedGradValue3);
});

// Testing the Value object's grad property after multiple layers of operations
test("Value object updates grad correctly after multiple layers of operations", () => {
    // Setup initial Value objects
    const value1 = new Value("a", "Reeve", 1, null, "", 0);
    const value2 = new Value("b", "Reeve", 2, null, "", 0);
    const value3 = new Value("c", "Reeve", 3, null, "", 0);
    const value4 = new Value("d", "Reeve", 4, null, "", 0);

    // Perform multiple layers of operations
    // Layer 1: Addition
    const add_result1 = value1.add(value2); // value1 + value2
    // Layer 2: Multiplication
    const multiply_result1 = add_result1.multiply(value3); // (value1 + value2) * value3
    // Layer 3: Tanh
    const tanh_result1 = multiply_result1.tanh(); // tanh((value1 + value2) * value3)
    // Layer 4: Addition with another value
    const add_result2 = tanh_result1.add(value4); // tanh((value1 + value2) * value3) + value4

    // Call backward to propagate gradients
    add_result2.backward();

    // Expected grad values after multiple layers of operations
    // Applying the chain rule through each layer
    const derivativeOfTanh = 1 - Math.pow(Math.tanh(multiply_result1.value), 2);
    const expectedGradValue1 = value3.value * derivativeOfTanh; // Chain rule through tanh and multiplication
    const expectedGradValue2 = value3.value * derivativeOfTanh; // Chain rule through tanh and multiplication
    const expectedGradValue3 = (value1.value + value2.value) * derivativeOfTanh; // Chain rule through tanh
    const expectedGradValue4 = 1; // Gradient of addition with respect to value4 is 1

    // Check if the grad property of value1, value2, value3, and value4 is updated correctly
    expect(value1.grad).toBe(expectedGradValue1);
    expect(value2.grad).toBe(expectedGradValue2);
    expect(value3.grad).toBe(expectedGradValue3);
    expect(value4.grad).toBe(expectedGradValue4);
});

// Testing the Value object's grad property after six layers of operations
test("Value object updates grad correctly after six layers of operations", () => {
    // Setup initial Value objects
    const value1 = new Value("a", "Reeve", 1, null, "", 0);
    const value2 = new Value("b", "Reeve", 2, null, "", 0);
    const value3 = new Value("c", "Reeve", 3, null, "", 0);
    const value4 = new Value("d", "Reeve", 4, null, "", 0);
    const value5 = new Value("e", "Reeve", 5, null, "", 0);
    const value6 = new Value("f", "Reeve", 6, null, "", 0);

    // Perform six layers of operations
    // Layer 1: Addition
    const add_result1 = value1.add(value2); // value1 + value2
    // Layer 2: Multiplication
    const multiply_result1 = add_result1.multiply(value3); // (value1 + value2) * value3
    // Layer 3: Tanh
    const tanh_result1 = multiply_result1.tanh(); // tanh((value1 + value2) * value3)
    // Layer 4: Addition with another value
    const add_result2 = tanh_result1.add(value4); // tanh((value1 + value2) * value3) + value4
    // Layer 5: Multiplication with another value
    const multiply_result2 = add_result2.multiply(value5); // (tanh((value1 + value2) * value3) + value4) * value5
    // Layer 6: Subtraction with another value
    const final_result = multiply_result2.subtract(value6); // (tanh((value1 + value2) * value3) + value4) * value5 - value6

    // Call backward to propagate gradients
    final_result.backward();

    // Expected grad values after six layers of operations
    // Applying the chain rule through each layer
    const derivativeOfTanh = 1 - Math.pow(Math.tanh(multiply_result1.value), 2);
    const expectedGradValue1 = value3.value * derivativeOfTanh * value5.value; // Chain rule through all operations
    const expectedGradValue2 = value3.value * derivativeOfTanh * value5.value; // Chain rule through all operations
    const expectedGradValue3 =
        (value1.value + value2.value) * derivativeOfTanh * value5.value; // Chain rule through all operations
    const expectedGradValue4 = value5.value; // Gradient of addition with respect to value4 is value5
    const expectedGradValue5 = add_result2.value; // Gradient of multiplication with respect to value5 is (tanh((value1 + value2) * value3) + value4)
    const expectedGradValue6 = -1; // Gradient of subtraction with respect to value6 is -1

    // Check if the grad property of value1, value2, value3, value4, value5, and value6 is updated correctly
    expect(value1.grad).toBe(expectedGradValue1);
    expect(value2.grad).toBe(expectedGradValue2);
    expect(value3.grad).toBe(expectedGradValue3);
    expect(value4.grad).toBe(expectedGradValue4);
    expect(value5.grad).toBe(expectedGradValue5);
    expect(value6.grad).toBe(expectedGradValue6);
});
