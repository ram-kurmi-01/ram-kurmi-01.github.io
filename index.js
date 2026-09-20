// ==============================toggle icon navbar====================================

let MenuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

MenuIcon.onclick = () => {
    MenuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
}
const h3 = document.querySelector('h3');
const home_content = document.querySelector('.home-content');
const click_event = MenuIcon.addEventListener('click', ()=>{
//     const div = document.createElement('div');
//     div.className = 'Nav-div';
//     div.id = 'Nav-id';
//     div.innerText = "hyy";
//     document.home_content.appendchild(div);
   h3.innerHTML = 'hello ji'
})

// ==============================Scroll section active link====================================

let section = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
 section.forEach(sec =>{
    let top = window.screenY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight ;
    let id = sec.getAttribute('id');

    if(top >= offset && top < offset + height){
        navLinks.forEach.apply(links => {
            links.classList.remove('active');
            document.querySelector('header nav a[href*=' + id + ']').classList.add('active');

        });
    };
 });
//  =================================================sticky nevbar==========================================

let header = document.querySelector('header');
header.classList.toggle('sticky', window.scrollY > 100);

MenuIcon.classList.remove('fa-xmark');
navbar.classList.remove('active');
};

// =================================================scroll reveal ==================================================

ScrollReveal({
    distance:'80px',
    duration: 2000,
    delay: 200,
})
ScrollReveal().reveal('.home-content, heading , .second-row',{ origin: 'top'});
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', {origin: 'buttom'});
ScrollReveal().reveal('.home-contact h1, .about-img , .first-row',{ origin: 'left'});
ScrollReveal().reveal('.home-contact p,.about-content, .third-row ',{ origin: 'right'});


// =================================================scroll reveal ==================================================
const typed = new typed('.multiple-text', {
    String: String[' Frontend Developer', 'web Designer' ,'youtuber'],
    typeSpeed: 70,
    backSpeed: 70,
    backDelay: 1000,
    loop: true,
});