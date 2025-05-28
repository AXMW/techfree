// Initializing the lightbox gallery.
// Available options: https://github.com/feimosi/baguetteBox.js?tab=readme-ov-file#customization

if ('baguetteBox' in window && document.querySelectorAll('[data-bss-baguettebox]').length > 0) {
   baguetteBox.run('[data-bss-baguettebox]', { animation: 'slideIn' });
}