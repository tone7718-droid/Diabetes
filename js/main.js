// 모바일 메뉴 토글
const menuBtn = document.getElementById("menu-btn");
const menu = document.querySelector("nav.menu");
if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => menu.classList.toggle("open"));
}

// 읽기 진행 바
const bar = document.getElementById("progress");
if (bar) {
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100).toFixed(1) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}
