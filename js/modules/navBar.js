// js/modules/navBar.js
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Module containing functions and attributes that are related to the navBar
 */
(function (parent) {
  var module = parent.navBar = parent.navBar || {};

  /**
   * The element containing the navBar.
   * @type {Element}
   */
  module.div = document.getElementById("navBar");

  /**
   * Object containing the scrollTo button elements.
   * @type {{ban: Element, client: Element, complaint: Element, kick: Element, upload: Element}}
   */
  var scrollToButtons = {};

  /**
   * Adds a scrollTo button to the navBar and adds the button element to the scrollToButtons object.
   * The button has an onclick event that scrolls the table into view.
   * Note: the button is hidden by default. (see showScrollToButton and hideScrollToButton)
   * @param tableModule the tableModule for which to add the scrollTo button
   */
  function addScrollToButton(tableModule) {
    var button = document.createElement("button");
    scrollToButtons[tableModule.name] = button;
    button.style.display = "none";

    button.innerText = tableModule.name[0].toUpperCase() + tableModule.name.slice(1) + "s";

    button.onclick = function () {
      tableModule.div.scrollIntoView();
    };

    module.div.appendChild(button);
  }

  module.showScrollToButton = function (tableModule) {
    scrollToButtons[tableModule.name].style.display = "";
  };

  module.hideScrollToButton = function (tableModule) {
    scrollToButtons[tableModule.name].style.display = "none";
  };

  module.build = function () {
    var scrollBackToTopButton = document.createElement("button");
    scrollBackToTopButton.innerText = "Top";

    scrollBackToTopButton.onclick = function () {
      scrollTo(0, 0);
    };

    module.div.appendChild(scrollBackToTopButton);
    addScrollToButton(ts3ldv.tables.ban);
    addScrollToButton(ts3ldv.tables.client);
    addScrollToButton(ts3ldv.tables.complaint);
    addScrollToButton(ts3ldv.tables.kick);
    addScrollToButton(ts3ldv.tables.upload);
  };

  return module;
}(ts3ldv || {}));
