// 海贝拾遗 · 基础交互（导航状态 / 滚动出现 / 返回顶部 / 轮播）

// 导航滚动后显示底边线
const nav = document.getElementById("nav");
const backTop = document.getElementById("backTop");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 10);
  backTop.classList.toggle("show", y > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// 返回顶部
backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 区块滚动出现（轻微上移淡入）
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ========= 轮播组件（照片滑动） =========
   通过 .carousel 容器自动初始化：
   - 左右箭头 + 底部圆点 + 自动轮播 + 悬停暂停 + 触摸滑动
*/
function initCarousel(root) {
  const items = Array.from(root.querySelectorAll(".carousel-item"));
  if (items.length === 0) return;
  const btnPrev = root.querySelector(".carousel-btn.prev");
  const btnNext = root.querySelector(".carousel-btn.next");
  const dotsWrap = root.querySelector(".carousel-dots");
  let idx = items.findIndex((i) => i.classList.contains("active"));
  if (idx < 0) idx = 0;
  let timer = null;

  // 生成圆点
  items.forEach((_, i) => {
    const d = document.createElement("span");
    if (i === idx) d.classList.add("active");
    d.addEventListener("click", () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    items.forEach((el, i) => el.classList.toggle("active", i === idx));
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
  }
  function go(n) {
    idx = (n + items.length) % items.length;
    render();
  }
  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }

  btnPrev && btnPrev.addEventListener("click", () => { prev(); reset(); });
  btnNext && btnNext.addEventListener("click", () => { next(); reset(); });

  function start() {
    stop();
    timer = setInterval(next, 4500);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function reset() { start(); }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  // 触摸滑动
  let tx = 0, dragging = false;
  root.addEventListener("touchstart", (e) => {
    dragging = true;
    tx = e.touches[0].clientX;
    stop();
  }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    start();
  });

  start();
  render();
}

document.querySelectorAll(".carousel").forEach(initCarousel);
