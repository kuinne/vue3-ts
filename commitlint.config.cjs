module.exports = {
  // extends: ["@commitlint/config-conventional"],
  // extends: ["cz"],
  rules: {
    "type-empty": [2, "never"],
    "type-enum": [2, "always", ["n", "bug", "story"]],
  },
};
