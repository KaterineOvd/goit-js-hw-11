const inputCheckbox = document.querySelector(".checkbox");
const body = document.querySelector("body");

export default function onInputChange() {
    if (inputCheckbox.checked) {
      body.classList.replace("light-theme", "dark-theme");
      localStorage.setItem('theme', "dark-theme");
    } else {
      body.classList.replace("dark-theme", "light-theme");
      localStorage.setItem('theme', "light-theme");
    }
  }