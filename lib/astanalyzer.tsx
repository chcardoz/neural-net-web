let acorn = require("acorn");
import { useState, useEffect } from "react";
import {
	AssignmentExpression,
	Expression,
	ExpressionStatement,
	Node
} from "acorn";

type IdentifierMap = Map<string, any>;
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
	const [identifierMap, setIdentifierMap] = useState<IdentifierMap>(new Map());

	// Function to handle message changes
	const handleMessageChange = (e: any) => {
		setMessage(e.target.value);
		analyzeCode(e.target.value);
	};

	// Function to analyze JavaScript code and update states accordingly
	const analyzeCode = (code: string) => {
		try {
			const parsed = acorn.parse(code, { ecmaVersion: 2020 });
			const identifiers: IdentifierMap = new Map();

			// Traverse the parsed AST
			const traverse = (node: any) => {
				const exprNode = node as ExpressionStatement;
				if (exprNode.expression == null) return;
				const assignmentExpr = exprNode.expression as AssignmentExpression;
				if (assignmentExpr.type != "AssignmentExpression") return;
				console.log("Assignment Expression achieved!!");
			};

			// Evaluate expressions within the AST
			const evaluateExpression = (expr: Expression) => {
				if (expr.type == "Literal") {
					return expr.value;
				} else if (expr.type == "Identifier") {
					return identifiers.get(expr.name as string);
				}
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
			setIdentifierMap(new Map());
		}
	};

	// Log identifierMap changes for debugging (using useEffect)
	useEffect(() => {
		console.log(identifierMap);
	}, [identifierMap]);

	// Return state variables and handler functions
	return { message, handleMessageChange, parseResult, identifierMap };
};

export default useASTAnalyzer;
