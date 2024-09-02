import { useCallback, useState } from "react";
import { Value } from "./Value";
import {
    BinaryExpression,
    Identifier,
    Literal,
    ModuleDeclaration,
    Parser,
    Statement,
} from "acorn";
import { Tensor } from "./Tensor";

type CodeAnalyzerReturnType = {
    code: string;
    parseResult: (Statement | ModuleDeclaration)[];
    handleCodeChange: (e: string) => void;
    tensorNameMap: Map<string, Tensor>;
};

const useCodeAnalyzer = (): CodeAnalyzerReturnType => {
    const [code, setCode] = useState<string>("");
    const [parseResult, setParseResult] = useState<
        (Statement | ModuleDeclaration)[]
    >([]);
    const [tensorNameMap, setTensorNameMap] = useState<Map<string, Tensor>>(
        new Map()
    );

    const handleCodeChange = (code: string) => {
        console.log(code);
        setCode(code);

        try {
            const parsed = Parser.parse(code, {
                ecmaVersion: 2020,
                sourceType: "module",
            });
            setParseResult(parsed.body);

            const newTensorNameMap = new Map<string, Tensor>();
            let finalTensor: Tensor = new Tensor([], [0, 0]);
            parsed.body.forEach((node) => {
                finalTensor = processNode(node, newTensorNameMap);
            });
            newTensorNameMap.set("finalTensor", finalTensor);
            setTensorNameMap(newTensorNameMap);
        } catch (error) {
            console.error("Invalid JavaScript code:", error);
        }
    };

    const processNode = (node: any, tensorMap: Map<string, Tensor>): Tensor => {
        switch (node.type) {
            case "ExpressionStatement":
                return processNode(node.expression, tensorMap);
            case "Literal":
                return createTensorFromLiteral(node);
            case "Identifier":
                return getOrCreateTensorForIdentifier(node, tensorMap);
            case "BinaryExpression":
                return evaluateBinaryExpression(node, tensorMap);
            case "AssignmentExpression":
                return evaluateBinaryExpression(node, tensorMap);
            case "ArrayExpression":
                let values: Value[] = [];
                let shape: [number, number] = [node.elements.length, 0]; // Assume 2D array initially

                node.elements.forEach((element: any) => {
                    if (element.type === "ArrayExpression") {
                        let nestedValues: Value[] = [];
                        element.elements.forEach((nestedElement: any) => {
                            if (nestedElement.type === "Literal") {
                                nestedValues.push(
                                    new Value(
                                        nestedElement.value,
                                        nestedElement.value,
                                        [],
                                        "new"
                                    )
                                );
                            }
                        });
                        if (shape[1] === 0) {
                            shape[1] = nestedValues.length; // Set the second dimension
                        }
                        values.push(...nestedValues);
                    } else if (element.type === "Literal") {
                        values.push(
                            new Value(element.value, element.value, [], "new")
                        );
                        shape[1] = 1; // 1D array treated as 2D with second dimension as 1
                    }
                });
                return new Tensor(values, shape);
            default:
                return new Tensor([], [0, 0]); // Return a dummy tensor
        }
    };

    const createTensor = (value: number | string, name = ""): Tensor => {
        const data = new Value(Number(value), String(name || value), [], "new");
        return new Tensor([data], [1, 1]);
    };

    const createTensorFromLiteral = (literalNode: Literal): Tensor => {
        const value = literalNode.value;
        const normalizedValue =
            typeof value === "string" || typeof value === "number" ? value : 0; // Default to 0 for unsupported types

        return createTensor(normalizedValue);
    };

    const getOrCreateTensorForIdentifier = (
        identifierNode: Identifier,
        tensorMap: Map<string, Tensor>
    ): Tensor => {
        const name = identifierNode.name;
        if (!tensorMap.has(name)) {
            tensorMap.set(name, createTensor(0, name));
        }
        return tensorMap.get(name)!;
    };

    const evaluateBinaryExpression = (
        binaryNode: BinaryExpression,
        tensorMap: Map<string, Tensor>
    ): Tensor => {
        const leftVal = processNode(binaryNode.left, tensorMap);
        const rightVal = processNode(binaryNode.right, tensorMap);
        const outVal = leftVal.__eval__(rightVal, binaryNode.operator);
        if ((binaryNode.operator as string) === "=") {
            if (binaryNode.left.type === "Identifier") {
                tensorMap.set(binaryNode.left.name, outVal);
            }
        }
        return outVal;
    };

    return {
        code,
        handleCodeChange,
        parseResult,
        tensorNameMap,
    };
};

export default useCodeAnalyzer;
