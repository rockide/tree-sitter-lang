# tree-sitter-lang

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for
Minecraft Bedrock Edition `.lang` localization files.

## Supported syntax

```lang
## Organizational comment
pack.name=Example Pack
action.hint=Press :_input_key.jump: to jump	## Translator context
short.message=Visible text## Adjacent translator comment
literal.hashes=Visible text ## These hashes remain visible
message=§cWarning§r~LINEBREAK~Remaining: %1$d :heart:
```

The grammar recognizes entries, full-line comments, adjacent or tab-delimited
inline comments, formatting codes, printf-style substitutions, `~LINEBREAK~`,
input-key tokens, and named symbols. A regular space before `##` keeps the
markers as visible value text; a tab before `##` is discarded with the comment.
It accepts LF and CRLF input and a final line without a line ending.

Validation that depends on project context or a Minecraft version belongs in a
language server rather than the grammar. Examples include duplicate keys,
unknown input keys, source/translation placeholder mismatches, UTF-8 BOMs, and
the stricter CRLF/comment requirements of Microsoft's localization pipeline.

## Syntax tree

```text
(source_file
  (comment)
  (entry
    key: (key)
    assignment: (assignment)
    value: (value
      (text)
      (format_code)
      (format_specifier)
      (linebreak)
      (input_key)
      (symbol))
    comment: (inline_comment)))
```

## Development

```sh
npm install
npm run generate
npm test
npm run test:fixtures
npm run test:highlights
npm run test:wasm
```

Generated parser files under `src/` are committed so consumers can build the
grammar without Node.js.

## License

MIT
