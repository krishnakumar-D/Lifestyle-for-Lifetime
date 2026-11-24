/* Accessible, opt-in viewer for informative images; decorative/icons and navigation logos are excluded. */
(() => {
  const supportsDialog = typeof HTMLDialogElement !== 'undefined';
  if (!supportsDialog) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'lfl-figure-dialog';
  dialog.setAttribute('aria-label', 'Enlarged website illustration');
  dialog.innerHTML = '<div class="lfl-figure-dialog-content"><div class="lfl-figure-toolbar"><span class="lfl-figure-title" id="lfl-figure-title">Image</span><button type="button" class="lfl-figure-close" aria-label="Close image viewer">Close ×</button></div><div class="lfl-figure-stage"><img alt="" /></div><a class="lfl-figure-original" target="_blank" rel="noopener noreferrer">Open original image in new tab ↗</a></div>';
  document.body.append(dialog);
  const preview = dialog.querySelector('.lfl-figure-stage img');
  const label = dialog.querySelector('.lfl-figure-title');
  const raw = dialog.querySelector('.lfl-figure-original');
  const close = dialog.querySelector('.lfl-figure-close');
  const open = (img) => {
    const src = img.currentSrc || img.src;
    if (!src) return;
    const caption = img.alt || 'Website illustration';
    preview.src = src;
    preview.alt = caption;
    label.textContent = caption;
    raw.href = src;
    dialog.showModal();
    close.focus();
  };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {if (e.target === dialog) dialog.close();});
  // Service cards: image or "View image" opens viewer; "Explore service" remains normal navigation.
  document.querySelectorAll('[data-lfl-view-image]').forEach(button => {
    const img = button.closest('.lfl-approved-service-tile')?.querySelector('img');
    if (img) button.addEventListener('click', () => open(img));
  });
  // Offer viewing for sizeable, informative images in page content, not icons or existing navigation links.
  document.querySelectorAll('main img').forEach(img => {
    if (img.closest('.lfl-approved-service-tile, a, button, .framework-step-symbol, .foundation-deep-icon')) return;
    if (!img.alt || img.getAttribute('aria-hidden') === 'true') return;
    if ((Number(img.getAttribute('width')) || img.naturalWidth || 400) < 160) return;
    img.setAttribute('role', 'button');
    img.tabIndex = 0;
    img.classList.add('lfl-enlargeable-image');
    img.setAttribute('aria-label', 'View enlarged image: ' + img.alt);
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); open(img);}
    });
  });
})();
