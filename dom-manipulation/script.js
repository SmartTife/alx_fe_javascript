// script.js

const quoteInput = document.getElementById("quoteInput");
const categoryInput = document.getElementById("categoryInput");
const categoryFilter = document.getElementById("categoryFilter");
const quoteDisplay = document.getElementById("quoteDisplay");

const serverUrl = "https://6868a6d9d5933161d70c153a.mockapi.io/api/v1/quotes";
let quotes = [];

window.onload = async function () {
  await fetchServerQuotes();
  const storedFilter = localStorage.getItem("selectedCategory");
  if (storedFilter) {
    categoryFilter.value = storedFilter;
  }
  populateCategories();
  filterQuotes();
  setInterval(fetchServerQuotes, 10000); // every 10 seconds
};

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function addQuote() {
  const newQuote = {
    text: quoteInput.value,
    category: categoryInput.value
  };
  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote);
  quoteInput.value = "";
  categoryInput.value = "";
  populateCategories();
  filterQuotes();
}

function displayQuotes(filteredQuotes) {
  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach((quote) => {
    const div = document.createElement("div");
    div.textContent = `${quote.text} (${quote.category})`;
    quoteDisplay.appendChild(div);
  });
}

function populateCategories() {
  const categories = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  displayQuotes(filtered);
  sessionStorage.setItem("lastViewed", JSON.stringify(filtered[0] || {}));
}

// JSON Export
function exportToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// MockAPI Server Sync
async function fetchServerQuotes() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    // Overwrite local quotes (server takes precedence)
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    console.log("Synced from server.");
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}
