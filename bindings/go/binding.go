package tree_sitter_lang

// #cgo CFLAGS: -std=c11 -fPIC
// #include "../../src/parser.c"
// #if __has_include("../../src/scanner.c")
// #include "../../src/scanner.c"
// #endif
import "C"

import "unsafe"

// Get the tree-sitter Language for this grammar.
func Language() unsafe.Pointer {
	return unsafe.Pointer(C.tree_sitter_lang())
}

const (
	NodeKindSourceFile      string = "source_file"
	NodeKindEntry           string = "entry"
	NodeKindKey             string = "key"
	NodeKindAssignment      string = "assignment"
	NodeKindValue           string = "value"
	NodeKindText            string = "text"
	NodeKindLineBreak       string = "linebreak"
	NodeKindInputKey        string = "input_key"
	NodeKindFormatCode      string = "format_code" // §
	NodeKindFormatSpecifier string = "format_specifier"
)
