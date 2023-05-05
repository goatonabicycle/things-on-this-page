export const words = {
  getWordsOnPage() {
    const thingsPopup = document.getElementById("things-popup") || {};

    console.log({ thingsPopup });
    if (!thingsPopup) return [];

    console.log(thingsPopup);
    // Get all the text on the page, excluding the text in the popup
    const everything = document.body.innerText.replace(
      thingsPopup.innerText,
      ""
    );

    // Split the text into words using a regular expression
    const words = everything.match(/[\w]|[^\s\w]/g) || [];

    console.log({ words });
    return words;
  },

  getAverageWordLength(words) {
    if (words.length === 0) {
      return 0;
    }

    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    const averageLength = Math.round(totalLength / words.length);
    return averageLength;
  },

  characterDistributionMap(words) {
    const charDistMap = {};

    for (const word of words) {
      for (const char of word) {
        if (/\w/.test(char)) {
          // Convert the character to lowercase. X and x should be treated the same.
          const lowerChar = char.toLowerCase();
          charDistMap[lowerChar] = (charDistMap[lowerChar] || 0) + 1;
        } else {
          charDistMap[char] = (charDistMap[char] || 0) + 1;
        }
      }
    }

    // Sort the character distribution map by most used characters
    const sortedCharDistMap = Object.entries(charDistMap)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .reduce((acc, [char, count]) => {
        acc[char] = count;
        return acc;
      }, {});

    return sortedCharDistMap;
  },

  getLongestWord(words) {
    if (words.length === 0) {
      return "";
    }

    let longestWord = words[0];

    for (let i = 1; i < words.length; i++) {
      if (words[i].length > longestWord.length) {
        longestWord = words[i];
      }
    }

    return longestWord;
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

  getAWordCountTable(words) {
    if (!words || words.length === 0) {
      return;
    }

    const counts = this.countWords(words);
    const sortedCountsArray = this.sortCountsArray(counts);
    const table = this.createTable(sortedCountsArray.slice(0, 30));

    return table.outerHTML;
  },

  createTableRow(item1, item2) {
    const tr = document.createElement("tr");
    const tdItem1 = document.createElement("td");
    const tdItem2 = document.createElement("td");

    tdItem1.textContent = item1;
    tdItem2.textContent = item2;

    tr.appendChild(tdItem1);
    tr.appendChild(tdItem2);

    return tr;
  },

  createTable(sortedCountsArray, label1, label2) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const trHead = document.createElement("tr");
    const thLabel1 = document.createElement("th");
    const thLabel2 = document.createElement("th");

    thLabel1.textContent = label1;
    thLabel2.textContent = label2;

    trHead.appendChild(thLabel1);
    trHead.appendChild(thLabel2);
    thead.appendChild(trHead);
    table.appendChild(thead);

    for (const [item1, item2] of sortedCountsArray) {
      const trBody = this.createTableRow(item1, item2);
      tbody.appendChild(trBody);
    }

    table.appendChild(tbody);
    return table;
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

  getAWordCountTable(words) {
    if (!words || words.length === 0) {
      return;
    }

    const counts = this.countWords(words);
    const sortedCountsArray = this.sortCountsArray(counts);
    const table = this.createTable(
      sortedCountsArray.slice(0, 30),
      "Word",
      "Count"
    );

    return table.outerHTML;
  },

  createCharDistTable(charDistMap) {
    const sortedCharDistArray = Object.entries(charDistMap).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    );

    const table = this.createTable(sortedCharDistArray, "Character", "Count");

    return table.outerHTML;
  },
};
