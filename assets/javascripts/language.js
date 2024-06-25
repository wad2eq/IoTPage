if(!Util) function Util () {};

Util.addClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
  if(bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

(function() {
  var LanguagePicker = function(element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.options = this.select.getElementsByTagName('option');
    this.selectedOption = getSelectedOptionText(this);
    this.pickerId = this.select.getAttribute('id');
    this.trigger = false;
    this.dropdown = false;
    this.firstLanguage = false;
    initLanguagePicker(this);
    initLanguagePickerEvents(this);
  };

  function initLanguagePicker(picker) {
    picker.element.insertAdjacentHTML('beforeend', initButtonPicker(picker) + initListPicker(picker));

    picker.dropdown = picker.element.getElementsByClassName('language-picker__dropdown')[0];
    picker.languages = picker.dropdown.getElementsByClassName('language-picker__item');
    picker.firstLanguage = picker.languages[0];
    picker.trigger = picker.element.getElementsByClassName('language-picker__button')[0];
  };

  function initLanguagePickerEvents(picker) {
    initLanguageSelection(picker);

    picker.trigger.addEventListener('click', function(){
      toggleLanguagePicker(picker, false);
    });
  };

  function toggleLanguagePicker(picker, bool) {
    var ariaExpanded;
    if(bool) {
      ariaExpanded = bool;
    } else {
      ariaExpanded = picker.trigger.getAttribute('aria-expanded') == 'true' ? 'false' : 'true';
    }
    picker.trigger.setAttribute('aria-expanded', ariaExpanded);
    if(ariaExpanded == 'true') {
      picker.firstLanguage.focus(); // fallback if transition is not supported
      picker.dropdown.addEventListener('transitionend', function cb(){
        picker.firstLanguage.focus();
        picker.dropdown.removeEventListener('transitionend', cb);
      });
      // place dropdown
      placeDropdown(picker);
    }
  };

  function placeDropdown(picker) {
    var triggerBoundingRect = picker.trigger.getBoundingClientRect();
    Util.toggleClass(picker.dropdown, 'language-picker__dropdown--right', (window.innerWidth < triggerBoundingRect.left + picker.dropdown.offsetWidth));
    Util.toggleClass(picker.dropdown, 'language-picker__dropdown--up', (window.innerHeight < triggerBoundingRect.bottom + picker.dropdown.offsetHeight));
  };

  function checkLanguagePickerClick(picker, target) { // if user clicks outside the language picker -> close it
    if( !picker.element.contains(target) ) toggleLanguagePicker(picker, 'false');
  };

  function initButtonPicker(picker) {
    // check if we need to add custom classes to the button trigger
    var customClasses = picker.element.getAttribute('data-trigger-class') ? ' '+picker.element.getAttribute('data-trigger-class') : '';

    var button = '<button class="language-picker__button'+customClasses+'" aria-label="'+picker.select.value+' '+picker.element.getElementsByTagName('label')[0].textContent+'" aria-expanded="false" aria-controls="'+picker.pickerId+'-dropdown">';
    button = button + '<span aria-hidden="true" class="language-picker__label language-picker__flag language-picker__flag--'+picker.select.value+'">'+''+'<em>'+picker.selectedOption+'</em>';
    button = button + '</span>';
    return button+'</button>';
  };

  function initListPicker(picker) { // create language picker dropdown
    var list = '<div class="language-picker__dropdown" aria-describedby="'+picker.pickerId+'-description" id="'+picker.pickerId+'-dropdown">';
    list = list + '<p class="li4-sr-only" id="'+picker.pickerId+'-description">'+picker.element.getElementsByTagName('label')[0].textContent+'</p>';
    list = list + '<ul class="language-picker__list" role="listbox">';
    for(var i = 0; i < picker.options.length; i++) {
      var selected = picker.options[i].selected ? ' aria-selected="true"' : '',
        language = picker.options[i].getAttribute('lang');
      list = list + '<li><a lang="'+language+'" hreflang="'+language+'" href="'+getLanguageUrl(picker.options[i])+'"'+selected+' role="option" data-value="'+picker.options[i].value+'" class="language-picker__item language-picker__flag language-picker__flag--'+picker.options[i].value+'"><span>'+picker.options[i].text+'</span></a></li>';
    };
    return list;
  };

  function getSelectedOptionText(picker) { // used to initialize the label of the picker trigger button
    var label = '';
    if('selectedIndex' in picker.select) {
      label = picker.options[picker.select.selectedIndex].text;
    } else {
      label = picker.select.querySelector('option[selected]').text;
    }
    return label;
  };

  function getLanguageUrl(option) {
    return '';
  };

  function initLanguageSelection(picker) {
    picker.element.getElementsByClassName('language-picker__list')[0].addEventListener('click', function(event){
      var language = event.target.closest('.language-picker__item');
      if(!language) return;

      if(language.hasAttribute('aria-selected') && language.getAttribute('aria-selected') == 'true') {
        event.preventDefault();
        picker.trigger.setAttribute('aria-expanded', 'false'); // hide dropdown
      } else {
        // ⚠️ Important: this 'else' code needs to be removed in production.
        // The user has to be redirected to the new url -> nothing to do here
        event.preventDefault();
        picker.element.getElementsByClassName('language-picker__list')[0].querySelector('[aria-selected="true"]').removeAttribute('aria-selected');
        language.setAttribute('aria-selected', 'true');
        picker.trigger.getElementsByClassName('language-picker__label')[0].setAttribute('class', 'language-picker__label language-picker__flag language-picker__flag--'+language.getAttribute('data-value'));
        picker.trigger.getElementsByClassName('language-picker__label')[0].getElementsByTagName('em')[0].textContent = language.textContent;
        picker.trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  var languagePicker = document.getElementsByClassName('language-picker');

  if( languagePicker.length > 0 ) {
    var pickerArray = [];
    for( var i = 0; i < languagePicker.length; i++) {
      (function(i){pickerArray.push(new LanguagePicker(languagePicker[i]));})(i);
    }

    window.addEventListener('click', function(event){
      pickerArray.forEach(function(element){
        checkLanguagePickerClick(element, event.target);
      });
    });
  }
}());
