let activeMenu = null;
let hideTimeout = null;

function removeMenu() {
  clearTimeout(hideTimeout);
  hideTimeout = null;
  if (activeMenu) {
    activeMenu.remove();
    activeMenu = null;
  }
}

function cancelMenuHide() {
  clearTimeout(hideTimeout);
  hideTimeout = null;
  if (activeMenu) activeMenu.style.opacity = "1";
}

function scheduleMenuHide() {
  if (!activeMenu) return;
  hideTimeout = setTimeout(() => {
    if (activeMenu) activeMenu.style.opacity = "0";
    hideTimeout = setTimeout(removeMenu, 200);
  }, 300);
}

function showMenu(x, y, options) {
  removeMenu();

  const menu = document.createElement("div");
  menu.className = "highlight-menu";
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  menu.addEventListener("mouseup", (event) => event.stopPropagation());
  menu.addEventListener("mouseenter", cancelMenuHide);
  menu.addEventListener("mouseleave", scheduleMenuHide);

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className =
      "menu-btn" +
      (option.isColorCircle ? " color" : "") +
      (option.alignBottom ? " align-bottom" : "") +
      (option.active ? " active" : "");

    if (option.isColorCircle) {
      button.innerHTML = `<span class="color-fill" style="background:${option.color}"></span>`;
    } else if (option.isIcon) {
      button.innerHTML = option.icon;
    } else {
      button.textContent = option.label;
    }

    button.addEventListener("click", () => {
      option.onClick();
      removeMenu();
    });
    menu.appendChild(button);
  });

  document.body.appendChild(menu);
  activeMenu = menu;
}

document.addEventListener("mousedown", (event) => {
  if (activeMenu && !activeMenu.contains(event.target)) {
    removeMenu();
  }
});
