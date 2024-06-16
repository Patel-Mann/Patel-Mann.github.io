/**
 * @copyright codewithsadee 2023
 * @author Sadee <codewithsadee24@gmail.com>
 */

"use strict";

//dark and light mode
const /**{NodeElement} */ $themeBtn = document.querySelector("[data-theme-btn]");
const /**{NodeElement} */ $HTML = document.documentElement;
let /**{Boolean | String} */ isdark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (sessionStorage.getItem("theme")) {
  $HTML.dataset.theme = sessionStorage.getItem("theme");
} else {
  $HTML.dataset.theme = isdark ? "dark" : "light";
//   sessionStorage.setItem("theme", $HTML.dataset.theme);
}

const changeTheme = () => {
    $HTML.dataset.theme = sessionStorage.getItem("theme") == "light" ? "dark": "light";
    sessionStorage.setItem("theme", $HTML.dataset.theme);

}
$themeBtn.addEventListener("click", changeTheme);





const $tabBtn = document.querySelectorAll("[data-tab-btn]");

let [lastActiveTab] = document.querySelectorAll("[data-tab-content]");
let [lastActiveTabBtn] = $tabBtn;

$tabBtn.forEach(item =>{
  item.addEventListener("click", function (){
    lastActiveTab.classList.remove("active");
    lastActiveTabBtn.classList.remove("active");

    const $tabContent = document.querySelector(`[data-tab-content = "${item.dataset.tabBtn}"]`);
    $tabContent.classList.add("active");
    this.classList.add("active");

    lastActiveTab = $tabContent;
    lastActiveTabBtn = this;

  });
});
