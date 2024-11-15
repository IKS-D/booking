import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

export const noAndOperatorForErrors = createRule({
  name: "no-and-operator-for-errors",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce the use of optional chaining instead of && for accessing error messages",
    },
    messages: {
      useOptionalChaining:
        "Use optional chaining (?.) instead of && for accessing error messages.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      LogicalExpression(node: TSESTree.LogicalExpression) {
        if (node.operator === "&&" && node.right.type === "TSAsExpression") {
          context.report({
            node,
            messageId: "useOptionalChaining",
          });
        }
      },
    };
  },
});

export default noAndOperatorForErrors;
