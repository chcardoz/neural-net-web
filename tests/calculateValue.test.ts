import { calculateValue } from "@/lib/calculateValue";
import { Value } from "@/lib/Value";

describe("calculateValue with unsupported operation", () => {
	it("should throw an error when the operation is not supported", () => {
		const valueLeft = new Value("valueLeft", 5, null, "");
		const valueRight = new Value("valueRight", 10, null, "");
		const op = "%";
		const assgn = "a";

		expect(() => calculateValue(valueLeft, valueRight, op, assgn)).toThrowError(
			"Unsupported operation: %"
		);
	});
});

describe("calculateValue with Numbers", () => {
	it("should return the sum of two values when the operation is '+'", () => {
		const valueLeft = new Value("valueLeft", 5, null, "");
		const valueRight = new Value("valueRight", 10, null, "");
		const op = "+";
		const assgn = "c";

		const result = calculateValue(valueLeft, valueRight, op, assgn);

		expect(result).toEqual(new Value("c", 15, [valueLeft, valueRight], "+"));
	});

	it("should return the difference of two values when the operation is '-'", () => {
		const valueLeft = new Value("valueLeft", 10, null, "");
		const valueRight = new Value("valueRight", 5, null, "");
		const op = "-";
		const assgn = "d";

		const result = calculateValue(valueLeft, valueRight, op, assgn);

		expect(result).toEqual(new Value("d", 5, [valueLeft, valueRight], "-"));
	});

	it("should return the product of two values when the operation is '*'", () => {
		const valueLeft = new Value("valueLeft", 5, null, "");
		const valueRight = new Value("valueRight", 10, null, "");
		const op = "*";
		const assgn = "e";

		const result = calculateValue(valueLeft, valueRight, op, assgn);

		expect(result).toEqual(new Value("e", 50, [valueLeft, valueRight], "*"));
	});

	it("should return the quotient of two values when the operation is '/'", () => {
		const valueLeft = new Value("valueLeft", 10, null, "");
		const valueRight = new Value("valueRight", 2, null, "");
		const op = "/";
		const assgn = "f";

		const result = calculateValue(valueLeft, valueRight, op, assgn);

		expect(result).toEqual(new Value("f", 5, [valueLeft, valueRight], "/"));
	});
});
