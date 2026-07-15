const assert = require("node:assert");
const { test } = require("node:test");

const Parser = require("tree-sitter");

test("can load grammar", () => {
  const parser = new Parser();
  parser.setLanguage(require("."));
  const tree = parser.parse("message=§cHello :_input_key.jump:");
  assert.equal(tree.rootNode.hasError, false);
});
