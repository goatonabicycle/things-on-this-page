
function saveOptions() {
  const checkboxes = document.querySelectorAll('input[name="panelsToShow"]:checked');
  const panelsToShow = Array.from(checkboxes).map(checkbox => checkbox.value);

  chrome.storage.local.get('flags', (data) => {
    const flags = data.flags || { outlineColour: "blue", panelsToShow: [] };

    flags.panelsToShow = panelsToShow;

    chrome.storage.local.set({ flags }, () => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved!';
      status.classList.add('success');
      status.style.display = 'block';

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            type: "UPDATE_FLAGS",
            flags: flags
          }).catch(err => console.log("Error sending flags update:", err));
        });
      });

      setTimeout(() => {
        status.style.display = 'none';
      }, 2000);
    });
  });
}

function restoreOptions() {
  chrome.storage.local.get('flags', (data) => {
    if (data.flags && data.flags.panelsToShow) {
      const panelsToShow = data.flags.panelsToShow;

      document.querySelectorAll('input[name="panelsToShow"]').forEach(checkbox => {
        checkbox.checked = panelsToShow.includes(checkbox.value);
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);