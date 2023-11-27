import * as crypto from 'crypto';

const operators = ['+', '-', '*', '/'];

function generateEvenlyDivisibleNumbers() {
  let num1_dividable: number, num2_dividable: number;

  do {
    num1_dividable = crypto.randomInt(51);
    num2_dividable = crypto.randomInt(11);
  } while (num1_dividable % num2_dividable !== 0);

  return { num1_dividable, num2_dividable };
}

function generateRandomMathProblem() {
  const num1 = crypto.randomInt(10);
  const num2 = crypto.randomInt(10);

  const operator = operators[crypto.randomInt(4)];

  let answer: number;

  if (operator === '-') {
    const [smaller, larger] = [num1, num2].sort((a, b) => a - b);
    answer = larger - smaller;

    return {
      math_problem: `${larger} ${operator} ${smaller}`,
      answer: answer,
    };
  } else if (operator === '/') {
    if (num2 === 0) {
      return generateRandomMathProblem();
    }

    const { num1_dividable, num2_dividable } = generateEvenlyDivisibleNumbers();
    answer = num1_dividable / num2_dividable;

    return {
      math_problem: `${num1_dividable} ${operator} ${num2_dividable}`,
      answer: answer,
    };
  } else if (operator === '+') {
    answer = num1 + num2;
  } else if (operator === '*') {
    answer = num1 * num2;
  }

  return {
    math_problem: `${num1} ${operator} ${num2}`,
    answer: answer,
  };
}

export { generateRandomMathProblem };
