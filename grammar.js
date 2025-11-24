/**
 * @file Tree sitter for Minecraft language.
 * @author respectZ <renixiel@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const newline = /\r?\n/;
const terminator = choice(newline, "\0");

module.exports = grammar({
  name: "lang",
  externals: ($) => [
    $.text,
    $.linebreak,
    $.format_code,
    $.input_key,
    $.format_specifier,
  ],
  rules: {
    source_file: ($) => repeat(seq($.entry, terminator)),

    entry: ($) =>
      seq(
        // Any leading whitespace is ignored.
        // `   key=value` will be parsed as `key=value`.
        optional(/\s+/),
        choice(
          $._comment,
          seq(
            field("key", $.key),
            field("assignment", $.assignment),
            optional(field("value", $.value)),
            optional($._inline_comment)
          )
        )
      ),
    _comment: ($) => /#{2,}.*/,

    key: ($) => token(/[^=\r\n]+/),
    assignment: ($) => token("="),
    value: ($) =>
      repeat1(
        choice(
          $.text,
          $.linebreak,
          $.format_code,
          $.input_key,
          $.format_specifier,
          /[^\t]/
        )
      ),
    // Anything after a tab character is ignored.
    _inline_comment: ($) => /\t.*/,
  },
});
