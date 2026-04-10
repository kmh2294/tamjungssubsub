// Force video autoplay (mobile fallback)
document.querySelectorAll('video[autoplay]').forEach(v => {
    v.play().catch(() => {});
    document.addEventListener('touchstart', () => v.play().catch(() => {}), { once: true });
});

// Nav scroll
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});
function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Counter animation
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const dur = 1800;
                const startTime = performance.now();
                function tick(now) {
                    const p = Math.min((now - startTime) / dur, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.floor(ease * target).toLocaleString();
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                obs.unobserve(el);
            }
        }, { threshold: 0.5 });
        obs.observe(el);
    });
}
animateCounters();

// ─── 구글 스프레드시트 상담 신청 ───
// 아래 URL을 Apps Script 배포 URL로 교체하세요
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEJdHii8eHdIpRi1XLTOwKd7ZDxhv6HaSl-Rc8rF2ZBS79G1dAYH5dVCVIsRDOIeCA/exec';

document.getElementById('submit-btn').addEventListener('click', function() {
    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const agree = document.getElementById('agree').checked;

    if (!name) return alert('성함을 입력해주세요.');
    if (!phone) return alert('연락처를 입력해주세요.');
    if (!agree) return alert('개인정보처리방침에 동의해주세요.');

    const btn = this;
    btn.disabled = true;
    btn.textContent = '전송 중...';

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            phone: phone,
            message: message || '(내용 없음)'
        })
    }).then(() => {
        alert('상담 신청이 완료되었습니다.\n빠른 시간 내 연락드리겠습니다.');
        document.getElementById('form-name').value = '';
        document.getElementById('form-phone').value = '';
        document.getElementById('form-message').value = '';
        btn.textContent = '무료 상담 예약';
        btn.disabled = false;
    }).catch(() => {
        alert('전송에 실패했습니다. 전화 또는 카카오톡으로 문의해주세요.');
        btn.textContent = '무료 상담 예약';
        btn.disabled = false;
    });
});
