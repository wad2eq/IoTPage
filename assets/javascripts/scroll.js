document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger,ScrollToPlugin)

  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(event){
      event.preventDefault();
      gsap.to(window, { duration: 1.4, scrollTo: link.getAttribute('href') });
    });
  });
});
