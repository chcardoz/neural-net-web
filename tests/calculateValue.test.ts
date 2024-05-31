import { calculateNameString, calculateValue } from "@/lib/calculateValue";
import { Value } from "@/lib/Value";

describe("calculateValue with unsupported operation", () => {
    it("should throw an error when the operation is not supported", () => {
        const valueLeft = new Value("123", "valueLeft", 5, null, "");
        const valueRight = new Value("456", "valueRight", 10, null, "");
        const op = "%";

        let thrownError;
        try {
            const result = calculateValue(valueLeft, valueRight, op);
        } catch (e) {
            thrownError = e;
        }

        expect((thrownError as Error).message).toBe("Unsupported operation: %");
    });
});

describe("calculateValue with Numbers", () => {
    it("should return the sum of two values when the operation is '+'", () => {
        const valueLeft = new Value("123", "valueLeft", 5, null, "");
        const valueRight = new Value("456", "valueRight", 10, null, "");
        const op = "+";

        const result = calculateValue(valueLeft, valueRight, op);
        expect(result).toEqual(15);
    });

    it("should return the difference of two values when the operation is '-'", () => {
        const valueLeft = new Value("123", "valueLeft", 5, null, "");
        const valueRight = new Value("456", "valueRight", 10, null, "");
        const op = "-";

        const result = calculateValue(valueLeft, valueRight, op);
        expect(result).toEqual(-5);
    });

    it("should return the product of two values when the operation is '*'", () => {
        const valueLeft = new Value("123", "valueLeft", 5, null, "");
        const valueRight = new Value("456", "valueRight", 10, null, "");
        const op = "*";

        const result = calculateValue(valueLeft, valueRight, op);
        expect(result).toEqual(50);
    });

    it("should return the quotient of two values when the operation is '/'", () => {
        const valueLeft = new Value("123", "valueLeft", 10, null, "");
        const valueRight = new Value("456", "valueRight", 2, null, "");
        const op = "/";

        const result = calculateValue(valueLeft, valueRight, op);
        expect(result).toEqual(5);
    });

    it("should return the quotient of two values when the operation is '='", () => {
        const valueLeft = new Value("123", "valueLeft", 1, null, "");
        const valueRight = new Value("456", "valueRight", 10, null, "");
        const op = "=";

        const result = calculateValue(valueLeft, valueRight, op);
        expect(result).toEqual(10);
    });
});

describe("calculateString with two Value objects", () => {
    it("should give the left value's name when operation is '='", () => {
        const valueLeft = new Value("123", "valueLeft", 1, null, "");
        const valueRight = new Value("456", "valueRight", 10, null, "");
        const op = "=";

        const result = calculateNameString(valueLeft, valueRight, op);
        expect(result).toEqual("valueLeft");
    });

    it("should give the concatenated string of when operation is '+'", () => {
        const valueLeft = new Value("123", "valueLeft", 1, null, "");
        const valueRight = new Value("456", "valueRight", 10, null, "");
        const op = "+";

        const result = calculateNameString(valueLeft, valueRight, op);
        expect(result).toEqual("valueLeft+valueRight");
    });
});
