let acorn = require("acorn");
import { useState } from "react";
import {
  AssignmentExpression,
  ExpressionStatement,
  BinaryExpression,
  Node,
  Literal,
  Identifier,
} from "acorn";
import { Value } from "@/lib/Value";
import { calculateValue } from "@/lib/calculateValue";

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
  let _finalValue: Value;
  let _declaredIdentifiers: Value[] = [];

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
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
        _declaredIdentifiers.push(
          new Value(leftNode.name, Number(rightNode.value), null, "=")
        );
      }
    }
  };

  const binaryRecurse = (node: BinaryExpression, assgn: string): Value => {
    let value: Value;
    if (node.left && node.right) {
      const valLeft = binaryRecurse(
        node.left as BinaryExpression,
        "intermediate"
      );
      const valRight = binaryRecurse(
        node.right as BinaryExpression,
        "intermediate"
      );
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

    return value;
  };

  const analyzeCode = (code: string) => {
    try {
      const parsed = acorn.parse(code, { ecmaVersion: 2020 });
      parsed.body.forEach((node: Node) => traverse(node));
      setParseResult(parsed);
    } catch (e: any) {
      console.log("Invalid JavaScript code: ", e.message);
      setParseResult(null);
    }
  };

  return {
    message,
    handleMessageChange,
    parseResult,
    declaredIdentifiers,
    finalValue,
  };
};

export default useASTAnalyzer;
// FIXME handle rewriting identifier names.
// TODO : graphing mess
