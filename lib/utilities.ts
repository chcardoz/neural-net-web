import {
    BinaryExpression,
    ExpressionStatement,
    Identifier,
    Literal,
    Node,
} from "acorn";

export const isBinaryExpression = (node: Node): node is BinaryExpression => {
    return (
        (node as BinaryExpression).left !== undefined &&
        (node as BinaryExpression).right !== undefined
    );
};

export const isLiteral = (node: Node): node is Literal => {
    return (node as Literal).value !== undefined;
};

export const isIdentifier = (node: Node): node is Identifier => {
    return (node as Identifier).name !== undefined;
};

export const isExpressionStatement = (
    node: Node
): node is ExpressionStatement => {
    return (node as ExpressionStatement).expression !== undefined;
};
