export const openCartModal = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('openCartModal called in non-browser environment');
    return;
  }

  try {
    // Check if Bootstrap is available globally first
    let bootstrap;
    if (window.bootstrap) {
      bootstrap = window.bootstrap;
    } else {
      // Try dynamic import as fallback
      bootstrap = require("bootstrap");
    }

    if (!bootstrap) {
      console.error('Bootstrap not found. Make sure Bootstrap JS is loaded.');
      return;
    }

    // Close existing modals
    const modalElements = document.querySelectorAll(".modal.show");
    modalElements.forEach((modal) => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });

    // Close any open offcanvas
    const offcanvasElements = document.querySelectorAll(".offcanvas.show");
    offcanvasElements.forEach((offcanvas) => {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    });

    // Check if the modal element exists
    const modalElement = document.getElementById("shoppingCart");
    if (!modalElement) {
      console.warn('Modal element with ID "shoppingCart" not found in DOM');
      // console.log('Available modal elements:', document.querySelectorAll('.modal'));
      return;
    }

    // Check if modal instance already exists
    let myModal = bootstrap.Modal.getInstance(modalElement);
    
    if (!myModal) {
      // Create new modal instance
      myModal = new bootstrap.Modal(modalElement, {
        keyboard: false,
        backdrop: true, // Explicitly set backdrop
      });
    }

    // Show the modal
    myModal.show();

    // Clean up event listener function
    const handleModalHidden = () => {
      // Don't dispose the modal, just clean up if needed
      console.log('Modal hidden');
    };
    
    // Remove existing listener and add new one
    modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
    modalElement.addEventListener("hidden.bs.modal", handleModalHidden, { once: true });

  } catch (error) {
    console.error('Error opening cart modal:', error);
    
    // Fallback: try to show modal using data attributes
    try {
      const modalElement = document.getElementById("shoppingCart");
      if (modalElement) {
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'cart-modal-backdrop';
        document.body.appendChild(backdrop);
        
        console.log('Modal opened using fallback method');
      }
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
    }
  }
};