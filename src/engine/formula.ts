/**
 * A safe, sandboxed arithmetic expression evaluator for user-entered custom formulas.
 * Deliberately does NOT use eval() or the Function() constructor. Supports +, -, *, /, ^,
 * parentheses, unary minus, decimal numbers, and a fixed set of named variables
 * (e.g. CGPA) supplied by the caller. Anything else is rejected with a clear error.
 */

export class FormulaError extends Error {}

type TokenType = 'number' | 'identifier' | 'op' | 'lparen' | 'rparen' | 'eof'
interface Token {
  type: TokenType
  value: string
}

const OPERATORS = new Set(['+', '-', '*', '/', '^'])

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < input.length) {
    const ch = input[i]
    if (/\s/.test(ch)) {
      i++
      continue
    }
    if (/[0-9.]/.test(ch)) {
      let j = i
      let sawDot = false
      while (j < input.length && (/[0-9]/.test(input[j]) || (input[j] === '.' && !sawDot))) {
        if (input[j] === '.') sawDot = true
        j++
      }
      const numStr = input.slice(i, j)
      if (!/^\d*\.?\d+$/.test(numStr)) {
        throw new FormulaError(`Invalid number "${numStr}" in formula.`)
      }
      tokens.push({ type: 'number', value: numStr })
      i = j
      continue
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i
      while (j < input.length && /[A-Za-z0-9_]/.test(input[j])) j++
      tokens.push({ type: 'identifier', value: input.slice(i, j).toUpperCase() })
      i = j
      continue
    }
    if (OPERATORS.has(ch)) {
      tokens.push({ type: 'op', value: ch })
      i++
      continue
    }
    if (ch === '(') {
      tokens.push({ type: 'lparen', value: ch })
      i++
      continue
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ch })
      i++
      continue
    }
    if (ch === '×') {
      tokens.push({ type: 'op', value: '*' })
      i++
      continue
    }
    if (ch === '÷') {
      tokens.push({ type: 'op', value: '/' })
      i++
      continue
    }
    throw new FormulaError(`Unsupported character "${ch}" in formula.`)
  }
  tokens.push({ type: 'eof', value: '' })
  return tokens
}

/** Recursive-descent parser: expr -> term (('+'|'-') term)* ; term -> factor (('*'|'/') factor)* ; factor -> power ; power -> unary ('^' unary)* */
class Parser {
  private pos = 0
  constructor(
    private tokens: Token[],
    private variables: Record<string, number>,
    private allowedNames: Set<string>,
  ) {}

  private peek(): Token {
    return this.tokens[this.pos]
  }
  private consume(): Token {
    return this.tokens[this.pos++]
  }

  parse(): number {
    const value = this.parseExpression()
    if (this.peek().type !== 'eof') {
      throw new FormulaError(`Unexpected token "${this.peek().value}" in formula.`)
    }
    return value
  }

  private parseExpression(): number {
    let value = this.parseTerm()
    while (this.peek().type === 'op' && (this.peek().value === '+' || this.peek().value === '-')) {
      const op = this.consume().value
      const rhs = this.parseTerm()
      value = op === '+' ? value + rhs : value - rhs
    }
    return value
  }

  private parseTerm(): number {
    let value = this.parsePower()
    while (this.peek().type === 'op' && (this.peek().value === '*' || this.peek().value === '/')) {
      const op = this.consume().value
      const rhs = this.parsePower()
      if (op === '/') {
        if (rhs === 0) throw new FormulaError('Division by zero in formula.')
        value = value / rhs
      } else {
        value = value * rhs
      }
    }
    return value
  }

  private parsePower(): number {
    const base = this.parseUnary()
    if (this.peek().type === 'op' && this.peek().value === '^') {
      this.consume()
      const exponent = this.parsePower()
      return Math.pow(base, exponent)
    }
    return base
  }

  private parseUnary(): number {
    if (this.peek().type === 'op' && this.peek().value === '-') {
      this.consume()
      return -this.parseUnary()
    }
    if (this.peek().type === 'op' && this.peek().value === '+') {
      this.consume()
      return this.parseUnary()
    }
    return this.parseAtom()
  }

  private parseAtom(): number {
    const token = this.peek()
    if (token.type === 'number') {
      this.consume()
      return Number(token.value)
    }
    if (token.type === 'identifier') {
      this.consume()
      if (!this.allowedNames.has(token.value)) {
        throw new FormulaError(`Unknown variable "${token.value}" in formula. Allowed: ${[...this.allowedNames].join(', ')}.`)
      }
      const value = this.variables[token.value]
      if (value === undefined || Number.isNaN(value)) {
        throw new FormulaError(`Missing value for variable "${token.value}".`)
      }
      return value
    }
    if (token.type === 'lparen') {
      this.consume()
      const value = this.parseExpression()
      if (this.peek().type !== 'rparen') throw new FormulaError('Missing closing parenthesis in formula.')
      this.consume()
      return value
    }
    throw new FormulaError(`Unexpected token "${token.value}" in formula.`)
  }
}

const MAX_FORMULA_LENGTH = 200

/**
 * Safely evaluates a user-supplied arithmetic formula string against a fixed variable set.
 * Throws FormulaError with a student-facing message on any invalid input.
 */
export function evaluateFormula(expression: string, variables: Record<string, number>): number {
  if (expression.length === 0) throw new FormulaError('Please enter a formula.')
  if (expression.length > MAX_FORMULA_LENGTH) throw new FormulaError('Formula is too long.')
  const allowedNames = new Set(Object.keys(variables).map((k) => k.toUpperCase()))
  const tokens = tokenize(expression)
  const parser = new Parser(tokens, variables, allowedNames)
  const result = parser.parse()
  if (!Number.isFinite(result)) throw new FormulaError('This formula produced an invalid (non-finite) result.')
  return result
}
