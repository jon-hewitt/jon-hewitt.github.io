document.addEventListener('DOMContentLoaded', () => {
  // === Grid enhancer: wrap images and set orientation/ratios (skip homepage) ===
  (function() {
    const path = (location.pathname || '').toLowerCase();
    const isHome = path.endsWith('/index.html') || path === '/' || path === '' || /\/?$/.test(path) && document.querySelector('.projects-grid');
    if (isHome) return;

    const grids = Array.from(document.querySelectorAll('section.grid, .grid'));
    const ratioTag = (w, h) => {
      if (!w || !h) return 'other';
      const r = w / h;
      const close = (a,b,t=0.03)=>Math.abs(a-b)<=t; // 3% tolerance
      if (close(r, 4/3) || close(r, 3/4)) return '4-3';
      if (close(r, 3/2) || close(r, 2/3)) return '3-2';
      if (close(r, 5/4) || close(r, 4/5)) return '5-4';
      return 'other';
    };

    grids.forEach(grid => {
      // Wrap direct <img> children
      Array.from(grid.querySelectorAll(':scope > img')).forEach(img => {
        const fig = document.createElement('figure');
        fig.className = 'grid-item';
        img.parentNode.insertBefore(fig, img);
        fig.appendChild(img);
      });

      // Classify items once images have dimensions
      const classify = (img) => {
        const fig = img.closest('.grid-item');
        if (!fig) return;
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) return;
        const orientation = (w >= h) ? 'landscape' : 'portrait';
        fig.classList.remove('landscape','portrait');
        fig.classList.add(orientation);
        fig.dataset.ratio = ratioTag(w,h);
      };

      grid.querySelectorAll('img').forEach(img => {
        if (img.complete) classify(img);
        img.addEventListener('load', () => classify(img), { once: true });
      });
    });
  })();

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