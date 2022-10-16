import calls from "./apps/calls.js";

/**
 * Repeats some text a given number of times.
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const callsEntry = (req, res) => {
  const result = calls.handleRequest(req.body);
  res.status(200).json(result);
};

/**
 * Repeats some text a given number of times.
 *
 * @param {import('express').Request} req - The text to repeat
 * @param {import('express').Response} res - Number of times
 */
export const tgBotWebHook = (req, res) => {
  const book = req.body;

  // Output the book to the console for debugging
  console.log(book);

  res.send("Book is added to the database");
};
