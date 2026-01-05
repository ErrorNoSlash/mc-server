// controles preloader
document.addEventListener("DOMContentLoaded", () => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry && navEntry.type === "reload";
    const hasVisited = sessionStorage.getItem("hasVisited");

    const counter = document.querySelector(".counter");
    const overlay = document.querySelector(".overlay");

    if (!hasVisited || isReload) {
        sessionStorage.setItem("hasVisited", "true");

        document.body.classList.add("show-preloader");

        startLoader();
    } else {
        // HARD disable preloader when already visited
        if (counter) counter.style.display = "none";
        if (overlay) overlay.style.display = "none";
    }
});

function startLoader() {
    const counterElement = document.querySelector(".counter");
    let currentValue = 0;

    function updateCounter() {
        if (currentValue >= 100) {
            counterElement.textContent = 100;
            triggerAnimations();
            return;
        }

        currentValue += Math.floor(Math.random() * 10);
        if (currentValue > 100) currentValue = 100;

        counterElement.textContent = currentValue;

        const delay = Math.floor(Math.random() * 100) + 20;
        setTimeout(updateCounter, delay);
    }

    updateCounter();
}

function triggerAnimations() {
    const counter = document.querySelector(".counter");
    const overlay = document.querySelector(".overlay");

    // Fade out counter, then remove from rendering
    gsap.to(counter, {
        delay: 0.5,
        duration: 0.25,
        opacity: 0,
        onComplete: () => {
            if (counter) counter.style.display = "none";
        }
    });

    // Animate bars, then kill overlay completely
    gsap.to(".bar", {
        delay: 0.5,
        duration: 1.5,
        height: 0,
        stagger: {
            amount: 0.5,
        },
        ease: "power4.inOut",
        onComplete: () => {
            if (overlay) overlay.style.display = "none";
        }
    });
}