function fadeIn (item, delay) {
  setTimeout(() => {
    item.classList.add('fadein')
  }, delay)
}

var headerItems = document.querySelectorAll(".hero .hero__top h1.title span");

if (localStorage.initialAnimationsPerformed == undefined) {
  for (let i = 0; i < headerItems.length; ++i) {
    fadeIn(headerItems[i], i * 50)
  }
} else {
  for (let i = 0; i < headerItems.length; ++i) {
    fadeIn(headerItems[i], i * 0)
  }

  localStorage.initialAnimationsPerformed = true;
}
