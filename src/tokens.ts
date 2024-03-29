// This module defines the tokens in our lisp dialect
//
// We have two kinds of tokens, value-holding tokens and
// non-value holding tokens. A value-holding token is
// something like a number or a string. In that case we
//

/**
 * Enum holding strings for the possible token variants
 */
export enum TokenVariant {
  // PUNCTUATION
  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",
  LEFT_BRACKET = "LEFT_BRACKET",
  RIGHT_BRACKET = "RIGHT_BRACKET",
  COMMA = "COMMA",

  // VALUES
  NUM_LITERAL = "NUM_LITERAL",
  STRING_LITERAL = "STRING_LITERAL",
  IDENTIFIER = "IDENTIFIER",

  // OPERATORS
  ADD = "ADD",
  DIVIDE = "DIVIDE",
}

abstract class AbstractToken {
  /**
   * String enum to discriminate between the variants in our union type.
   */
  static variant: TokenVariant

  /**
   * Does this token hold a value or not?
   *
   * A token like a parantheses or a bracket holds no value, it is
   * merely there or not. But a number literal can have many values!
   */
  abstract get hasValue(): boolean

  /**
   * The regular expression for matching string literals for this token.
   */
  static regex: RegExp

  /**
   * Get the TokenVariant assigned to this token!
   *
   * This pulls the variant off of the constructor.
   */
  get variant(): TokenVariant {
    // typescript doesn't like this, but I'm pretty convinced it's ok :)
    // @ts-ignore
    return this.constructor.variant
  }
}

/**
 * Abstract class representing a token which holds no particular value
 * (e.g. parentheses or other punctuation).
 */
abstract class NonValueToken extends AbstractToken {
  get hasValue() {
    return false
  }
}

/**
 * Abstract class representing a token which wraps up a definite value,
 * for instance a number or a string literal.
 */
abstract class ValueToken<T> extends AbstractToken {
  constructor(match: string) {
    super()
    this.value = this.parseValue(match)
  }

  get hasValue() {
    return true
  }

  /**
   * For tokens that hold a value, we have to parse that value our
   * of the match somehow!
   */
  abstract parseValue(match: string): T

  value: T
}

// PUNCTUATION TOKENS
export class LeftParen extends NonValueToken {
  static variant = TokenVariant.LEFT_PAREN
  static regex = /^\(/
}

export class RightParen extends NonValueToken {
  static variant = TokenVariant.RIGHT_PAREN
  static regex = /^\)/
}

export class LeftBracket extends NonValueToken {
  static variant = TokenVariant.LEFT_BRACKET
  static regex = /^\[/
}

export class RightBracket extends NonValueToken {
  static variant = TokenVariant.RIGHT_BRACKET
  static regex = /^\]/
}

export class Comma extends NonValueToken {
  static variant = TokenVariant.COMMA
  static regex = /^\,/
}

// VALUE-HOLDING TOKENS
// ====================
// our tokens which can take on a particular value

/**
 * NumLiteral is going to be interpreted as a JavaScript Number,
 * so it can be a float or an integer (messy!)
 */
export class NumLiteral extends ValueToken<number> {
  static variant = TokenVariant.NUM_LITERAL

  parseValue(match: string) {
    return parseInt(match)
  }

  static regex = /^\d+/
}

export class StringLiteral extends ValueToken<string> {
  static variant = TokenVariant.STRING_LITERAL

  parseValue(match: string) {
    return match.replace(/^"/, "").replace(/"$/, "")
  }

  static regex = /^".*"/
}

export class Identifier extends ValueToken<string> {
  static variant = TokenVariant.IDENTIFIER

  parseValue(match: string) {
    return match
  }

  static regex = /^[A-Za-z]+/
}

// OPERATORS
export class AdditionOperator extends NonValueToken {
  static variant = TokenVariant.ADD
  static regex = /^\+/
}

export class DivisionOperator extends NonValueToken {
  static variant = TokenVariant.DIVIDE
  static regex = /^\//
}

export type Token =
  | LeftParen
  | RightParen
  | LeftBracket
  | RightBracket
  | Comma
  | NumLiteral
  | StringLiteral
  | Identifier
  | AdditionOperator
  | DivisionOperator

/**
 * A list of all the tokens that our lisp dialect supports
 */
export const TOKEN_MANIFEST = [
  LeftParen,
  RightParen,
  LeftBracket,
  RightBracket,
  Comma,
  NumLiteral,
  StringLiteral,
  Identifier,
  AdditionOperator,
  DivisionOperator,
]
