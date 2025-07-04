// script.js

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" }
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function displayRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const category = localStorage.getItem('selectedCategory') || 'all';
  const filteredQuotes = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.textContent = quote ? `${quote.text} — ${quote.category}` : "No quotes available in this category.";
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    if (category === selectedCategory) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', category);
  displayRandomQuote();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

window.onload = () => {
  populateCategories();
  displayRandomQuote();
};



