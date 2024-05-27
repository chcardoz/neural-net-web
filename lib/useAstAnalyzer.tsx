let acorn = require("acorn");
import { useState } from "react";
import {
	AssignmentExpression,
	ExpressionStatement,
	BinaryExpression,
	Node,
	Literal,
	Identifier
} from "acorn";
import { Value } from "@/lib/Value";
import { calculateValue } from "@/lib/calculateValue";
import { v4 as uuidv4 } from "uuid";

type ASTAnalyzerReturnType = {
	message: string;
	handleMessageChange: (e: any) => void;
	parseResult: Node | null;
	declaredIdentifiers: Value[];
	finalValue: Value | undefined;
};

const useASTAnalyzer = (): ASTAnalyzerReturnType => {
	const [message, setMessage] = useState<string>("");
	const [parseResult, setParseResult] = useState<Node | null>(null);
	const [declaredIdentifiers, setDeclaredIdentifiers] = useState<Value[]>([]);
	const [finalValue, setFinalValue] = useState<Value>();
	let _finalValue: Value = new Value("", 0, null, "");
	let _declaredIdentifiers: Value[] = [];

	const handleMessageChange = (e: any) => {
		setMessage(e.target.value);
		console.log(
			"Declared Identifiers before calling Analyze:",
			_declaredIdentifiers
		);
		console.log("Final value before calling Analyze:", _finalValue);

		analyzeCode(e.target.value);
		setDeclaredIdentifiers(_declaredIdentifiers);
		setFinalValue(_finalValue);
	};

	const traverse = (node: any) => {
		const exprNode = node as ExpressionStatement;
		if (exprNode.expression == null) return;
		const assignmentExpr = exprNode.expression as AssignmentExpression;
		if (assignmentExpr.type != "AssignmentExpression") return;

		if (assignmentExpr.right.type === "BinaryExpression") {
			const binaryExpr = assignmentExpr.right as BinaryExpression;
			let leftNode = assignmentExpr.left as Identifier;
			_finalValue = binaryRecurse(binaryExpr, leftNode.name);
		} else {
			if (
				assignmentExpr.left.type === "Identifier" &&
				assignmentExpr.right.type === "Literal"
			) {
				const leftNode = assignmentExpr.left as Identifier;
				const rightNode = assignmentExpr.right as Literal;
				console.log(
					"Declared Identifiers when encountering a=1 or a=b:",
					_declaredIdentifiers
				);
				console.log("Final value at this time:", _finalValue);

				_declaredIdentifiers.push(
					new Value(leftNode.name, Number(rightNode.value), null, "=")
				);

				console.log(
					"Declared Identifiers after pushing a=1 or a=b:",
					_declaredIdentifiers
				);
				console.log("Final value at this time:", _finalValue);
			}
		}
	};

	const binaryRecurse = (node: BinaryExpression, assgn: string): Value => {
		let value: Value;
		if (node.left && node.right) {
			const valLeft = binaryRecurse(node.left as BinaryExpression, uuidv4());
			const valRight = binaryRecurse(node.right as BinaryExpression, uuidv4());
			value = calculateValue(valLeft, valRight, node.operator, assgn);
		} else {
			let newNode = node as Node;
			if (newNode.type === "Literal") {
				const literalNode = newNode as Literal;
				value = new Value(
					String(literalNode.raw),
					Number(literalNode.value),
					null,
					""
				);
			} else if (newNode.type === "Identifier") {
				const identifierNode = newNode as Identifier;
				console.log(
					"Declared Identifiers when a new identifier node has been found:",
					_declaredIdentifiers
				);
				console.log("Final value at this time:", _finalValue);

				const found = _declaredIdentifiers.find(
					(identifier) => identifier.name == identifierNode.name
				);
				if (found != undefined) value = found;
				else
					throw new Error(
						`Cannot have undefined identifiers, please define ${identifierNode.name} before using it`
					);
			} else {
				throw new Error(`Unsupported node type: ${node.type}`);
			}
		}

		console.log(
			"Declared Identifiers when binary recursion has finished:",
			_declaredIdentifiers
		);
		console.log("Final value at this time:", _finalValue);
		console.log("Value:", value);
		return value;
	};

	const analyzeCode = (code: string) => {
		try {
			const parsed = acorn.parse(code, { ecmaVersion: 2020 });
			parsed.body.forEach((node: Node) => traverse(node));
			setParseResult(parsed);
		} catch (e: any) {
			console.log("Invalid JavaScript code: ", e);
			setParseResult(null);
		}
	};

	return {
		message,
		handleMessageChange,
		parseResult,
		declaredIdentifiers,
		finalValue
	};
};

export default useASTAnalyzer;
// FIXME : Check if all node are being added to the list of declared identifiers
// FIXME : Account for rewriting values
// TODO : Hashmap implementation for declared identifiers (or better data structure: Heaps? More into optimzation.)
