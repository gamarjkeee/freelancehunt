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
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const allButtonsSpan = document.querySelectorAll(".aside-button > span");
    allButtonsSpan.forEach((span => {
        span.style.textWrap = "nowrap";
    }));
    const aside = document.querySelector(".page__aside");
    const asideToggleButton = document.getElementById("asideToggler");
    asideToggleButton.addEventListener("click", (() => {
        aside.classList.toggle("close");
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
    const titlesOfSections = document.querySelectorAll(".title-section");
    console.log(titlesOfSections);
    wiFiButton.addEventListener("click", (() => {
        wiFiButton.classList.add("active");
        dashboardButton.classList.remove("active");
        fwButton.classList.remove("active");
        wiFiSection.classList.add("active");
        dashboardSection.classList.remove("active");
        fwSection.classList.remove("active");
        if (window.innerWidth < 768) {
            document.documentElement.classList.remove("menu-open");
            document.documentElement.classList.toggle("lock");
            titlesOfSections[2].classList.add("mobile");
            titlesOfSections[0].classList.remove("mobile");
            titlesOfSections[1].classList.remove("mobile");
        }
    }));
    fwButton.addEventListener("click", (() => {
        fwButton.classList.add("active");
        wiFiButton.classList.remove("active");
        dashboardButton.classList.remove("active");
        fwSection.classList.add("active");
        wiFiSection.classList.remove("active");
        dashboardSection.classList.remove("active");
        if (window.innerWidth < 768) {
            document.documentElement.classList.remove("menu-open");
            document.documentElement.classList.toggle("lock");
            titlesOfSections[1].classList.add("mobile");
            titlesOfSections[0].classList.remove("mobile");
            titlesOfSections[2].classList.remove("mobile");
        }
    }));
    dashboardButton.addEventListener("click", (() => {
        dashboardButton.classList.add("active");
        wiFiButton.classList.remove("active");
        fwButton.classList.remove("active");
        dashboardSection.classList.add("active");
        fwSection.classList.remove("active");
        wiFiSection.classList.remove("active");
        if (window.innerWidth < 768) {
            document.documentElement.classList.remove("menu-open");
            document.documentElement.classList.toggle("lock");
            titlesOfSections[0].classList.add("mobile");
            titlesOfSections[1].classList.remove("mobile");
            titlesOfSections[2].classList.remove("mobile");
        }
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
    const dropArea = document.getElementById("drop-area");
    const inputFile = document.getElementById("file-input");
    inputFile.addEventListener("change", uploadFife);
    function uploadFife() {
        alert("файл завантажився");
    }
    dropArea.addEventListener("dragover", (function(e) {
        e.preventDefault();
        alert("файл завантажився");
    }));
    dropArea.addEventListener("drop", (function(e) {
        e.preventDefault();
        inputFile.files = e.dataTransfer.files;
        alert("файл завантажився");
    }));
    const loader = document.getElementById("loader");
    setTimeout((() => {
        loader.classList.remove("active");
    }), 4e3);
    const updateButton = document.getElementById("update-button");
    const snackbars = document.querySelectorAll(".snackbar");
    const snackbarCloseButtons = document.querySelectorAll(".snackbar__close");
    console.log(snackbars[0]);
    snackbarCloseButtons.forEach((snackbarCloseButton => {
        snackbarCloseButton.addEventListener("click", (() => {
            snackbarCloseButton.parentNode.classList.remove("show");
        }));
    }));
    const toastBox = document.querySelector(".snackbar-box");
    let num = 0;
    function showToast() {
        let toast = snackbars[num];
        if (num >= 3) num = 0; else num++;
        toast.classList.add("show");
        toastBox.appendChild(toast);
        setTimeout((() => {
            toast.classList.remove("show");
        }), 4e3);
    }
    updateButton.addEventListener("click", (() => {
        showToast();
    }));
    window["FLS"] = false;
    isWebp();
    addLoadedClass();
    menuInit();
})();