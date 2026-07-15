from unittest import TestCase

from tree_sitter import Language, Parser
import tree_sitter_lang


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            parser = Parser(Language(tree_sitter_lang.language()))
            tree = parser.parse(b"message=Hello %1$s")
            self.assertFalse(tree.root_node.has_error)
        except Exception:
            self.fail("Error loading Lang grammar")

    def test_queries_are_packaged(self):
        self.assertIn("(key)", tree_sitter_lang.HIGHLIGHTS_QUERY)
        self.assertIn("@item", tree_sitter_lang.OUTLINE_QUERY)
        self.assertIn("@function.around", tree_sitter_lang.TEXTOBJECTS_QUERY)
