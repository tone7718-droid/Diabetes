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
    const max = h.scrollHeight - h.clientHeight;
    const scrolled = max > 0 ? h.scrollTop / max : 0;
    bar.style.width = (scrolled * 100).toFixed(1) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// 스크롤 등장 애니메이션 (본문의 주요 블록에 부드러운 페이드인)
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const main = document.querySelector("main");
if (main && !reduce && "IntersectionObserver" in window) {
  const targets = Array.from(
    main.querySelectorAll("h2, h3, p, ul, ol, .card, .box, .table-wrap, .pager")
  ).filter((el) => el.matches(".card, .box") || !el.closest(".card, .box"));
  targets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );

  targets.forEach((el) => io.observe(el));

  // 이미 화면에 보이는 요소는 즉시 표시 (첫 화면 깜빡임 방지)
  requestAnimationFrame(() => {
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add("in");
      }
    });
  });
}
