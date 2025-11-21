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
    $.emoji,
  ],
  rules: {
    source_file: ($) => repeat(seq($._line, terminator)),

    _line: ($) =>
      seq(
        // Any leading whitespace is ignored.
        // `   key=value` will be parsed as `key=value`.
        optional(/\s+/),
        choice(
          $.comment,
          seq(
            field("key", $.key),
            field("assignment", $.assignment),
            optional(field("value", $.value)),
            optional($.inline_comment)
          )
        )
      ),

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
    comment: ($) => /#{2,}.*/,
    // Anything after a tab character is considered an inline comment.
    // `\t###` is a misconception.
    inline_comment: ($) => /\t.*/,
  },
});
