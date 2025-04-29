document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('sideNav');
  const overlay = document.getElementById('overlay');

  const openNav = () => {
    nav.classList.add('open');
    overlay.style.display = 'block';
    navToggle.innerHTML = '&times;';
  };
  const closeNav = () => {
    nav.classList.remove('open');
    overlay.style.display = 'none';
    navToggle.innerHTML = '&#9776;';
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.contains('open') ? closeNav() : openNav();
    });
  }
  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  /* Lightbox */
  const imgs = Array.from(document.querySelectorAll('.grid img'));
  if (imgs.length) {
    let idx = 0;
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><img />';
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('img');
    const lbClose = lb.querySelector('.lb-close');

    const show = () => {
      lbImg.src = imgs[idx].src;
      lb.classList.add('open');
    };
    const close = () => lb.classList.remove('open');

    imgs.forEach((im, i) => im.addEventListener('click', () => {{ idx = i; show(); }}));

    lbClose.addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowRight') {{ idx = (idx+1)%imgs.length; show(); }}
      else if (e.key === 'ArrowLeft') {{ idx = (idx-1+imgs.length)%imgs.length; show(); }}
      else if (e.key === 'Escape') close();
    });

    // Swipe support
    let startX = 0;
    lb.addEventListener('touchstart', e => {{ startX = e.touches[0].clientX; }});
    lb.addEventListener('touchend', e => {{
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) < 50) return;
      if (diff < 0) idx = (idx+1)%imgs.length;
      else idx = (idx-1+imgs.length)%imgs.length;
      show();
    }});
  }
});