(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    class Parallax {
        constructor(elements) {
            if (elements.length) this.elements = Array.from(elements).map((el => new Parallax.Each(el, this.options)));
        }
        destroyEvents() {
            this.elements.forEach((el => {
                el.destroyEvents();
            }));
        }
        setEvents() {
            this.elements.forEach((el => {
                el.setEvents();
            }));
        }
    }
    Parallax.Each = class {
        constructor(parent) {
            this.parent = parent;
            this.elements = this.parent.querySelectorAll("[data-prlx]");
            this.animation = this.animationFrame.bind(this);
            this.offset = 0;
            this.value = 0;
            this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
            this.setEvents();
        }
        setEvents() {
            this.animationID = window.requestAnimationFrame(this.animation);
        }
        destroyEvents() {
            window.cancelAnimationFrame(this.animationID);
        }
        animationFrame() {
            const topToWindow = this.parent.getBoundingClientRect().top;
            const heightParent = this.parent.offsetHeight;
            const heightWindow = window.innerHeight;
            const positionParent = {
                top: topToWindow - heightWindow,
                bottom: topToWindow + heightParent
            };
            const centerPoint = this.parent.dataset.prlxCenter ? this.parent.dataset.prlxCenter : "center";
            if (positionParent.top < 30 && positionParent.bottom > -30) switch (centerPoint) {
              case "top":
                this.offset = -1 * topToWindow;
                break;

              case "center":
                this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
                break;

              case "bottom":
                this.offset = heightWindow - (topToWindow + heightParent);
                break;
            }
            this.value += (this.offset - this.value) / this.smooth;
            this.animationID = window.requestAnimationFrame(this.animation);
            this.elements.forEach((el => {
                const parameters = {
                    axis: el.dataset.axis ? el.dataset.axis : "v",
                    direction: el.dataset.direction ? el.dataset.direction + "1" : "-1",
                    coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
                    additionalProperties: el.dataset.properties ? el.dataset.properties : ""
                };
                this.parameters(el, parameters);
            }));
        }
        parameters(el, parameters) {
            if (parameters.axis == "v") el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`; else if (parameters.axis == "h") el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
        }
    };
    if (document.querySelectorAll("[data-prlx-parent]")) modules_flsModules.parallax = new Parallax(document.querySelectorAll("[data-prlx-parent]"));
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const frontBookItems = document.querySelectorAll(".book-top-how-to-buy__item--front");
    const backBookItems = document.querySelectorAll(".book-top-how-to-buy__item--back");
    const deviceWidth = window.innerWidth;
    frontBookItems.forEach((frontBookItem => {
        frontBookItem.addEventListener("click", (() => {
            if (deviceWidth > 767.98) {
                frontBookItem.parentElement.style.transformOrigin = "left";
                frontBookItem.parentElement.style.transform = "rotateY(-180deg)";
                frontBookItem.parentElement.classList.add("open");
            } else {
                frontBookItem.parentElement.style.transformOrigin = "top";
                frontBookItem.parentElement.style.transform = "rotateX(180deg)";
                frontBookItem.parentElement.classList.add("open");
            }
        }));
    }));
    backBookItems.forEach((backBookItem => {
        backBookItem.addEventListener("click", (() => {
            if (deviceWidth > 767.98) {
                backBookItem.parentElement.style.transformOrigin = "left";
                backBookItem.parentElement.style.transform = "rotateY(0)";
                backBookItem.parentElement.classList.remove("open");
            } else {
                backBookItem.parentElement.style.transformOrigin = "top";
                backBookItem.parentElement.style.transform = "rotateX(0)";
                backBookItem.parentElement.classList.remove("open");
            }
        }));
    }));
    const howToBuyButtons = document.querySelectorAll(".top-how-to-buy__button");
    const howToBuyBooks = document.querySelectorAll(".top-how-to-buy__book");
    howToBuyButtons.forEach(((howToBuyButton, index) => {
        howToBuyButton.addEventListener("click", (() => {
            howToBuyBooks.forEach((howToBuyBook => {
                howToBuyBook.classList.remove("active");
                if (howToBuyBook === howToBuyBooks[index]) howToBuyBook.classList.add("active");
            }));
            howToBuyButtons.forEach((element => {
                element.classList.remove("active");
            }));
            howToBuyButton.classList.add("active");
        }));
    }));
    const projectsButtons = document.querySelectorAll(".bottom-how-to-buy__button");
    const projectsCats = document.querySelectorAll(".bottom-how-to-buy__item");
    projectsButtons.forEach(((projectsButton, index) => {
        projectsButton.addEventListener("click", (() => {
            projectsCats.forEach((projectsCat => {
                projectsCat.classList.remove("active");
                if (projectsCat === projectsCats[index]) projectsCat.classList.add("active");
            }));
            projectsButtons.forEach((element => {
                element.classList.remove("active");
            }));
            projectsButton.classList.add("active");
        }));
    }));
    window["FLS"] = false;
    isWebp();
    addLoadedClass();
    menuInit();
})();