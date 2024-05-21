/**
 * Represents a value.
 */
export class Value {
	/**
	 * The name of the value.
	 * @type {string | null}
	 */
	name: string | null;

	/**
	 * The numeric value.
	 * @type {number | null}
	 */
	value: number | null;

	/**
	 * The children values.
	 * @type {Array<Value> | null}
	 */
	children: Array<Value> | null;

	/**
	 * The operation associated with the value.
	 * @type {string}
	 */
	op: string | null;

	/**
	 * Constructs a new Value object.
	 * @param {string | null} name - The name of the value.
	 * @param {number} value - The numeric value.
	 * @param {Array<Value>} children - The children values.
	 * @param {string} op - The operation associated with the value.
	 */
	constructor(
		name: string | null,
		value: number | null,
		children: Array<Value> | null,
		op: string | null
	) {
		this.name = name;
		this.value = value;
		this.children = children;
		this.op = op;
	}
}
