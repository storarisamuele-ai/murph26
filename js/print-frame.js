// print-frame.js
// Handles auto-print and teardown for all mission printable pages.
// Works both as a top-level printable tab and inside a hidden iframe.
(function () {
  'use strict';

  const isFramed = window.self !== window.top;

  function removeFrame() {
    if (!isFramed) return;
    try {
      const frame = window.frameElement;
      if (frame && frame.parentNode) {
        frame.parentNode.removeChild(frame);
      }
    } catch (e) {
      // ignore cross-origin / permission issues
    }
  }

  function closeOrRemove() {
    removeFrame();
    try {
      window.close();
    } catch (e) {
      // closing a framed or already-closed window may throw
    }
  }

  function triggerPrint() {
    const hasFontLoading = typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready !== 'undefined';

    function printAfterDelay() {
      setTimeout(function () {
        window.print();
      }, 600);
    }

    if (hasFontLoading) {
      document.fonts.ready.then(printAfterDelay);
    } else if (document.readyState === 'complete') {
      printAfterDelay();
    } else {
      window.addEventListener('load', printAfterDelay, { once: true });
    }
  }

  window.addEventListener('afterprint', closeOrRemove, { once: true });

  if (document.readyState === 'complete') {
    triggerPrint();
  } else {
    window.addEventListener('load', triggerPrint, { once: true });
  }
})();
