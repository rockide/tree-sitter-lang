/**
 * @file Tree-sitter grammar for Minecraft Bedrock Edition .lang files.
 * @author respectZ <renixiel@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lang",

  // Whitespace is significant in .lang files: newlines terminate entries and a
  // tab introduces an inline translator comment.
  extras: ($) => [],

  rules: {
    source_file: ($) =>
      seq(
        repeat(choice($._newline, seq(choice($.entry, $.comment), $._newline))),
        optional(choice($.entry, $.comment)),
      ),

    entry: ($) =>
      seq(
        field("key", $.key),
        field("assignment", $.assignment),
        optional(field("value", $.value)),
        optional(field("comment", $.inline_comment)),
      ),

    comment: ($) => token(seq("##", /[^\r\n]*/)),

    key: ($) => token(/[^=\t\r\n]+/),

    assignment: ($) => "=",

    value: ($) =>
      repeat1(
        choice(
          $.text,
          $.linebreak,
          $.format_code,
          $.format_specifier,
          $.input_key,
          $.symbol,
        ),
      ),

    text: ($) =>
      token(
        choice(
          // A space before ## keeps the markers and the remainder visible.
          /[^§%~:#\t\r\n]* +##[^\r\n]*/,
          /[^§%~:#\t\r\n]+/,
          /[§%~:#]/,
        ),
      ),

    linebreak: ($) => token("~LINEBREAK~"),

    format_code: ($) => token(seq("§", /[0-9a-gk-orA-GK-OR]/)),

    format_specifier: ($) =>
      token(
        choice(
          "%%",
          /%[sdf]/,
          /%[0-9]+\$[sdf]/,
          /%\.[0-9]+f/,
          /%[0-9]+\$\.[0-9]+f/,
        ),
      ),

    input_key: ($) => token(/:_input_key\.[A-Za-z0-9_.-]+:/),

    symbol: ($) => token(/:[A-Za-z_][A-Za-z0-9_.-]*:/),

    // An inline comment begins with adjacent ## or with a tab followed by ##.
    // A regular space before ## intentionally remains part of the value.
    inline_comment: ($) =>
      token(choice(seq("\t", "##", /[^\r\n]*/), seq("##", /[^\r\n]*/))),

    _newline: ($) => /\r?\n/,
  },
});
