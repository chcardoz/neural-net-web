import { Value } from "@/lib/Value";

export function calculateValue(
	valueLeft: Value,
	valueRight: Value,
	op: string,
	assgn: string
): Value {
	if (op === "+") {
		return new Value(
			assgn,
			valueLeft.value + valueRight.value,
			[valueLeft, valueRight],
			"+"
		);
	} else if (op === "-") {
		return new Value(
			assgn,
			valueLeft.value - valueRight.value,
			[valueLeft, valueRight],
			"-"
		);
	} else if (op === "*") {
		return new Value(
			assgn,
			valueLeft.value * valueRight.value,
			[valueLeft, valueRight],
			"*"
		);
	} else if (op === "/") {
		return new Value(
			assgn,
			valueLeft.value / valueRight.value,
			[valueLeft, valueRight],
			"/"
		);
	} else {
		throw new Error(`Unsupported operation: ${op}`);
	}
}
