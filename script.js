/* =====================================================
   AFZAL KHAN PORTFOLIO
===================================================== */


/* =====================================================
   MOBILE MENU
===================================================== */

const mobileMenu =
    document.getElementById("mobileMenu");

const mainNav =
    document.getElementById("mainNav");


mobileMenu.addEventListener("click", () => {

    mainNav.classList.toggle("open");

    const icon =
        mobileMenu.querySelector("i");

    if (mainNav.classList.contains("open")) {

        icon.classList.remove("fa-bars");

        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    }

});


document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("open");

        const icon =
            mobileMenu.querySelector("i");

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    });

});



/* =====================================================
   TYPING EFFECT
===================================================== */

const typingText =
    document.getElementById("typingText");


const professions = [

    "Web Developer",

    "App Developer",

    "Cybersecurity Analyst",

    "AI Aspirant",

    "Database Manager"

];


let professionIndex = 0;

let characterIndex = 0;

let deleting = false;


function typeProfession() {

    const current =
        professions[professionIndex];


    if (!deleting) {

        typingText.textContent =
            current.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;


        if (
            characterIndex ===
            current.length
        ) {

            deleting = true;

            setTimeout(
                typeProfession,
                1500
            );

            return;
        }


    } else {

        typingText.textContent =
            current.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;


        if (characterIndex === 0) {

            deleting = false;

            professionIndex++;

            if (
                professionIndex >=
                professions.length
            ) {

                professionIndex = 0;

            }

        }

    }


    setTimeout(
        typeProfession,
        deleting ? 45 : 85
    );

}


typeProfession();



/* =====================================================
   PHOTO UPLOAD
===================================================== */

const photoUpload =
    document.getElementById("photoUpload");

const profilePhoto =
    document.getElementById("profilePhoto");

const photoFrame =
    document.querySelector(".photo-frame");


photoUpload.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) {
            return;
        }


        /* Check image */

        if (
            !file.type.startsWith("image/")
        ) {

            alert(
                "Please select an image file."
            );

            return;

        }


        /* File size check */

        const maxSize =
            5 * 1024 * 1024;


        if (file.size > maxSize) {

            alert(
                "Please choose an image smaller than 5 MB."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function (event) {

            profilePhoto.src =
                event.target.result;

            photoFrame.classList.add(
                "has-photo"
            );

        };


        reader.readAsDataURL(file);

    }
);



/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll("section");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener(
    "scroll",
    () => {

        let currentSection = "";


        sections.forEach(section => {

            const top =
                section.offsetTop - 150;

            const height =
                section.offsetHeight;


            if (
                window.scrollY >= top &&
                window.scrollY <
                top + height
            ) {

                currentSection =
                    section.id;

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");


            if (
                link.getAttribute("href") ===
                `#${currentSection}`
            ) {

                link.classList.add("active");

            }

        });

    }
);



/* =====================================================
   CONTACT FORM
===================================================== */

const contactForm =
    document.getElementById("contactForm");

const formStatus =
    document.getElementById("formStatus");


contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "contactName"
            ).value;


        formStatus.textContent =
            `Thank you ${name}. Your message is ready to send.`;


        contactForm.reset();

    }
);



/* =====================================================
   BACK TO TOP
===================================================== */

const backToTop =
    document.getElementById("backToTop");


window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    }
);


backToTop.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);



/* =====================================================
   REVEAL ANIMATION
===================================================== */

const animatedElements =
    document.querySelectorAll(
        ".highlight, .skill-category, .project, .timeline-item, .contact-box"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.style.opacity =
                        "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


animatedElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";


    observer.observe(element);

});



/* =====================================================
   CONSOLE
===================================================== */

console.log(
`
========================================
       AFZAL KHAN PORTFOLIO
========================================

 Web Developer
 App Developer
 Cybersecurity Analyst
 AI Aspirant
 Database Management

 Building. Learning. Securing.

========================================
`
);