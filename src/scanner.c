#include "tree_sitter/array.h"
#include "tree_sitter/parser.h"

enum TokenType
{
  TEXT,
  LINEBREAK,
  FORMAT_CODE,
  INPUT_KEY,
  FORMAT_SPECIFIER,
};

// TODO: Emoji

static inline bool match_literal(TSLexer *lexer, const char *pattern)
{
  const char *p = pattern;
  while (*p != '\0')
  {
    if (lexer->lookahead != *p)
    {
      return false;
    }
    lexer->advance(lexer, false);
    p++;
  }
  return true;
}

static inline is_eof(TSLexer *lexer)
{
  return lexer->eof(lexer) || lexer->lookahead == '\0' || lexer->lookahead == '\r' || lexer->lookahead == '\n' || lexer->lookahead == '\t';
}

static inline match_linebreak(TSLexer *lexer)
{
  if (match_literal(lexer, "~LINEBREAK~"))
  {
    return true;
  }
  return false;
}

static inline match_format_code(TSLexer *lexer)
{
  if (lexer->lookahead == 0xA7) // '§' character
  {
    lexer->advance(lexer, false);
    if (!is_eof(lexer))
    {
      lexer->advance(lexer, false);
      return true;
    }
  }
  return false;
}

static inline match_format_specifier(TSLexer *lexer)
{
  if (lexer->lookahead == '%')
  {
    lexer->advance(lexer, false);
    // %s or %d or %f
    if (lexer->lookahead == 's' || lexer->lookahead == 'd' || lexer->lookahead == 'f')
    {
      lexer->advance(lexer, false);
      return true;
    }
    // %{number}${s|d|f}
    if (lexer->lookahead >= '0' && lexer->lookahead <= '9')
    {
      while (lexer->lookahead >= '0' && lexer->lookahead <= '9')
      {
        lexer->advance(lexer, false);
      }
      if (lexer->lookahead == '$')
      {
        lexer->advance(lexer, false);
        if (lexer->lookahead == 's' || lexer->lookahead == 'd' || lexer->lookahead == 'f')
        {
          lexer->advance(lexer, false);
          return true;
        }
      }
    }
    // %.{number}f
    if (lexer->lookahead == '.')
    {
      lexer->advance(lexer, false);
      if (lexer->lookahead >= '0' && lexer->lookahead <= '9')
      {
        while (lexer->lookahead >= '0' && lexer->lookahead <= '9')
        {
          lexer->advance(lexer, false);
        }
        if (lexer->lookahead == 'f')
        {
          lexer->advance(lexer, false);
          return true;
        }
      }
    }
  }
  return false;
}

static inline match_input_key(TSLexer *lexer)
{
  if (match_literal(lexer, ":_input_"))
  {
    while (true)
    {
      if (is_eof(lexer) || lexer->lookahead == ':')
      {
        break;
      }
      lexer->advance(lexer, false);
    }
    if (lexer->lookahead == ':')
    {
      lexer->advance(lexer, false);
      return true;
    }
  }
  return false;
}

bool tree_sitter_lang_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols)
{
  if (is_eof(lexer))
  {
    return false;
  }

  if (valid_symbols[LINEBREAK] && match_linebreak(lexer))
  {
    lexer->result_symbol = LINEBREAK;
    return true;
  }

  if (valid_symbols[FORMAT_CODE] && match_format_code(lexer))
  {
    lexer->result_symbol = FORMAT_CODE;
    return true;
  }

  if (valid_symbols[FORMAT_SPECIFIER] && match_format_specifier(lexer))
  {
    lexer->result_symbol = FORMAT_SPECIFIER;
    return true;
  }

  if (valid_symbols[INPUT_KEY] && match_input_key(lexer))
  {
    lexer->result_symbol = INPUT_KEY;
    return true;
  }

  if (valid_symbols[TEXT])
  {
    if (is_eof(lexer))
    {
      lexer->result_symbol = TEXT;
      return true;
    }
    while (true)
    {
      // FIXME: optimize false positive
      // example: "test=f~false positive"
      if (lexer->lookahead == '~' || lexer->lookahead == 0xA7 || lexer->lookahead == ':' || lexer->lookahead == '%')
      {
        break;
      }
      lexer->advance(lexer, false);
      if (is_eof(lexer))
      {
        break;
      }
    }
    lexer->result_symbol = TEXT;
    return true;
  }
  return false;
}

void tree_sitter_lang_external_scanner_destroy(void *payload)
{
}

unsigned tree_sitter_lang_external_scanner_serialize(void *payload, char *buffer)
{
  return 0;
}

void tree_sitter_lang_external_scanner_deserialize(const char *buffer, unsigned length)
{
}

void *tree_sitter_lang_external_scanner_create()
{
}