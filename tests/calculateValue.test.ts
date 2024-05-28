import { calculateValue } from "@/lib/calculateValue";
import { Value } from "@/lib/Value";

describe("calculateValue", () => {
	it("should return the sum of two values when the operation is '+'", () => {
		const valueLeft = new Value("valueLeft", 5, null, "");
		const valueRight = new Value("valueRight", 10, null, "");
		const op = "+";
		const assgn = "c";

		const result = calculateValue(valueLeft, valueRight, op, assgn);

		expect(result).toEqual(new Value("c", 15, [valueLeft, valueRight], "+"));
	});

	// it("should return the difference of two values when the operation is '-'", () => {
	//     const valueLeft: Value = { number: 10 };
	//     const valueRight: Value = { number: 5 };
	//     const op = "-";
	//     const assgn = "=";

	//     const result = calculateValue(valueLeft, valueRight, op, assgn);

	//     expect(result).toEqual({ number: 5 });
	// });

	// it("should return the product of two values when the operation is '*'", () => {
	//     const valueLeft: Value = { number: 5 };
	//     const valueRight: Value = { number: 10 };
	//     const op = "*";
	//     const assgn = "=";

	//     const result = calculateValue(valueLeft, valueRight, op, assgn);

	//     expect(result).toEqual({ number: 50 });
	// });

	// it("should return the quotient of two values when the operation is '/'", () => {
	//     const valueLeft: Value = { number: 10 };
	//     const valueRight: Value = { number: 2 };
	//     const op = "/";
	//     const assgn = "=";

	//     const result = calculateValue(valueLeft, valueRight, op, assgn);

	//     expect(result).toEqual({ number: 5 });
	// });

	// it("should return the remainder of two values when the operation is '%'", () => {
	//     const valueLeft: Value = { number: 10 };
	//     const valueRight: Value = { number: 3 };
	//     const op = "%";
	//     const assgn = "=";

	//     const result = calculateValue(valueLeft, valueRight, op, assgn);

	//     expect(result).toEqual({ number: 1 });
	// });
});
