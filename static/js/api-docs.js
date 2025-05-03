
document.addEventListener('DOMContentLoaded', function() {
    // Handle copy code buttons
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeId = this.getAttribute('data-code');
            const codeBlock = document.getElementById(codeId);
            
            if (codeBlock) {
                copyToClipboard(codeBlock.textContent);
                showCopiedToast(button);
            }
        });
    });
    
    // Smooth scroll for sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
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
});