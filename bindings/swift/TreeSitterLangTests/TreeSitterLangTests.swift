import XCTest
import SwiftTreeSitter
import TreeSitterLang

final class TreeSitterLangTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lang())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Lang grammar")
    }
}
