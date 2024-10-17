"use strict";

const input = document.querySelector(".input");
const result = document.querySelector(".result");
const deleteBtn = document.querySelector(".delete");
const keys = document.querySelectorAll(".bottom span");

let operation = "";
let answer;
let decimalAdded = false;

const operators = ["+", "-", "x", "÷"];

// Function to store data in localStorage
function saveToLocalStorage() {
  localStorage.setItem("operation", operation);
  localStorage.setItem("answer", answer || "");
}

// Function to load data from localStorage when page loads
function loadFromLocalStorage() {
  operation = localStorage.getItem("operation") || "";
  answer = localStorage.getItem("answer") || "";
  input.innerHTML = operation;
  result.innerHTML = answer;
}

function handleKeyPress(e) {
  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  if (key === "=") {
    return;
  }

  if (key === "." && decimalAdded) {
    return;
  }

  if (operators.indexOf(key) !== -1) {
    decimalAdded = false;
  }

  if (operation.length === 0 && key === "-") {
    operation += key;
    input.innerHTML = operation;
    saveToLocalStorage();
    return;
  }

  if (operation.length === 0 && operators.indexOf(key) !== -1) {
    input.innerHTML = operation;
    return;
  }

  if (operators.indexOf(lastChar) !== -1 && operators.indexOf(key) !== -1) {
    operation = operation.replace(/.$/, key);
    input.innerHTML = operation;
    saveToLocalStorage();
    return;
  }

  if (key) {
    if (key === ".") decimalAdded = true;
    operation += key;
    input.innerHTML = operation;
    saveToLocalStorage();
    return;
  }
}

function evaluate(e) {
  const key = e.target.dataset.key;
  const lastChar = operation[operation.length - 1];

  if (key === "=" && operators.indexOf(lastChar) !== -1) {
    operation = operation.slice(0, -1);
  }

  if (operation.length === 0) {
    answer = "";
    result.innerHTML = answer;
    saveToLocalStorage();
    return;
  }

  try {
    if (operation[0] === "0" && operation[1] !== "." && operation.length > 1) {
      operation = operation.slice(1);
    }

    const final = operation.replace(/x/g, "*").replace(/÷/g, "/");
    answer = +eval(final).toFixed(5);

    if (key === "=") {
      decimalAdded = false;
      operation = `${answer}`;
      answer = "";
      input.innerHTML = operation;
      result.innerHTML = answer;
      saveToLocalStorage();
      return;
    }

    result.innerHTML = answer;
    saveToLocalStorage();
  } catch (e) {
    if (key === "=") {
      decimalAdded = false;
      input.innerHTML = `<span class="error">${operation}</span>`;
      result.innerHTML = `<span class="error">Bad Expression</span>`;
    }
    console.log(e);
  }
}

function clearInput(e) {
  if (e.ctrlKey) {
    operation = "";
    answer = "";
    input.innerHTML = operation;
    result.innerHTML = answer;
    localStorage.clear(); // Clear the data from localStorage
    return;
  }

  operation = operation.slice(0, -1);
  input.innerHTML = operation;
  saveToLocalStorage();
}

deleteBtn.addEventListener("click", clearInput);
keys.forEach((key) => {
  key.addEventListener("click", handleKeyPress);
  key.addEventListener("click", evaluate);
});

// Clear button logic
document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.querySelector(".input");
  const resultField = document.querySelector(".result");
  const clearButton = document.querySelector(".clear");

  // Load data from localStorage when the page is loaded
  loadFromLocalStorage();

  clearButton.addEventListener("click", () => {
    operation = "";
    answer = "";
    inputField.textContent = "";
    resultField.textContent = "";
    localStorage.clear(); // Clear from localStorage
  });
});
