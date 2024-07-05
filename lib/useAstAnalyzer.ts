let acorn = require("acorn");
import { useState } from "react";
import {
    ExpressionStatement,
    BinaryExpression,
    Node,
    Literal,
    Identifier,
} from "acorn";
import { Value } from "@/lib/Value";
import { calculateNameString, calculateValue } from "@/lib/calculateValue";
import { v4 as uuidv4 } from "uuid";
import {
    isBinaryExpression,
    isExpressionStatement,
    isIdentifier,
    isLiteral,
} from "./utilities";

type ASTAnalyzerReturnType = {
    message: string;
    handleMessageChange: (e: any) => void;
    parseResult: Node | null;
    identifierMap: { [key: string]: Value };
    finalValue: Value | undefined;
};

const useASTAnalyzer = (): ASTAnalyzerReturnType => {
    const [message, setMessage] = useState<string>("");
    const [parseResult, setParseResult] = useState<Node | null>(null);
    const [identifierMap, setIdentifierMap] = useState<{
        [key: string]: Value;
    }>({});
    const [finalValue, setFinalValue] = useState<Value>();

    const handleMessageChange = (e: any) => {
        setMessage(e.target.value);
        analyzeCode(e.target.value);
    };

    const traverse_with_recursion = (
        node: Node,
        idMap: { [key: string]: Value }
    ): Value => {
        let value = new Value(uuidv4(), "", 1, null, "");
        if (isExpressionStatement(node)) {
            let exprNode = node as ExpressionStatement;
            value = traverse_with_recursion(exprNode.expression, idMap);
        } else if (isBinaryExpression(node)) {
            let binaryNode = node as BinaryExpression;
            let isEqualsOperator = String(binaryNode.operator) === "=";
            let leftVal = traverse_with_recursion(binaryNode.left, idMap);
            let rightVal = traverse_with_recursion(binaryNode.right, idMap);
            let idString = uuidv4();

            value = new Value(
                idString,
                isEqualsOperator
                    ? (binaryNode.left as Identifier).name
                    : calculateNameString(
                          leftVal,
                          rightVal,
                          binaryNode.operator
                      ),
                calculateValue(leftVal, rightVal, binaryNode.operator),
                isEqualsOperator ? [rightVal] : [leftVal, rightVal],
                binaryNode.operator
            );
            if (isEqualsOperator) idMap[value.name] = value;
        } else if (isLiteral(node)) {
            let literalNode = node as Literal;
            value = new Value(
                uuidv4(),
                String(literalNode.raw),
                Number(literalNode.value),
                null,
                ""
            );
        } else if (isIdentifier(node)) {
            let identifierNode = node as Identifier;
            if (idMap[identifierNode.name]) {
                value = idMap[identifierNode.name];
            }
        }
        return value;
    };

    const analyzeCode = (code: string) => {
        try {
            const parsed = acorn.parse(code, { ecmaVersion: 2020 });
            const newIdentifierMap: { [key: string]: Value } = {};
            let finalVal: Value | undefined;

            parsed.body.forEach((node: Node) => {
                finalVal = traverse_with_recursion(node, newIdentifierMap);
            });

            setParseResult(parsed);
            setIdentifierMap(newIdentifierMap);
            setFinalValue(finalVal);
        } catch (e: any) {
            console.log("Invalid JavaScript code: ", e);
            setParseResult(null);
            setIdentifierMap({});
            setFinalValue(undefined);
        }
    };

    return {
        message,
        handleMessageChange,
        parseResult,
        identifierMap,
        finalValue,
    };
};

export default useASTAnalyzer;
