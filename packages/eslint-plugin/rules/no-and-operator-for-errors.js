import { ESLintUtils } from "@typescript-eslint/utils";
const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`);
export const noAndOperatorForErrors = createRule({
    name: "no-and-operator-for-errors",
    meta: {
        type: "problem",
        docs: {
            description: "Enforce the use of optional chaining instead of && for accessing error messages",
        },
        messages: {
            useOptionalChaining: "Use optional chaining (?.) instead of && for accessing error messages.",
        },
        fixable: 'code',
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            LogicalExpression(node) {
                if (node.operator === "&&" &&
                    node.left.type === "MemberExpression" &&
                    node.right.type === "TSAsExpression" &&
                    node.right.expression.type === "MemberExpression" &&
                    node.right.expression.object.type === "MemberExpression" &&
                    node.left.object.type === "Identifier" &&
                    node.left.property.type === "Identifier" &&
                    node.right.expression.object.object.type === "Identifier" &&
                    node.right.expression.object.property.type === "Identifier" &&
                    node.left.object.name === node.right.expression.object.object.name &&
                    node.left.property.name === node.right.expression.object.property.name) {
                    const leftExpressionText = context.sourceCode.getText(node.left);
                    const rightPropertyText = context.sourceCode.getText(node.right.expression.property);
                    context.report({
                        node,
                        messageId: "useOptionalChaining",
                        fix(fixer) {
                            return fixer.replaceText(node, leftExpressionText + "?." + rightPropertyText);
                        },
                    });
                }
            },
        };
    },
});
export default noAndOperatorForErrors;
