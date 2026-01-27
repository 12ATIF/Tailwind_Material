/**
 * Tailwind CSS Playground - Live Code Preview
 * Fitur "Coba Langsung" untuk tutorial Tailwind CSS
 */

// Initialize all playgrounds on page load
document.addEventListener('DOMContentLoaded', function () {
    initPlaygrounds();
});

function initPlaygrounds() {
    const playgrounds = document.querySelectorAll('.playground');
    playgrounds.forEach((playground, index) => {
        const editor = playground.querySelector('.playground-editor');
        const preview = playground.querySelector('.playground-preview iframe');
        const resetBtn = playground.querySelector('.reset-btn');
        const copyBtn = playground.querySelector('.copy-playground-btn');

        // Store original code
        if (editor) {
            playground.dataset.originalCode = editor.value;

            // Update preview on input with debounce
            let timeout;
            editor.addEventListener('input', function () {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    updatePreview(playground);
                }, 300);
            });

            // Initial preview
            updatePreview(playground);
        }

        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetCode(playground);
            });
        }

        // Copy button
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                copyPlaygroundCode(playground, copyBtn);
            });
        }
    });
}

function updatePreview(playground) {
    const editor = playground.querySelector('.playground-editor');
    const iframe = playground.querySelector('.playground-preview iframe');

    if (!editor || !iframe) return;

    const code = editor.value;

    // Build full HTML document with Tailwind CDN
    const htmlContent = `
<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: {
              500: '#667eea',
              600: '#5a67d8'
            }
          }
        }
      }
    }
  <\/script>
  <style>
    body { 
      background: #111827; 
      color: #f3f4f6; 
      font-family: 'Inter', sans-serif;
      padding: 1rem;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;

    // Update iframe
    iframe.srcdoc = htmlContent;
}

function resetCode(playground) {
    const editor = playground.querySelector('.playground-editor');
    const originalCode = playground.dataset.originalCode;

    if (editor && originalCode) {
        editor.value = originalCode;
        updatePreview(playground);

        // Show feedback
        const resetBtn = playground.querySelector('.reset-btn');
        if (resetBtn) {
            const originalText = resetBtn.textContent;
            resetBtn.textContent = '✓ Reset!';
            setTimeout(() => {
                resetBtn.textContent = originalText;
            }, 1500);
        }
    }
}

function copyPlaygroundCode(playground, btn) {
    const editor = playground.querySelector('.playground-editor');

    if (editor) {
        navigator.clipboard.writeText(editor.value);
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1500);
    }
}

// Toggle fullscreen preview
function toggleFullscreen(playground) {
    const previewArea = playground.querySelector('.playground-preview');
    if (previewArea) {
        previewArea.classList.toggle('fullscreen');
        document.body.classList.toggle('overflow-hidden');
    }
}

// Make functions globally available
window.updatePreview = updatePreview;
window.resetCode = resetCode;
window.toggleFullscreen = toggleFullscreen;
