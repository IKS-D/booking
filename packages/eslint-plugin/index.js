import { explicitGenerics } from "./rules/explicit-generics-rule.js";
import noAndOperatorForErrors from "./rules/no-and-operator-for-errors.js";
import { noTernary } from "./rules/no-ternary-true-false.js";
const plugin = {
    rules: {
        "explicit-generics": explicitGenerics,
        "no-ternary-true-false": noTernary,
        "no-and-operator-for-errors": noAndOperatorForErrors,
    },
};
export default plugin;
