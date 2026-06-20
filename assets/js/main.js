'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });





// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    if (!selectValue || !select) return;

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
if (filterBtn.length > 0 && selectValue) {
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function () {

      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;

    });

  }
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Utility to activate a page by its data-page value (lowercased string)
const activatePage = function(targetPageKey) {
  for (let j = 0; j < pages.length; j++) {
    if (pages[j].dataset.page === targetPageKey) {
      pages[j].classList.add("active");
    } else {
      pages[j].classList.remove("active");
    }
  }
};

// Utility to activate a nav button by its label (lowercased string)
const activateNav = function(targetPageKey) {
  for (let k = 0; k < navigationLinks.length; k++) {
    const linkKey = navigationLinks[k].innerText.trim().toLowerCase();
    if (linkKey === targetPageKey) {
      navigationLinks[k].classList.add("active");
    } else {
      navigationLinks[k].classList.remove("active");
    }
  }
};

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const selectedValue = this.innerText.trim().toLowerCase();

    activatePage(selectedValue);
    activateNav(selectedValue);
    window.scrollTo(0, 0);
  });
}

// Sync initial navbar active state with the currently active page on load
(function syncInitialNavToActivePage() {
  const activeArticle = document.querySelector('[data-page].active');
  if (activeArticle) {
    const key = activeArticle.dataset.page;
    activateNav(key);
  }
})();

// Make the nav buttons work reliably even when the DOM is loaded after scripts
window.addEventListener("DOMContentLoaded", function () {
  const navButtons = document.querySelectorAll("[data-nav-link]");
  const articles = document.querySelectorAll("[data-page]");

  navButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const pageKey = this.textContent.trim().toLowerCase();

      articles.forEach((article) => {
        article.classList.toggle("active", article.dataset.page === pageKey);
      });

      navButtons.forEach((btn) => {
        btn.classList.toggle("active", btn === this);
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});
// --------------------------------------------------
//  Service Worker Registration for Performance & Offline Support
// --------------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration.scope);
        
        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version available! Refresh to update.');
            }
          });
        });
      })
      .catch((error) => {
        console.log('[SW] Registration failed:', error);
      });
  });
}

