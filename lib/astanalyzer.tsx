let acorn = require("acorn");
import { useState, useEffect } from "react";
import {
	AssignmentExpression,
	Expression,
	ExpressionStatement,
	BinaryExpression,
	Node,
	Literal,
	Identifier
} from "acorn";

/**
 * Represents a value.
 */
class Value {
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

type IdentifierMap = Set<Value>;
type ASTAnalyzerReturnType = {
	message: string;
	handleMessageChange: (e: any) => void;
	parseResult: Node | null;
	identifierMap: IdentifierMap;
};

/**
 * useASTAnalyzer is a custom React hook used for analyzing Abstract Syntax Trees (AST) of JavaScript code.
 * This hook manages state for a message input, AST parse result, and identifier mappings.
 *
 * @returns {ASTAnalyzerReturnType}
 *
 * @param {void}
 *
 * @description This hook initializes state variables for message, AST parse result, and identifier mapping.
 * - `message`: Represents the input message of JavaScript code.
 * - `handleMessageChange`: A function to handle changes in the input message, triggering code analysis.
 * - `parseResult`: Contains the parsed AST of the provided JavaScript code.
 * - `identifierMap`: A map containing identifiers and their values extracted from the code.
 */
const useASTAnalyzer = () => {
	// State variables
	const [message, setMessage] = useState<string>("");
	const [parseResult, setParseResult] = useState<Node | null>(null);
	const [identifierMap, setIdentifierMap] = useState<IdentifierMap>(
		new Set<Value>()
	);

	useEffect(() => {}, [message, parseResult, identifierMap]);

	// Function to handle message changes
	const handleMessageChange = (e: any) => {
		setMessage(e.target.value);
		analyzeCode(e.target.value);
	};

	// Function to handle adding a new Value type to the identifier set
	const addValue = (newValue: Value) => {
		for (let value of identifierMap) {
			if (value.name == newValue.name) return;
		}
		setIdentifierMap(new Set<Value>(identifierMap.add(newValue)));
	};

	function f(
		valueLeft: Value,
		valueRight: Value,
		op: string,
		assgn: string
	): Value {
		for (let value of identifierMap) {
			if (valueLeft.name != null && value.name == valueLeft.name) {
				valueLeft = value;
			}
			if (valueRight.name != null && value.name == valueRight.name) {
				valueRight = value;
			}
		}
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

	// Function to analyze JavaScript code and update states accordingly
	const analyzeCode = (code: string) => {
		try {
			const parsed = acorn.parse(code, { ecmaVersion: 2020 });
			const identifiers: IdentifierMap = new Set<Value>();

			// Traverse the parsed AST
			const traverse = (node: any) => {
				const exprNode = node as ExpressionStatement;
				if (exprNode.expression == null) return;
				const assignmentExpr = exprNode.expression as AssignmentExpression;
				if (assignmentExpr.type != "AssignmentExpression") return;
				console.log("Assignment Expression achieved!!");

				// const binaryRecurse = (node: BinaryExpression) => {
				// 	if (
				// 		(node.left.type == "Literal" || node.left.type == "Identifier") &&
				// 		(node.right.type == "Literal" || node.right.type == "Identifier")
				// 	) {
				// 		if (node.left.type == "Literal") {
				// 			const leftNode = node.left as Literal;
				// 			addValue(new Value(null, leftNode.raw, null, null));
				// 		}
				// 		if (node.left.type == "Identifier") {
				// 			const leftNode = node.left as Identifier;
				// 			addValue(new Value(node.left.name, null, null, null));
				// 		}
				// 		if (node.right.type == "Literal") {
				// 			const rightNode = node.right as Literal;
				// 			addValue(new Value(null, rightNode.raw, null, null));
				// 		}
				// 		if (node.right.type == "Identifier") {
				// 			const rightNode = node.right as Identifier;
				// 			addValue(new Value(rightNode.name, null, null, null));
				// 		}
				// 		console.log(identifierMap);
				// 		return;
				// 	}
				// 	if (node.left.type == "BinaryExpression") {
				// 		binaryRecurse(node.left);
				// 	}
				// };

				function binaryRecurse(
					node: BinaryExpression,
					assgn: string | null
				): Value {
					let value: Value;
					if (node.left && node.right) {
						const valLeft = binaryRecurse(node.left);
						const valRight = binaryRecurse(node.right);
						if (assgn != null)
							value = f(valLeft, valRight, node.operator, assgn);
						else value = f(valLeft, valRight, node.operator, null);
					} else {
						if (node.type == "Literal") {
							const literalNode = node as Literal;
							value = new Value(null, literalNode.value, null, null);
						} else if (node.type == "Identifier") {
							const identifierNode = node as Identifier;
							value = new Value(identifierNode.name, null, null, null);
						} else {
							throw new Error(`Unsupported node type: ${node.type}`);
						}
					}
					addValue(value);
					return value;
				}

				if (assignmentExpr.right.type == "BinaryExpression") {
					const binaryExpr = assignmentExpr.right as BinaryExpression;
					binaryRecurse(binaryExpr, assignmentExpr.left.name);
				} else {
					if (
						assignmentExpr.left.type == "Identifier" &&
						assignmentExpr.right.type == "Literal"
					) {
						const leftNode = assignmentExpr.left as Identifier;
						const rightNode = assignmentExpr.right as Literal;
						addValue(new Value(leftNode.name, rightNode.raw, null, "="));
					}
				}

				console.log(identifierMap);

				return null;
			};

			// Traverse through each node of the parsed AST
			parsed.body.forEach((node: Node) => traverse(node));

			// Update states with parse result and identifier map
			setParseResult(parsed);
			setIdentifierMap(identifiers);
		} catch (error) {
			console.error("Invalid JavaScript code: ", error);
			// Reset states on error
			setParseResult(null);
			setIdentifierMap(new Set<Value>());
		}
	};

	// Return state variables and handler functions
	return { message, handleMessageChange, parseResult, identifierMap };
};

export default useASTAnalyzer;
