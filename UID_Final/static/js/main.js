// Main JavaScript for StrengthWise

document.addEventListener('DOMContentLoaded', function() {
    console.log('StrengthWise main.js loaded');
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Initialize popovers
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
    
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            } else {
                navbarCollapse.classList.add('show');
            }
        });
    }
    
    // Planner template selection
    const planTemplates = document.querySelectorAll('.card.hover-card');
    planTemplates.forEach(template => {
        template.addEventListener('click', function() {
            // Remove active class from all templates
            planTemplates.forEach(temp => temp.classList.remove('border-primary'));
            
            // Add active class to clicked template
            this.classList.add('border-primary');
        });
    });
});