// ==UserScript==
// @name         GoIT Sort Original List (Scroll to Top)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Сортує оригінальний список курсів GoIT, підсвічує статуси та скролить список вгору
// @match        https://www.edu.goit.global/*
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    function getStatus(el) {
        const text = el.textContent.trim();
        if (/Прекурс|English|HTML|Soft|Java|Git|AI|командного|Cracking/i.test(text)) return 'passed';  // позначаємо що помітити як пройдене
        if (/React|процес|in progress|progress/i.test(text)) return 'inProgress';                      // позначаємо що у процесі навчання
        return 'notStarted';
    }

    function sortList(original) {
        const items = Array.from(original.querySelectorAll('div[role="option"], li, .Select__option, [role="menuitem"]'));
        if (!items.length) return;

        const passed = items.filter(el => getStatus(el) === 'passed');
        const inProgress = items.filter(el => getStatus(el) === 'inProgress');
        const notStarted = items.filter(el => getStatus(el) === 'notStarted');

        // порядок сортування
        const sorted = [...inProgress, ...notStarted, ...passed];

        // Перевіряємо, чи порядок змінився
        const currentOrder = Array.from(original.children);
        const same = currentOrder.length === sorted.length && currentOrder.every((el, i) => el === sorted[i]);
        if (same) return;

        observer.disconnect();

        sorted.forEach(el => {
            const status = getStatus(el);

            // замінюємо стиль відображення
            if (status === 'passed') el.style.backgroundColor = 'rgba(0,200,0,0.18)';
            else if (status === 'inProgress') el.style.backgroundColor = 'rgba(0,0,200,0.14)';
            else el.style.backgroundColor = 'rgba(200,200,200,0.12)';

            original.appendChild(el);
        });

        // Прокрутка контейнера вгору
        original.scrollTop = 0;

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function updateLists() {
        const dropdowns = document.querySelectorAll('div[role="listbox"], ul[role="listbox"], .Select__menu-list, .dropdown-menu');
        dropdowns.forEach(list => sortList(list));
    }

    const observer = new MutationObserver(() => {
        requestAnimationFrame(() => updateLists());
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(updateLists, 1200);
})();
