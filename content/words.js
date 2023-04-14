export const words = {
  getWordsOnPage() {
    const thingsPopup = document.getElementById("things-popup");
    if (!thingsPopup) return [];

    // Get all the text on the page, excluding the text in the popup
    const everything = document.body.innerText.replace(
      thingsPopup.innerText,
      ""
    );

    // Split the text into words using a regular expression
    const words = everything.match(/[A-Za-z]+('[A-Za-z]+)?/g) || [];

    return words;
  },

  countWords(words) {
    const counts = new Map();

    for (const word of words) {
      const count = counts.get(word) || 0;
      counts.set(word, count + 1);
    }

    return counts;
  },

  sortCountsArray(counts) {
    const sortedCountsArray = Array.from(counts.entries()).sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0].localeCompare(b[0]);
      }
      return b[1] - a[1];
    });

    return sortedCountsArray;
  },

  createTable(sortedCountsArray) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const trHead = document.createElement("tr");
    const thWord = document.createElement("th");
    const thCount = document.createElement("th");

    thWord.textContent = "Word";
    thCount.textContent = "Count";

    trHead.appendChild(thWord);
    trHead.appendChild(thCount);
    thead.appendChild(trHead);
    table.appendChild(thead);

    for (const [word, count] of sortedCountsArray) {
      const trBody = this.createTableRow(word, count);
      tbody.appendChild(trBody);
    }

    table.appendChild(tbody);
    return table;
  },

  createTableRow(word, count) {
    const tr = document.createElement("tr");
    const tdWord = document.createElement("td");
    const tdCount = document.createElement("td");

    tdWord.textContent = word;
    tdCount.textContent = count;

    tr.appendChild(tdWord);
    tr.appendChild(tdCount);

    return tr;
  },

  getAWordCountTable(words) {
    if (!words || words.length === 0) {
      return;
    }

    const counts = this.countWords(words);
    const sortedCountsArray = this.sortCountsArray(counts);
    const table = this.createTable(sortedCountsArray);

    return table.outerHTML;
  },
};
