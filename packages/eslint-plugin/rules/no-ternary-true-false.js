import { ESLintUtils } from "@typescript-eslint/utils";
const createRule = ESLintUtils.RuleCreator((name) => `${name}`);
export const noTernary = createRule({
    name: "no ternary with true and false",
    meta: {
        type: "problem",
        messages: {
            default: "Avoid using ternary operators with true and false.",
        },
        docs: {
            description: "disallow ternary operators with true and false",
        },
        fixable: 'code',
        schema: [],
    },
    defaultOptions: [],
    create: function (context) {
        return {
            ConditionalExpression(node) {
                if ((node.consequent.type === "Literal" &&
                    node.consequent.value === true &&
                    node.alternate.type === "Literal" &&
                    node.alternate.value === false) ||
                    (node.consequent.type === "Literal" &&
                        node.consequent.value === false &&
                        node.alternate.type === "Literal" &&
                        node.alternate.value === true)) {
                    context.report({
                        node,
                        messageId: "default",
                        data: { callee: node },
                        fix(fixer) {
                            return fixer.replaceText(node, "!!" + context.sourceCode.getText(node.test));
                        },
                    });
                }
            },
        };
    },
});
