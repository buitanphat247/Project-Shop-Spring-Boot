// Performance optimization script for users page
(function() {
  'use strict';

  // Preload critical resources
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload user data in background
      fetch('/api/users')
        .then(response => response.json())
        .then(data => {
          if (data.success && data.data && data.data.items) {
            // Store in sessionStorage for instant access
            sessionStorage.setItem('usersCache', JSON.stringify(data.data.items));
            sessionStorage.setItem('usersCacheTime', Date.now().toString());
          }
        })
        .catch(error => console.log('Preload failed:', error));
    });
  }
  
  // Performance monitoring
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page fully loaded in ${loadTime.toFixed(2)}ms`);
  });

})();
