var translations = {
  "en" : {
    "main-header" : "The Product House"
  },
  "pl" : {
    "main-header" : "Tutaj Powstaje IoT"
  },
};

document.getElementsByClassName('language-picker').onchange = function() {
  var language = this.options[this.selectedIndex].value,
      nodes = document.querySelectorAll('[data-translation]'),
      i = nodes.length,
      key;

  while (i--) {
    var key = nodes[i].getAttribute('data-translation');
    nodes[i].innerHTML = translations[language][key];
  }
};