document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  
  /* Splash Screen Logic — QA: [3s 노출 후 부드러운 페이드] */
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.style.display = 'none';
      }, 500); // Wait for transition
    }, 3000);
  }



  /* Navigation */
  const views = document.querySelectorAll('.view');
  const navItems = document.querySelectorAll('.bnav__item');

  function showView(id) {
    views.forEach(v => v.classList.remove('view--active'));
    const t = document.getElementById(id);
    if (t) { t.classList.add('view--active'); window.scrollTo(0, 0); }
  }
  function setNav(id) {
    navItems.forEach(i => i.classList.remove('bnav__item--active'));
    // QA: Use querySelector for reliable matching even with varying data structures
    const n = document.querySelector(`.bnav__item[data-goto="${id}"]`);
    if (n) n.classList.add('bnav__item--active');
  }

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const id = item.getAttribute('data-goto');
      if (id) {
        setNav(id); 
        showView(id);
      }
    });
  });

  /* Home: room card → 룸투어 */
  document.querySelectorAll('.rc[data-goto]').forEach(rc => {
    rc.addEventListener('click', () => { 
      const id = rc.getAttribute('data-goto');
      setNav(id); 
      showView(id); 
    });
  });

  /* Home: hero banner → 탐색 (QA) */
  const heroBanner = document.getElementById('hero-banner');
  if (heroBanner) {
    heroBanner.addEventListener('click', () => {
      setNav('v-search'); showView('v-search');
    });
  }

  /* Filter chips */
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const row = chip.closest('.filter-row');
      if (row) row.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--on'));
      chip.classList.add('chip--on');
    });
  });

  /* Tabs */
  document.querySelectorAll('.tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tab.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('tab--on'));
      tab.classList.add('tab--on');
    });
  });
  document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tab.closest('.shop-tabs').querySelectorAll('.shop-tab').forEach(t => t.classList.remove('shop-tab--on'));
      tab.classList.add('shop-tab--on');
    });
  });

  /* Pin & Product thumbnails */
  document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const t = document.getElementById(pin.getAttribute('data-p'));
      if (!t) return;
      document.querySelectorAll('.pcard').forEach(p => p.classList.remove('pcard--on'));
      t.classList.add('pcard--on');
      // Fix: Improved scroll alignment
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  document.querySelectorAll('.pcard').forEach(p => {
    p.addEventListener('click', () => {
      setNav('v-shop'); showView('v-shop');
    });
  });


  /* ONBOARDING — QA: 자동팝업 없음 */
  const ob = document.getElementById('onboard');
  const obBar = document.getElementById('ob-bar');
  const obS1 = document.getElementById('ob-s1');
  const obS2 = document.getElementById('ob-s2');
  const obS3 = document.getElementById('ob-s3');
  let selTone = 'oak';
  const toneData = {
    oak:    { img: 'assets/room/kam-idris-hYb7kbu4x7E-unsplash.jpg', name: '오크' },
    walnut: { img: 'assets/room/julia-60SnthS09Ao-unsplash.jpg',     name: '월넛' }
  };

  function openOnboard() {
    obS1.style.display = 'block'; obS2.style.display = 'none'; obS3.style.display = 'none';
    obBar.style.width = '33%';
    ob.style.display = 'flex';
    if (window.lucide) lucide.createIcons();
  }
  function closeOnboard() {
    ob.style.display = 'none';
    const h = document.getElementById('home-hero-img');
    if (h) h.src = toneData[selTone].img;
  }

  /* 탐색 배너 → 온보딩 오픈 (QA) */
  const obBannerBtn = document.getElementById('ob-banner-btn');
  if (obBannerBtn) obBannerBtn.addEventListener('click', openOnboard);
  
  const obClose = document.getElementById('ob-close');
  if (obClose) obClose.addEventListener('click', () => {
    ob.style.display = 'none'; // Ensure explicit close
  });

  /* Profile Edit Modal */
  const editModal = document.getElementById('edit-modal');
  const btnEditAv = document.getElementById('btn-edit-av');
  const btnEditBio = document.getElementById('btn-edit-bio');
  const modalClose = document.getElementById('modal-close');
  const btnSaveProfile = document.getElementById('btn-save-profile');
  const bioInput = document.getElementById('edit-bio-input');
  const bioDisplay = document.getElementById('user-bio');

  const inputProfileImg = document.getElementById('input-profile-img');
  const btnTriggerUpload = document.getElementById('btn-trigger-upload');
  const profileAvatars = document.querySelectorAll('.profile__av, .hd__av'); // Update both profile and header avatar

  function openEditModal() {
    if (bioDisplay && bioInput) {
       // Get text without the lucide icon's text content
       const bioText = bioDisplay.childNodes[0].textContent.trim();
       bioInput.value = bioText;
    }
    if (editModal) editModal.classList.add('modal--active');
    if (window.lucide) lucide.createIcons();
  }
  function closeEditModal() {
    if (editModal) editModal.classList.remove('modal--active');
  }

  if (btnEditAv) btnEditAv.addEventListener('click', openEditModal);
  if (btnEditBio) btnEditBio.addEventListener('click', openEditModal);
  if (modalClose) modalClose.addEventListener('click', closeEditModal);

  if (btnTriggerUpload) {
    btnTriggerUpload.addEventListener('click', () => inputProfileImg.click());
  }

  if (inputProfileImg) {
    inputProfileImg.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        profileAvatars.forEach(av => av.src = url);
      }
    });
  }

  if (btnSaveProfile) {
    btnSaveProfile.addEventListener('click', () => {
      if (bioDisplay && bioInput) {
        // Keep the icon when updating text
        const iconHtml = '<i data-lucide="pencil" class="inline-edit-icon" id="btn-edit-bio"></i>';
        bioDisplay.innerHTML = bioInput.value + ' ' + iconHtml;
        if (window.lucide) lucide.createIcons();
        // Re-attach listener to the new icon
        document.getElementById('btn-edit-bio').addEventListener('click', openEditModal);
      }
      closeEditModal();
    });
  }


  document.querySelectorAll('.ob-choice').forEach(c => {

    c.addEventListener('click', () => {
      document.querySelectorAll('.ob-choice').forEach(x => x.classList.remove('ob-choice--on'));
      c.classList.add('ob-choice--on');
      selTone = c.getAttribute('data-tone');
    });
  });
  document.querySelectorAll('.level-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.level-btn').forEach(x => x.classList.remove('level-btn--on'));
      b.classList.add('level-btn--on');
    });
  });

  const obN1 = document.getElementById('ob-n1');
  if (obN1) {
    obN1.addEventListener('click', () => {
      obS1.style.display = 'none'; obS2.style.display = 'block'; obBar.style.width = '66%';
    });
  }
  
  const obP2 = document.getElementById('ob-p2');
  if (obP2) {
    obP2.addEventListener('click', () => {
      obS2.style.display = 'none'; obS1.style.display = 'block'; obBar.style.width = '33%';
    });
  }
  
  const obN2 = document.getElementById('ob-n2');
  if (obN2) {
    obN2.addEventListener('click', () => {
      obS2.style.display = 'none'; obS3.style.display = 'block'; obBar.style.width = '100%';
      document.getElementById('ob-result-img').src = toneData[selTone].img;
      document.getElementById('ob-result-name').textContent = toneData[selTone].name;
    });
  }
  
  const obFinish = document.getElementById('ob-finish');
  if (obFinish) {
    obFinish.addEventListener('click', () => {
      closeOnboard();
      setNav('v-home'); showView('v-home');
    });
  }

  /* Support Mouse Drag Scroll for horizontal tracks (QA) */
  const track = document.querySelector('.dp-track');
  if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });
    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed factor
      track.scrollLeft = scrollLeft - walk;
    });
    // Set initial cursor
    track.style.cursor = 'grab';
  }
});
