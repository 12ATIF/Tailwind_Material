/**
 * Tailwind CSS Learning Platform
 * Progress Tracking System
 */

// Lesson Configuration
const LESSONS = [
  { id: 'getting-started', title: 'Getting Started', url: 'getting-started.html' },
  { id: 'core-concepts', title: 'Core Concepts', url: 'core-concepts.html' },
  { id: 'layout', title: 'Layout', url: 'layout.html' },
  { id: 'flexbox-grid', title: 'Flexbox & Grid', url: 'flexbox-grid.html' },
  { id: 'spacing-sizing', title: 'Spacing & Sizing', url: 'spacing-sizing.html' },
  { id: 'typography', title: 'Typography', url: 'typography.html' },
  { id: 'backgrounds-effects', title: 'Backgrounds & Effects', url: 'backgrounds-effects.html' },
  { id: 'transitions-animation', title: 'Transitions & Animation', url: 'transitions-animation.html' },
  { id: 'interactivity-svg', title: 'Interactivity & SVG', url: 'interactivity-svg.html' },
  { id: 'accessibility', title: 'Accessibility', url: 'accessibility.html' }
];

// Storage Key
const STORAGE_KEY = 'tailwind_learning_progress';

// Progress Manager Class
class ProgressManager {
  constructor() {
    this.progress = this.loadProgress();
    this.init();
  }

  // Initialize
  init() {
    this.updateUI();
    this.setupEventListeners();
  }

  // Load progress from localStorage
  loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default progress - first lesson unlocked
    const defaultProgress = {};
    LESSONS.forEach((lesson, index) => {
      defaultProgress[lesson.id] = {
        unlocked: index === 0,
        read: false,
        challengeCompleted: false
      };
    });
    return defaultProgress;
  }

  // Save progress to localStorage
  saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    this.updateUI();
  }

  // Mark lesson as read
  markAsRead(lessonId) {
    if (this.progress[lessonId]) {
      this.progress[lessonId].read = true;
      this.saveProgress();
      this.checkAndUnlockNext(lessonId);
    }
  }

  // Mark challenge as completed
  completeChallenge(lessonId) {
    if (this.progress[lessonId]) {
      this.progress[lessonId].challengeCompleted = true;
      this.saveProgress();
      this.checkAndUnlockNext(lessonId);
    }
  }

  // Check if lesson can proceed and unlock next
  checkAndUnlockNext(lessonId) {
    const lessonProgress = this.progress[lessonId];
    
    if (lessonProgress.read && lessonProgress.challengeCompleted) {
      const currentIndex = LESSONS.findIndex(l => l.id === lessonId);
      const nextLesson = LESSONS[currentIndex + 1];
      
      if (nextLesson && this.progress[nextLesson.id]) {
        this.progress[nextLesson.id].unlocked = true;
        this.saveProgress();
        this.showNotification(`🎉 Selamat! "${nextLesson.title}" sudah terbuka!`);
      }
    }
  }

  // Check if lesson is accessible
  isLessonAccessible(lessonId) {
    return this.progress[lessonId]?.unlocked || false;
  }

  // Get lesson status
  getLessonStatus(lessonId) {
    const p = this.progress[lessonId];
    if (!p) return 'locked';
    if (!p.unlocked) return 'locked';
    if (p.read && p.challengeCompleted) return 'completed';
    return 'in-progress';
  }

  // Calculate overall progress percentage
  getOverallProgress() {
    const totalSteps = LESSONS.length * 2; // read + challenge for each
    let completedSteps = 0;
    
    Object.values(this.progress).forEach(p => {
      if (p.read) completedSteps++;
      if (p.challengeCompleted) completedSteps++;
    });
    
    return Math.round((completedSteps / totalSteps) * 100);
  }

  // Get current lesson (first incomplete)
  getCurrentLesson() {
    for (const lesson of LESSONS) {
      const status = this.getLessonStatus(lesson.id);
      if (status === 'in-progress' || status === 'locked') {
        return lesson;
      }
    }
    return LESSONS[LESSONS.length - 1]; // All complete
  }

  // Update UI elements
  updateUI() {
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const percentage = this.getOverallProgress();
    
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    if (progressText) {
      progressText.textContent = `${percentage}%`;
    }

    // Update sidebar items
    LESSONS.forEach(lesson => {
      const item = document.querySelector(`[data-lesson="${lesson.id}"]`);
      if (item) {
        const status = this.getLessonStatus(lesson.id);
        item.classList.remove('locked', 'completed', 'current');
        
        if (status === 'locked') {
          item.classList.add('locked');
          item.querySelector('.status-icon')?.setAttribute('data-status', 'locked');
        } else if (status === 'completed') {
          item.classList.add('completed');
          item.querySelector('.status-icon')?.setAttribute('data-status', 'completed');
        } else {
          item.classList.add('current');
          item.querySelector('.status-icon')?.setAttribute('data-status', 'current');
        }
      }
    });

    // Update roadmap cards on index page
    this.updateRoadmapCards();

    // Update reading checkbox
    this.updateReadingCheckbox();

    // Update challenge section
    this.updateChallengeSection();

    // Update next button
    this.updateNextButton();
  }

  // Update roadmap cards
  updateRoadmapCards() {
    LESSONS.forEach(lesson => {
      const card = document.querySelector(`[data-roadmap="${lesson.id}"]`);
      if (card) {
        const status = this.getLessonStatus(lesson.id);
        const link = card.querySelector('a');
        
        card.classList.remove('locked', 'opacity-50');
        
        if (status === 'locked') {
          card.classList.add('locked', 'opacity-50');
          if (link) link.removeAttribute('href');
        } else {
          if (link) link.setAttribute('href', lesson.url);
        }

        // Update status badge
        const badge = card.querySelector('.status-badge');
        if (badge) {
          if (status === 'completed') {
            badge.textContent = '✓ Selesai';
            badge.className = 'status-badge px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400';
          } else if (status === 'in-progress') {
            badge.textContent = '📖 Sedang Dipelajari';
            badge.className = 'status-badge px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400';
          } else {
            badge.textContent = '🔒 Terkunci';
            badge.className = 'status-badge px-3 py-1 rounded-full text-sm bg-gray-500/20 text-gray-400';
          }
        }
      }
    });
  }

  // Update reading checkbox
  updateReadingCheckbox() {
    const currentLessonId = this.getCurrentLessonId();
    const checkbox = document.querySelector('#reading-checkbox');
    
    if (checkbox && currentLessonId) {
      checkbox.checked = this.progress[currentLessonId]?.read || false;
    }
  }

  // Update challenge section
  updateChallengeSection() {
    const currentLessonId = this.getCurrentLessonId();
    const challengeSection = document.querySelector('.challenge-section');
    const submitBtn = document.querySelector('#submit-challenge');
    
    if (challengeSection && currentLessonId) {
      if (this.progress[currentLessonId]?.challengeCompleted) {
        challengeSection.classList.add('challenge-completed');
        if (submitBtn) {
          submitBtn.textContent = '✓ Challenge Selesai!';
          submitBtn.disabled = true;
          submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
      }
    }
  }

  // Update next button
  updateNextButton() {
    const currentLessonId = this.getCurrentLessonId();
    const nextBtn = document.querySelector('#next-lesson');
    
    if (nextBtn && currentLessonId) {
      const lessonProgress = this.progress[currentLessonId];
      const canProceed = lessonProgress?.read && lessonProgress?.challengeCompleted;
      
      if (canProceed) {
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
        nextBtn.classList.add('cursor-pointer');
        
        const currentIndex = LESSONS.findIndex(l => l.id === currentLessonId);
        const nextLesson = LESSONS[currentIndex + 1];
        if (nextLesson) {
          nextBtn.setAttribute('href', nextLesson.url);
        }
      } else {
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
        nextBtn.removeAttribute('href');
      }
    }
  }

  // Get current page lesson ID
  getCurrentLessonId() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return LESSONS.find(l => l.id === filename)?.id || null;
  }

  // Setup event listeners
  setupEventListeners() {
    // Reading checkbox
    const readingCheckbox = document.querySelector('#reading-checkbox');
    if (readingCheckbox) {
      readingCheckbox.addEventListener('change', (e) => {
        const lessonId = this.getCurrentLessonId();
        if (lessonId && e.target.checked) {
          this.markAsRead(lessonId);
        }
      });
    }

    // Challenge submit button
    const submitBtn = document.querySelector('#submit-challenge');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const lessonId = this.getCurrentLessonId();
        if (lessonId) {
          this.completeChallenge(lessonId);
          this.showNotification('🎉 Challenge selesai!');
        }
      });
    }

    // Sidebar navigation - prevent locked lesson access
    document.querySelectorAll('[data-lesson]').forEach(item => {
      item.addEventListener('click', (e) => {
        const lessonId = item.dataset.lesson;
        if (!this.isLessonAccessible(lessonId)) {
          e.preventDefault();
          this.showNotification('🔒 Selesaikan materi sebelumnya terlebih dahulu!', 'warning');
        }
      });
    });
  }

  // Show notification
  showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl 
      ${type === 'success' ? 'bg-green-500' : 'bg-yellow-500'} text-white font-medium
      transform translate-x-full transition-transform duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Reset progress (for testing)
  resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    this.progress = this.loadProgress();
    this.updateUI();
    this.showNotification('Progress telah di-reset!');
  }
}

// Dark Mode Manager
class DarkModeManager {
  constructor() {
    this.isDark = this.loadPreference();
    this.init();
  }

  init() {
    this.applyMode();
    this.setupToggle();
  }

  loadPreference() {
    const saved = localStorage.getItem('tailwind_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  savePreference() {
    localStorage.setItem('tailwind_dark_mode', this.isDark);
  }

  applyMode() {
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggle() {
    this.isDark = !this.isDark;
    this.savePreference();
    this.applyMode();
    this.updateToggleUI();
  }

  setupToggle() {
    const toggle = document.querySelector('.dark-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
      this.updateToggleUI();
    }
  }

  updateToggleUI() {
    const toggle = document.querySelector('.dark-toggle');
    if (toggle) {
      if (this.isDark) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    }
  }
}

// Mobile Sidebar Manager
class SidebarManager {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.overlay = document.querySelector('.sidebar-overlay');
    this.openBtn = document.querySelector('.sidebar-open');
    this.closeBtn = document.querySelector('.sidebar-close');
    
    this.init();
  }

  init() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
  }

  open() {
    this.sidebar?.classList.add('open');
    this.overlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.sidebar?.classList.remove('open');
    this.overlay?.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.progressManager = new ProgressManager();
  window.darkModeManager = new DarkModeManager();
  window.sidebarManager = new SidebarManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProgressManager, DarkModeManager, SidebarManager, LESSONS };
}
