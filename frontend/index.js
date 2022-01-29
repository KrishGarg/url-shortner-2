import "bootstrap/dist/css/bootstrap.css";

import copy from "copy-to-clipboard";

const form = document.getElementById("submit-form");
const submitBtn = document.getElementById("submit-btn");
const longURLInput = document.getElementById("longURL");
const someIssue = document.getElementById("some-issue");
const successCard = document.getElementById("success-card");
const copyBtn = document.getElementById("copy-btn");
const shortenedDiv = document.getElementById("shortened-div");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;

  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      longURL: longURLInput.value,
    }),
  });

  form.classList.add("d-none");
  if (!res.ok) {
    someIssue.classList.remove("d-none");
  } else {
    const data = await res.json();
    shortenedDiv.innerText = `Shortned URL: https://pops.gq/${data.shortURL}`;
    copyBtn.onclick = () => {
      copy(`https://pops.gq/${data.shortURL}`);
    };
    successCard.classList.remove("d-none");
  }
});
