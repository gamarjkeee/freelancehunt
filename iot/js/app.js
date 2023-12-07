(() => {
    "use strict";
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
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const allButtonsSpan = document.querySelectorAll(".aside-button > span");
    allButtonsSpan.forEach((span => {
        span.style.textWrap = "nowrap";
    }));
    const clientFormItems = document.querySelectorAll(".client-form__items");
    const defaultWidthForClient = document.querySelector(".column-form").clientWidth * 2 - (document.querySelector(".column-form").clientWidth - 250);
    if (window.innerWidth >= 1350) clientFormItems.forEach((clientFormItem => {
        clientFormItem.style.width = `${defaultWidthForClient}px`;
        clientFormItem.style.flexBasis = `${defaultWidthForClient}px`;
    }));
    const aside = document.querySelector(".page__aside");
    const asideToggleButton = document.getElementById("asideToggler");
    const columnsWiFi = document.querySelectorAll(".column-form--r");
    asideToggleButton.addEventListener("click", (() => {
        aside.classList.toggle("close");
        if (aside.classList.contains("close") && window.innerWidth >= 1350) {
            columnsWiFi.forEach((el => {
                el.style.paddingRight = "140px";
            }));
            clientFormItems.forEach((clientFormItem => {
                clientFormItem.style.paddingRight = "140px";
                clientFormItem.style.width = `${defaultWidthForClient + 100}px`;
                clientFormItem.style.flexBasis = `${defaultWidthForClient + 100}px`;
            }));
        } else if (window.innerWidth >= 1350) {
            columnsWiFi.forEach((el => {
                el.style.paddingRight = "30px";
            }));
            clientFormItems.forEach((clientFormItem => {
                clientFormItem.style.paddingRight = "30px";
                clientFormItem.style.width = `${defaultWidthForClient}px`;
                clientFormItem.style.flexBasis = `${defaultWidthForClient}px`;
            }));
        }
    }));
    const settingsButton = document.getElementById("settings-toggle-button");
    const maintenanceButton = document.getElementById("maintenance-toggle-button");
    const settingsSubMenu = document.getElementById("settings-sub-menu");
    const maintenanceSubMenu = document.getElementById("maintenance-sub-menu");
    function calcHeightElement(element) {
        if (element.classList.contains("open")) element.style.height = `${element.children.length * 60}px`; else element.style.height = "0px";
    }
    calcHeightElement(settingsSubMenu);
    calcHeightElement(maintenanceSubMenu);
    settingsButton.addEventListener("click", (() => {
        settingsButton.classList.toggle("active");
        settingsSubMenu.classList.toggle("open");
        calcHeightElement(settingsSubMenu);
    }));
    maintenanceButton.addEventListener("click", (() => {
        maintenanceButton.classList.toggle("active");
        maintenanceSubMenu.classList.toggle("open");
        calcHeightElement(maintenanceSubMenu);
    }));
    const dashboardButton = document.getElementById("dashboard-button");
    const wiFiButton = document.getElementById("wi-fi-button");
    const fwButton = document.getElementById("fw-button");
    const dashboardSection = document.querySelector(".dashboard-section");
    const wiFiSection = document.querySelector(".wi-fi-section");
    const fwSection = document.querySelector(".fw-section");
    wiFiButton.addEventListener("click", (() => {
        wiFiButton.classList.add("active");
        dashboardButton.classList.remove("active");
        fwButton.classList.remove("active");
        wiFiSection.classList.add("active");
        dashboardSection.classList.remove("active");
        fwSection.classList.remove("active");
        document.documentElement.classList.remove("menu-open");
    }));
    fwButton.addEventListener("click", (() => {
        fwButton.classList.add("active");
        wiFiButton.classList.remove("active");
        dashboardButton.classList.remove("active");
        fwSection.classList.add("active");
        wiFiSection.classList.remove("active");
        dashboardSection.classList.remove("active");
        document.documentElement.classList.remove("menu-open");
    }));
    dashboardButton.addEventListener("click", (() => {
        dashboardButton.classList.add("active");
        wiFiButton.classList.remove("active");
        fwButton.classList.remove("active");
        dashboardSection.classList.add("active");
        fwSection.classList.remove("active");
        wiFiSection.classList.remove("active");
        document.documentElement.classList.remove("menu-open");
    }));
    const apMode = document.getElementById("ap-mode");
    const staMode = document.getElementById("sta-mode");
    const apModeForm = document.getElementById("ap-form");
    const staModeForm = document.getElementById("sta-form");
    staMode.addEventListener("click", (() => {
        staMode.classList.add("active");
        apMode.classList.remove("active");
        apModeForm.classList.remove("active");
        staModeForm.classList.add("active");
    }));
    apMode.addEventListener("click", (() => {
        apMode.classList.add("active");
        staMode.classList.remove("active");
        staModeForm.classList.remove("active");
        apModeForm.classList.add("active");
    }));
    const advancedButtons = document.querySelectorAll(".advanced");
    advancedButtons.forEach((advancedButton => {
        advancedButton.addEventListener("click", (() => {
            advancedButton.classList.toggle("active");
            advancedButton.nextElementSibling.classList.toggle("open");
            if (!advancedButton.classList.contains("active")) clientFormItems.forEach((clientFormItem => {
                clientFormItem.style.width = `${parseInt(clientFormItem.style.width) + 8}px`;
                clientFormItem.style.flexBasis = `${parseInt(clientFormItem.style.flexBasis) + 8}px`;
            })); else clientFormItems.forEach((clientFormItem => {
                clientFormItem.style.width = `${parseInt(clientFormItem.style.width) - 8}px`;
                clientFormItem.style.flexBasis = `${parseInt(clientFormItem.style.flexBasis) - 8}px`;
            }));
        }));
    }));
    const progressLine = document.getElementById("progress-line");
    const progressValue = document.getElementById("progress-value");
    progressLine.style.width = `${parseFloat(progressValue.innerHTML)}%`;
    const seletButtoons = document.querySelectorAll(".select-item__button");
    const seletOptions = document.querySelectorAll(".select-item__item");
    seletOptions.forEach((el => {
        el.addEventListener("click", (() => {
            el.parentNode.classList.toggle("open");
            el.parentNode.parentNode.firstElementChild.classList.toggle("active");
            el.parentNode.parentNode.firstElementChild.innerHTML = `<span>${el.id.charAt(0).charAt(0).toUpperCase() + el.id.slice(1)}</span>`;
        }));
    }));
    seletButtoons.forEach((el => {
        el.addEventListener("click", (() => {
            el.classList.toggle("active");
            el.nextElementSibling.classList.toggle("open");
            document.addEventListener("click", (e => {
                const withinBoundaries = e.composedPath().includes(el);
                if (!withinBoundaries) {
                    el.classList.remove("active");
                    el.nextElementSibling.classList.remove("open");
                }
            }));
            document.addEventListener("keydown", (function(e) {
                if (e.keyCode == 27) {
                    el.classList.remove("active");
                    el.nextElementSibling.classList.remove("open");
                }
            }));
        }));
    }));
    window["FLS"] = true;
    isWebp();
    addLoadedClass();
    menuInit();
})();