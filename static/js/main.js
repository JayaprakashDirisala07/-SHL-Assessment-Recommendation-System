
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const searchBtn = document.getElementById('search-btn');
    const queryInput = document.getElementById('query');
    const resultsSection = document.getElementById('results-section');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultsContainer = document.getElementById('results-container');
    const resultsCount = document.getElementById('results-count');
    const exampleQueries = document.getElementById('example-queries');
    const toggleMetricsBtn = document.getElementById('toggle-metrics');
    const metricsCard = document.getElementById('metrics-card');
    const footerMetricsLink = document.getElementById('footer-metrics-link');
    const copyApiExampleBtn = document.getElementById('copy-api-example');
    
    // Templates
    const resultsTemplate = document.getElementById('results-template');
    const noResultsTemplate = document.getElementById('no-results-template');
    
    // Event Listeners
    searchForm.addEventListener('submit', handleSearch);
    exampleQueries.addEventListener('click', handleExampleQuery);
    toggleMetricsBtn.addEventListener('click', toggleMetrics);
    footerMetricsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showMetrics();
        window.scrollTo({
            top: document.querySelector('.metrics-section').offsetTop - 20,
            behavior: 'smooth'
        });
    });
    
    copyApiExampleBtn.addEventListener('click', function() {
        const codeBlock = document.getElementById('api-example-code');
        copyToClipboard(codeBlock.textContent);
        showCopiedToast(copyApiExampleBtn);
    });
    
    // Handle search form submission
    function handleSearch(e) {
        e.preventDefault();
        const query = queryInput.value.trim();
        
        if (!query) {
            showToast('Please enter a search query', 'warning');
            return;
        }
        
        // Show results section and loading indicator
        resultsSection.style.display = 'block';
        loadingIndicator.style.display = 'flex';
        resultsContainer.innerHTML = '';
        
        // Scroll to results
        window.scrollTo({
            top: resultsSection.offsetTop - 20,
            behavior: 'smooth'
        });
        
        // Disable search button
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin-right: 10px;"></div> Searching...';
        
        // Send API request
        fetch('/api/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Re-enable search button
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Find Assessments';
            
            // Display results
            if (data.status === 'success' && data.recommendations && data.recommendations.length > 0) {
                displayResults(data.recommendations);
                showToast(`Found ${data.recommendations.length} matching assessments`, 'success');
            } else {
                displayNoResults();
                showToast('No matching assessments found', 'info');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loadingIndicator.style.display = 'none';
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Find Assessments';
            displayNoResults();
            showToast('An error occurred. Please try again.', 'error');
        });
    }
    
    // Handle clicking on example queries
    function handleExampleQuery(e) {
        const exampleItem = e.target.closest('.example-item');
        if (exampleItem) {
            const query = exampleItem.getAttribute('data-query');
            queryInput.value = query;
            searchForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Display results in the table
    function displayResults(assessments) {
        resultsCount.textContent = `${assessments.length} results`;
        
        // Clone the template
        const resultsDOM = document.importNode(resultsTemplate.content, true);
        const tableBody = resultsDOM.querySelector('#results-body');
        
        // Add each assessment to the table
        assessments.forEach(assessment => {
            const row = document.createElement('tr');
            
            // Assessment name with link
            const nameCell = document.createElement('td');
            const nameLink = document.createElement('a');
            nameLink.href = assessment.url;
            nameLink.target = '_blank';
            nameLink.textContent = assessment.name;
            nameCell.appendChild(nameLink);
            row.appendChild(nameCell);
            
            // Test type
            const typeCell = document.createElement('td');
            const typeBadge = document.createElement('span');
            typeBadge.className = 'badge badge-outline';
            typeBadge.textContent = assessment.testType;
            typeCell.appendChild(typeBadge);
            row.appendChild(typeCell);
            
            // Duration
            const durationCell = document.createElement('td');
            durationCell.textContent = assessment.duration;
            row.appendChild(durationCell);
            
            // Remote testing support
            const remoteCell = document.createElement('td');
            const remoteSpan = document.createElement('span');
            if (assessment.remoteTestingSupport) {
                remoteSpan.className = 'badge badge-success';
                remoteSpan.innerHTML = '<i class="fas fa-check"></i> Yes';
            } else {
                remoteSpan.className = 'badge badge-danger';
                remoteSpan.innerHTML = '<i class="fas fa-times"></i> No';
            }
            remoteCell.appendChild(remoteSpan);
            row.appendChild(remoteCell);
            
            // Adaptive support
            const adaptiveCell = document.createElement('td');
            const adaptiveSpan = document.createElement('span');
            if (assessment.adaptiveSupport) {
                adaptiveSpan.className = 'badge badge-success';
                adaptiveSpan.innerHTML = '<i class="fas fa-check"></i> Yes';
            } else {
                adaptiveSpan.className = 'badge badge-danger';
                adaptiveSpan.innerHTML = '<i class="fas fa-times"></i> No';
            }
            adaptiveCell.appendChild(adaptiveSpan);
            row.appendChild(adaptiveCell);
            
            tableBody.appendChild(row);
        });
        
        resultsContainer.appendChild(resultsDOM);
    }
    
    // Display no results message
    function displayNoResults() {
        resultsCount.textContent = '0 results';
        const noResultsDOM = document.importNode(noResultsTemplate.content, true);
        resultsContainer.appendChild(noResultsDOM);
    }
    
    // Toggle metrics visibility
    function toggleMetrics() {
        if (metricsCard.style.display === 'none') {
            showMetrics();
        } else {
            metricsCard.style.display = 'none';
            toggleMetricsBtn.innerHTML = '<i class="fas fa-chart-line"></i> View System Performance Metrics';
        }
    }
    
    // Show metrics and fetch data
    function showMetrics() {
        metricsCard.style.display = 'block';
        toggleMetricsBtn.innerHTML = '<i class="fas fa-chart-line"></i> Hide System Performance Metrics';
        
        const recallLoading = document.getElementById('recall-loading');
        const mapLoading = document.getElementById('map-loading');
        const recallValue = document.getElementById('recall-value');
        const mapValue = document.getElementById('map-value');
        
        // Show loading indicators
        recallLoading.style.display = 'block';
        mapLoading.style.display = 'block';
        recallValue.style.display = 'none';
        mapValue.style.display = 'none';
        
        // Fetch metrics data
        fetch('/api/evaluation')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.metrics) {
                    // Hide loading indicators
                    recallLoading.style.display = 'none';
                    mapLoading.style.display = 'none';
                    
                    // Format and display metrics
                    recallValue.textContent = `${(data.metrics.meanRecallAtK * 100).toFixed(2)}%`;
                    mapValue.textContent = `${(data.metrics.mapAtK * 100).toFixed(2)}%`;
                    
                    // Show values
                    recallValue.style.display = 'block';
                    mapValue.style.display = 'block';
                } else {
                    showToast('Failed to load metrics data', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('An error occurred while fetching metrics', 'error');
            });
    }
    
    // Toast notification system
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Style the toast container
            toastContainer.style.position = 'fixed';
            toastContainer.style.top = '20px';
            toastContainer.style.right = '20px';
            toastContainer.style.zIndex = '1000';
            toastContainer.style.display = 'flex';
            toastContainer.style.flexDirection = 'column';
            toastContainer.style.alignItems = 'flex-end';
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Set icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'error') icon = 'times-circle';
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${icon} toast-icon"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Style the toast
        toast.style.backgroundColor = '#fff';
        toast.style.color = '#333';
        toast.style.padding = '10px 15px';
        toast.style.borderRadius = '5px';
        toast.style.marginBottom = '10px';
        toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        toast.style.minWidth = '250px';
        toast.style.maxWidth = '350px';
        toast.style.animation = 'fadeIn 0.3s ease-out forwards';
        
        // Style based on type
        if (type === 'success') {
            toast.style.borderLeft = '4px solid var(--success)';
        } else if (type === 'warning') {
            toast.style.borderLeft = '4px solid var(--warning)';
        } else if (type === 'error') {
            toast.style.borderLeft = '4px solid var(--danger)';
        } else {
            toast.style.borderLeft = '4px solid var(--info)';
        }
        
        // Style the toast content
        const toastContent = toast.querySelector('.toast-content');
        toastContent.style.display = 'flex';
        toastContent.style.alignItems = 'center';
        
        // Style the icon
        const toastIcon = toast.querySelector('.toast-icon');
        toastIcon.style.marginRight = '10px';
        if (type === 'success') {
            toastIcon.style.color = 'var(--success)';
        } else if (type === 'warning') {
            toastIcon.style.color = 'var(--warning)';
        } else if (type === 'error') {
            toastIcon.style.color = 'var(--danger)';
        } else {
            toastIcon.style.color = 'var(--info)';
        }
        
        // Style the close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.style.marginLeft = 'auto';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = '#999';
        closeBtn.style.padding = '0';
        
        // Add close functionality
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        });
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toast.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    if (toastContainer.contains(toast)) {
                        toastContainer.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Copy to clipboard function
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // Show copied toast
    function showCopiedToast(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
        
        showToast('Code copied to clipboard', 'success');
    }
});