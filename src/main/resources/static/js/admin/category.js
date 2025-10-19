// Legacy category.js - This file is now deprecated
// All functionality has been moved to:
// - /js/admin/categories/ui.js (UI management)
// - /js/admin/categories/main.js (Main logic)

console.log('Legacy category.js loaded - functionality moved to categories/ui.js and categories/main.js');

// Redirect to new structure
if (typeof CategoriesMain !== 'undefined') {
    console.log('New categories structure loaded successfully');
} else {
    console.warn('New categories structure not found - please ensure categories/ui.js and categories/main.js are loaded');
}