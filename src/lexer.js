import { curry } from './util';

// Lexer-Generator
// 
// This is a simple function that allows us to generate a lexer
// for our little lisp. We feed it an array of object like
// 
// { type: TOKEN_NAME, regex: /regex/ }
// 
// the regular expression should be well-formed so as to just
// pick the relevant characters off of the beginning of the string
// being parsed.

export const lexer = curry(
