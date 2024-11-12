import { explicitGenerics } from "./rules/explicit-generics-rule.js";

const plugin = {
  rules: {
    "explicit-generics": explicitGenerics,
  },
};

export default plugin;
