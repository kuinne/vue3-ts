module.exports = {
  // extends: ["@commitlint/config-conventional"],
  // extends: ["cz"],
  // parserPreset: "conventional-changelog-conventionalcommits",
  rules: {
    "type-enum": [2, "always", ["--n", "--bug", "--story"]],
  },
};
