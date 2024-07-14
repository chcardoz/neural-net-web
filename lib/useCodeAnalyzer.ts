import { useState } from "react";
import { Value } from "./NewValue";
import {
    ArrayExpression,
    BinaryExpression,
    ExpressionStatement,
    Identifier,
    Literal,
    ModuleDeclaration,
    Parser,
    Statement,
} from "acorn";
import {
    isArrayExpression,
    isBinaryExpression,
    isExpressionStatement,
    isIdentifier,
    isLiteral,
} from "./utilities";
import Module from "module";
import { Tensor } from "./Tensor";

type CodeAnalyzerReturnType = {
    code: string;
    parseResult: (Statement | ModuleDeclaration)[];
    handleCodeChange: (e: any) => void;
    variableCreationHistory: Value[];
    variableNameMap: { [key: string]: Value };
    tensorCreationHistory: Tensor[];
    tensorNameMap: { [key: string]: Tensor };
};

const useCodeAnalyzer = (): CodeAnalyzerReturnType => {
    const [code, setCode] = useState<string>("");
    const [parseResult, setParseResult] = useState<
        (Statement | ModuleDeclaration)[]
    >([]);
    const [variableNameMap, setvariableNameMap] = useState<{
        [key: string]: Value;
    }>({});
    const [variableCreationHistory, setvariableCreationHistory] = useState<
        Value[]
    >([]);
    const [tensorCreationHistory, setTensorCreationHistory] = useState<
        Tensor[]
    >([]);
    const [tensorNameMap, setTensorNameMap] = useState<{
        [key: string]: Tensor;
    }>({});

    const handleCodeChange = (e: any) => {
        setCode(e.target.value);
        try {
            let _variableCreationHistory: Value[] = [];
            let _variableNameMap: { [key: string]: Value } = {};
            let _tensorCreationHistory: Tensor[] = [];
            let _tensorNameMap: { [key: string]: Tensor } = {};
            const parsed = Parser.parse(code, {
                ecmaVersion: 2020,
                sourceType: "module",
            });
            setParseResult(parsed.body);
            parsed.body.forEach((node: any) => {
                traverse_with_recursion(
                    node,
                    _variableCreationHistory,
                    _variableNameMap,
                    _tensorCreationHistory,
                    _tensorNameMap
                );
            });

            setvariableCreationHistory(_variableCreationHistory);
            setvariableNameMap(_variableNameMap);
        } catch (e: any) {
            console.log("Invalid JavaScript code: ", e);
            return;
        }
    };

    const traverse_with_recursion = (
        node: any,
        variableCreationHistory: Value[],
        variableNameMap: { [key: string]: Value },
        tensorCreationHistory: Tensor[],
        tensorNameMap: { [key: string]: Tensor }
    ): Value => {
        let value = new Value(0, "", [], "new");
        if (isExpressionStatement(node)) {
            let exprNode = node as ExpressionStatement;
            value = traverse_with_recursion(
                exprNode.expression,
                variableCreationHistory,
                variableNameMap,
                tensorCreationHistory,
                tensorNameMap
            );
        } else if (isLiteral(node)) {
            let literalNode = node as Literal;
            value = new Value(
                Number(literalNode.value),
                String(literalNode.value),
                [],
                "new"
            );
        } else if (isIdentifier(node)) {
            let identifierNode = node as Identifier;
            // check if identifier has been defined before
            if (variableNameMap[identifierNode.name]) {
                value = variableNameMap[identifierNode.name];
            } else {
                value = new Value(0, identifierNode.name, [], "new");
                variableNameMap[identifierNode.name] = value;
                variableCreationHistory.push(value);
            }
        } else if (isBinaryExpression(node)) {
            let binaryNode = node as BinaryExpression;
            let leftVal = traverse_with_recursion(
                binaryNode.left,
                variableCreationHistory,
                variableNameMap,
                tensorCreationHistory,
                tensorNameMap
            );
            let rightVal = traverse_with_recursion(
                binaryNode.right,
                variableCreationHistory,
                variableNameMap,
                tensorCreationHistory,
                tensorNameMap
            );
            try {
                leftVal = leftVal.__eval__(rightVal, binaryNode.operator);
                variableCreationHistory.push(leftVal);
                variableNameMap[leftVal.name] = leftVal;
                return leftVal;
            } catch (e: any) {
                console.log("Invalid JavaScript code: ", e);
                return new Value(0, "", [], "new");
            }
        } else if (isArrayExpression(node)) {
            let arrayNode = node as ArrayExpression;
            arrayNode.elements.forEach((element: any) => {
                traverse_with_recursion(
                    element,
                    variableCreationHistory,
                    variableNameMap,
                    tensorCreationHistory,
                    tensorNameMap
                );
            });
        }
        return value;
    };

    return {
        code,
        handleCodeChange,
        parseResult,
        variableCreationHistory,
        variableNameMap,
        tensorCreationHistory,
        tensorNameMap,
    };
};

export default useCodeAnalyzer;
