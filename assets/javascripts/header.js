const header = document.querySelector('header');

document.addEventListener('scroll', (event) => {
  if(this.lastKnownScrollPosition > this.scrollY){
    header.classList.remove('is-scrolled');
  }
  else{
    if (this.lastKnownScrollPosition > 12) {
      header.classList.add('is-scrolled');
    }
  }

  this.lastKnownScrollPosition = this.scrollY;
});
