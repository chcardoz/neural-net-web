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
import { Value } from "../lib/Value";

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
const useASTAnalyzer = (prop: any) => {
	// State variables
	const [message, setMessage] = useState<string>("");
	const [parseResult, setParseResult] = useState<Node | null>(null);
	const [identifierMap, setIdentifierMap] = useState<IdentifierMap>(
		new Set<Value>()
	);

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

				/**
				 * Recursively evaluates a binary expression tree and returns the computed value.
				 *
				 * @param node - The current node in the binary expression tree.
				 * @param assgn - The assignment string, if applicable.
				 * @returns The computed value of the binary expression.
				 *
				 * The function traverses the binary expression tree recursively. For each node, it evaluates the left
				 * and right children nodes (if they exist), and applies the binary operator using the helper function `f`.
				 * If the node is a literal or identifier, it creates a new `Value` object with the corresponding value.
				 *
				 * @throws Will throw an error if the node type is unsupported.
				 */
				function binaryRecurse(
					node: BinaryExpression,
					assgn: string | null
				): Value {
					let value: Value;

					if (node.left && node.right) {
						const valLeft = binaryRecurse(node.left, null);
						const valRight = binaryRecurse(node.right, null);

						if (assgn != null)
							value = f(valLeft, valRight, node.operator, assgn);
						else value = f(valLeft, valRight, node.operator, null);
					} else {
						if (node.type === "Literal") {
							const literalNode = node as Literal;
							value = new Value(null, literalNode.value, null, null);
						} else if (node.type === "Identifier") {
							const identifierNode = node as Identifier;
							value = new Value(identifierNode.name, null, null, null);
						} else {
							throw new Error(`Unsupported node type: ${node.type}`);
						}
					}

					addValue(value);
					return value;
				}

				/**
				 * Processes an assignment expression and evaluates it if it is a binary expression.
				 * If the right side of the assignment is a binary expression, it calls `binaryRecurse`
				 * to evaluate the expression. If the assignment is a simple identifier to literal assignment,
				 * it directly creates and adds a `Value` object.
				 *
				 * @param assignmentExpr - The assignment expression to be processed.
				 */
				if (assignmentExpr.right.type === "BinaryExpression") {
					const binaryExpr = assignmentExpr.right as BinaryExpression;
					binaryRecurse(binaryExpr, assignmentExpr.left.name);
				} else {
					if (
						assignmentExpr.left.type === "Identifier" &&
						assignmentExpr.right.type === "Literal"
					) {
						const leftNode = assignmentExpr.left as Identifier;
						const rightNode = assignmentExpr.right as Literal;
						addValue(new Value(leftNode.name, rightNode.raw, null, "="));
					}
				}

				console.log(identifierMap);
				prop(identifierMap);

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

// Recursion done
