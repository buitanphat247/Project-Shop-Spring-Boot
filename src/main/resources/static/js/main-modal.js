// Modal Functions
function openUserModal() {
  console.log("Opening user modal...");
  const modal = document.getElementById("userModal");
  const content = document.getElementById("modalContent");

  if (!modal) {
    console.log("Modal not found!");
    return;
  }

  console.log("Modal found, showing modal...");
  modal.classList.remove("hidden", "modal-hidden");
  modal.classList.add("modal-visible");
  modal.style.display = "flex";

  setTimeout(() => {
    console.log("Adding animation classes...");
    content.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
    content.classList.add("scale-100", "opacity-100", "modal-content-visible");
  }, 10);

  console.log("User modal opened");
}

function closeUserModal() {
  console.log("Closing user modal...");
  const modal = document.getElementById("userModal");
  const content = document.getElementById("modalContent");
  content.classList.remove("scale-100", "opacity-100", "modal-content-visible");
  content.classList.add("scale-95", "opacity-0", "modal-content-hidden");
  setTimeout(() => {
    modal.classList.remove("modal-visible");
    modal.classList.add("hidden", "modal-hidden");
    console.log("User modal fully closed");
  }, 150);
}

function openSignupModal() {
  console.log("Opening signup modal...");
  const modal = document.getElementById("signupModal");
  const content = document.getElementById("signupModalContent");
  modal.classList.remove("hidden", "modal-hidden");
  modal.classList.add("modal-visible");
  modal.style.display = "flex";
  setTimeout(() => {
    content.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
    content.classList.add("scale-100", "opacity-100", "modal-content-visible");
  }, 10);
}

function closeSignupModal() {
  console.log("Closing signup modal...");
  const modal = document.getElementById("signupModal");
  const content = document.getElementById("signupModalContent");
  content.classList.remove("scale-100", "opacity-100", "modal-content-visible");
  content.classList.add("scale-95", "opacity-0", "modal-content-hidden");
  setTimeout(() => {
    modal.classList.remove("modal-visible");
    modal.classList.add("hidden", "modal-hidden");
    console.log("Signup modal fully closed");
  }, 150);
}

function switchToSignup() {
  console.log("Switching to signup...");
  // Hide user modal content with animation
  const userContent = document.getElementById("modalContent");
  userContent.classList.remove("scale-100", "opacity-100", "modal-content-visible");
  userContent.classList.add("scale-95", "opacity-0", "modal-content-hidden");

  // After animation, hide user modal and show signup modal
  setTimeout(() => {
    const userModal = document.getElementById("userModal");
    const signupModal = document.getElementById("signupModal");
    const signupContent = document.getElementById("signupModalContent");
    
    userModal.classList.remove("modal-visible");
    userModal.classList.add("hidden", "modal-hidden");
    
    signupModal.classList.remove("hidden", "modal-hidden");
    signupModal.classList.add("modal-visible");
    signupModal.style.display = "flex";
    
    setTimeout(() => {
      signupContent.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
      signupContent.classList.add("scale-100", "opacity-100", "modal-content-visible");
    }, 10);
  }, 100);
}

function switchToLogin() {
  console.log("Switching to login...");
  // Hide signup modal content with animation
  const signupContent = document.getElementById("signupModalContent");
  signupContent.classList.remove("scale-100", "opacity-100", "modal-content-visible");
  signupContent.classList.add("scale-95", "opacity-0", "modal-content-hidden");

  // After animation, hide signup modal and show user modal
  setTimeout(() => {
    const signupModal = document.getElementById("signupModal");
    const userModal = document.getElementById("userModal");
    const userContent = document.getElementById("modalContent");
    
    signupModal.classList.remove("modal-visible");
    signupModal.classList.add("hidden", "modal-hidden");
    
    userModal.classList.remove("hidden", "modal-hidden");
    userModal.classList.add("modal-visible");
    userModal.style.display = "flex";
    
    setTimeout(() => {
      userContent.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
      userContent.classList.add("scale-100", "opacity-100", "modal-content-visible");
    }, 10);
  }, 100);
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded, setting up modal events...");

  // Debug: Check if elements exist
  console.log("User icon exists:", document.getElementById("userIcon") ? 1 : 0);
  console.log("User modal exists:", document.getElementById("userModal") ? 1 : 0);
  console.log("Signup modal exists:", document.getElementById("signupModal") ? 1 : 0);
  console.log("Login form exists:", document.getElementById("loginForm") ? 1 : 0);
  console.log("Signup form exists:", document.getElementById("signupForm") ? 1 : 0);

  // User icon click event
  const userIcon = document.getElementById("userIcon");
  if (userIcon) {
    userIcon.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("User icon clicked!");
      openUserModal();
    });
    console.log("User icon event bound");
  } else {
    console.log("User icon NOT found!");
  }

  // Close modal when clicking outside
  const userModal = document.getElementById("userModal");
  if (userModal) {
    userModal.addEventListener("click", function(e) {
      if (e.target === userModal) {
        closeUserModal();
      }
    });
    console.log("User modal event bound");
  }

  const signupModal = document.getElementById("signupModal");
  if (signupModal) {
    signupModal.addEventListener("click", function(e) {
      if (e.target === signupModal) {
        closeSignupModal();
      }
    });
    console.log("Signup modal event bound");
  }

  // Switch buttons
  const switchToSignupBtn = document.getElementById("switchToSignup");
  if (switchToSignupBtn) {
    switchToSignupBtn.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("Switch to signup clicked!");
      switchToSignup();
    });
    console.log("Switch to signup event bound");
  }

  const switchToLoginBtn = document.getElementById("switchToLogin");
  if (switchToLoginBtn) {
    switchToLoginBtn.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("Switch to login clicked!");
      switchToLogin();
    });
    console.log("Switch to login event bound");
  }

  // Close buttons
  const closeUserModalBtn = document.getElementById("closeUserModal");
  if (closeUserModalBtn) {
    closeUserModalBtn.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("Close user modal clicked!");
      closeUserModal();
    });
    console.log("Close user modal event bound");
  }

  const closeSignupModalBtn = document.getElementById("closeSignupModal");
  if (closeSignupModalBtn) {
    closeSignupModalBtn.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("Close signup modal clicked!");
      closeSignupModal();
    });
    console.log("Close signup modal event bound");
  }

  // Form submissions
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      alert("Đăng nhập thành công!");
      closeUserModal();
    });
    console.log("Login form event bound");
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
      e.preventDefault();
      alert("Đăng ký thành công!");
      closeSignupModal();
    });
    console.log("Signup form event bound");
  }

  console.log("Modal setup completed!");

  // Category Dropdown - Wait for menu items to be rendered
  setTimeout(() => {
    const categoryDropdown = document.getElementById("categoryDropdown");
    const categoryMenu = document.getElementById("categoryMenu");
    const categoryArrow = document.getElementById("categoryArrow");

    if (categoryDropdown && categoryMenu && categoryArrow) {
      let isOpen = false;

    categoryDropdown.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (isOpen) {
        // Close dropdown with staggered animation - from bottom to top
        const menuItems = categoryMenu.querySelectorAll("a");
        const totalItems = menuItems.length;
        
        menuItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "0";
            item.style.transform = "translateY(20px)"; // Cuộn xuống dưới
          }, (totalItems - 1 - index) * 40); // Đảo ngược thứ tự: từ cuối lên đầu, 40ms per item
        });
        
        setTimeout(() => {
          categoryMenu.classList.remove("opacity-100", "visible", "translate-y-0");
          categoryMenu.classList.add("opacity-0", "invisible", "translate-y-[-10px]");
          categoryArrow.classList.remove("rotate-180");
          isOpen = false;
          console.log("Category dropdown closed");
        }, totalItems * 40 + 80);
      } else {
        // Open dropdown with staggered animation
        categoryMenu.classList.remove("opacity-0", "invisible", "translate-y-[-10px]");
        categoryMenu.classList.add("opacity-100", "visible", "translate-y-0");
        categoryArrow.classList.add("rotate-180");
        isOpen = true;
        
        // Reset all items to hidden state first
        const menuItems = categoryMenu.querySelectorAll("a");
        menuItems.forEach((item) => {
          item.style.opacity = "0";
          item.style.transform = "translateY(-20px)";
          item.style.transition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
        });
        
        // Animate each menu item with delay - starting from top
        menuItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, 20 + (index * 40)); // 20ms initial delay + 40ms per item
        });
        
        console.log("Category dropdown opened with staggered animation from top");
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
      if (isOpen && !categoryDropdown.contains(e.target) && !categoryMenu.contains(e.target)) {
        // Close with staggered animation - from bottom to top
        const menuItems = categoryMenu.querySelectorAll("a");
        const totalItems = menuItems.length;
        
        menuItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "0";
            item.style.transform = "translateY(20px)"; // Cuộn xuống dưới
          }, (totalItems - 1 - index) * 40); // Đảo ngược thứ tự: từ cuối lên đầu, 40ms per item
        });
        
        setTimeout(() => {
          categoryMenu.classList.remove("opacity-100", "visible", "translate-y-0");
          categoryMenu.classList.add("opacity-0", "invisible", "translate-y-[-10px]");
          categoryArrow.classList.remove("rotate-180");
          isOpen = false;
          console.log("Category dropdown closed by outside click");
        }, totalItems * 40 + 80);
      }
    });

    // Close dropdown when clicking on menu items
    const menuItems = categoryMenu.querySelectorAll("a");
    menuItems.forEach(item => {
      item.addEventListener("click", function() {
        // Close with staggered animation - from bottom to top
        const allMenuItems = categoryMenu.querySelectorAll("a");
        const totalItems = allMenuItems.length;
        
        allMenuItems.forEach((menuItem, index) => {
          setTimeout(() => {
            menuItem.style.opacity = "0";
            menuItem.style.transform = "translateY(20px)"; // Cuộn xuống dưới
          }, (totalItems - 1 - index) * 40); // Đảo ngược thứ tự: từ cuối lên đầu, 40ms per item
        });
        
        setTimeout(() => {
          categoryMenu.classList.remove("opacity-100", "visible", "translate-y-0");
          categoryMenu.classList.add("opacity-0", "invisible", "translate-y-[-10px]");
          categoryArrow.classList.remove("rotate-180");
          isOpen = false;
          console.log("Category dropdown closed by menu item click");
        }, totalItems * 40 + 80);
      });
    });

      console.log("Category dropdown events bound");
    } else {
      console.log("Category dropdown elements not found");
    }
  }, 100); // Wait 100ms for menu items to be rendered

  // Forgot Password Modal Functions
  function openForgotPasswordModal() {
    console.log("Opening forgot password modal...");
    const modal = document.getElementById("forgotPasswordModal");
    const content = document.getElementById("forgotPasswordModalContent");
    
    if (!modal) {
      console.log("Forgot password modal not found!");
      return;
    }
    
    modal.classList.remove("hidden", "modal-hidden");
    modal.classList.add("modal-visible");
    modal.style.display = "flex";
    
    setTimeout(() => {
      content.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
      content.classList.add("scale-100", "opacity-100", "modal-content-visible");
    }, 10);
  }

  function closeForgotPasswordModal() {
    console.log("Closing forgot password modal...");
    const modal = document.getElementById("forgotPasswordModal");
    const content = document.getElementById("forgotPasswordModalContent");
    
    content.classList.remove("scale-100", "opacity-100", "modal-content-visible");
    content.classList.add("scale-95", "opacity-0", "modal-content-hidden");
    
    setTimeout(() => {
      modal.classList.remove("modal-visible");
      modal.classList.add("hidden", "modal-hidden");
    }, 150);
  }

  function openOtpModal() {
    console.log("Opening OTP modal...");
    const modal = document.getElementById("otpModal");
    const content = document.getElementById("otpModalContent");
    
    if (!modal) {
      console.log("OTP modal not found!");
      return;
    }
    
    modal.classList.remove("hidden", "modal-hidden");
    modal.classList.add("modal-visible");
    modal.style.display = "flex";
    
    setTimeout(() => {
      content.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
      content.classList.add("scale-100", "opacity-100", "modal-content-visible");
    }, 10);
  }

  function closeOtpModal() {
    console.log("Closing OTP modal...");
    const modal = document.getElementById("otpModal");
    const content = document.getElementById("otpModalContent");
    
    content.classList.remove("scale-100", "opacity-100", "modal-content-visible");
    content.classList.add("scale-95", "opacity-0", "modal-content-hidden");
    
    setTimeout(() => {
      modal.classList.remove("modal-visible");
      modal.classList.add("hidden", "modal-hidden");
      
      // Show forgot password modal after closing OTP
      const forgotPasswordModal = document.getElementById("forgotPasswordModal");
      const forgotPasswordContent = document.getElementById("forgotPasswordModalContent");
      
      forgotPasswordModal.classList.remove("hidden", "modal-hidden");
      forgotPasswordModal.classList.add("modal-visible");
      forgotPasswordModal.style.display = "flex";
      
      setTimeout(() => {
        forgotPasswordContent.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
        forgotPasswordContent.classList.add("scale-100", "opacity-100", "modal-content-visible");
      }, 10);
    }, 150);
  }

  // OTP Timer
  let otpTimer = null;
  let timeLeft = 120; // 2 minutes

  function startOtpTimer() {
    const timerElement = document.getElementById("otpTimer");
    const resendBtn = document.getElementById("resendOtp");
    
    timeLeft = 120;
    resendBtn.disabled = true;
    resendBtn.classList.add("opacity-50", "cursor-not-allowed");
    
    otpTimer = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      timeLeft--;
      
      if (timeLeft < 0) {
        clearInterval(otpTimer);
        resendBtn.disabled = false;
        resendBtn.classList.remove("opacity-50", "cursor-not-allowed");
        timerElement.textContent = "Hết hạn";
      }
    }, 1000);
  }

  // Forgot Password Events
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("Forgot password clicked!");
      
      // Hide user modal content first
      const userContent = document.getElementById("modalContent");
      userContent.classList.remove("scale-100", "opacity-100", "modal-content-visible");
      userContent.classList.add("scale-95", "opacity-0", "modal-content-hidden");
      
      // After animation, hide user modal and show forgot password modal
      setTimeout(() => {
        const userModal = document.getElementById("userModal");
        const forgotPasswordModal = document.getElementById("forgotPasswordModal");
        const forgotPasswordContent = document.getElementById("forgotPasswordModalContent");
        
        userModal.classList.remove("modal-visible");
        userModal.classList.add("hidden", "modal-hidden");
        
        forgotPasswordModal.classList.remove("hidden", "modal-hidden");
        forgotPasswordModal.classList.add("modal-visible");
        forgotPasswordModal.style.display = "flex";
        
        setTimeout(() => {
          forgotPasswordContent.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
          forgotPasswordContent.classList.add("scale-100", "opacity-100", "modal-content-visible");
        }, 10);
      }, 100);
    });
  }

  const closeForgotPasswordBtn = document.getElementById("closeForgotPasswordModal");
  if (closeForgotPasswordBtn) {
    closeForgotPasswordBtn.addEventListener("click", function(e) {
      e.preventDefault();
      closeForgotPasswordModal();
    });
  }

  const backToLoginBtn = document.getElementById("backToLogin");
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Hide forgot password modal content first
      const forgotPasswordContent = document.getElementById("forgotPasswordModalContent");
      forgotPasswordContent.classList.remove("scale-100", "opacity-100", "modal-content-visible");
      forgotPasswordContent.classList.add("scale-95", "opacity-0", "modal-content-hidden");
      
      // After animation, hide forgot password modal and show user modal
      setTimeout(() => {
        const forgotPasswordModal = document.getElementById("forgotPasswordModal");
        const userModal = document.getElementById("userModal");
        const userContent = document.getElementById("modalContent");
        
        forgotPasswordModal.classList.remove("modal-visible");
        forgotPasswordModal.classList.add("hidden", "modal-hidden");
        
        userModal.classList.remove("hidden", "modal-hidden");
        userModal.classList.add("modal-visible");
        userModal.style.display = "flex";
        
        setTimeout(() => {
          userContent.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
          userContent.classList.add("scale-100", "opacity-100", "modal-content-visible");
        }, 10);
      }, 100);
    });
  }

  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const emailOrPhone = document.getElementById("forgotEmailOrPhone").value;
      
      if (!emailOrPhone) {
        alert("Vui lòng nhập email hoặc số điện thoại!");
        return;
      }
      
      // Show email/phone in OTP modal
      document.getElementById("otpEmailOrPhone").textContent = emailOrPhone;
      
      // Hide forgot password modal content first
      const forgotPasswordContent = document.getElementById("forgotPasswordModalContent");
      forgotPasswordContent.classList.remove("scale-100", "opacity-100", "modal-content-visible");
      forgotPasswordContent.classList.add("scale-95", "opacity-0", "modal-content-hidden");
      
      // After animation, hide forgot password modal and show OTP modal
      setTimeout(() => {
        const forgotPasswordModal = document.getElementById("forgotPasswordModal");
        const otpModal = document.getElementById("otpModal");
        const otpContent = document.getElementById("otpModalContent");
        
        forgotPasswordModal.classList.remove("modal-visible");
        forgotPasswordModal.classList.add("hidden", "modal-hidden");
        
        otpModal.classList.remove("hidden", "modal-hidden");
        otpModal.classList.add("modal-visible");
        otpModal.style.display = "flex";
        
        setTimeout(() => {
          otpContent.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
          otpContent.classList.add("scale-100", "opacity-100", "modal-content-visible");
          startOtpTimer();
        }, 10);
      }, 100);
      
      console.log("OTP sent to:", emailOrPhone);
    });
  }

  // OTP Modal Events
  const closeOtpBtn = document.getElementById("closeOtpModal");
  if (closeOtpBtn) {
    closeOtpBtn.addEventListener("click", function(e) {
      e.preventDefault();
      closeOtpModal();
      if (otpTimer) {
        clearInterval(otpTimer);
      }
    });
  }

  const resendOtpBtn = document.getElementById("resendOtp");
  if (resendOtpBtn) {
    resendOtpBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if (!resendOtpBtn.disabled) {
        console.log("Resending OTP...");
        startOtpTimer();
        alert("Mã OTP mới đã được gửi!");
      }
    });
  }

  const changeEmailOrPhoneBtn = document.getElementById("changeEmailOrPhone");
  if (changeEmailOrPhoneBtn) {
    changeEmailOrPhoneBtn.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Hide OTP modal content first
      const otpContent = document.getElementById("otpModalContent");
      otpContent.classList.remove("scale-100", "opacity-100", "modal-content-visible");
      otpContent.classList.add("scale-95", "opacity-0", "modal-content-hidden");
      
      // After animation, hide OTP modal and show forgot password modal
      setTimeout(() => {
        const otpModal = document.getElementById("otpModal");
        const forgotPasswordModal = document.getElementById("forgotPasswordModal");
        const forgotPasswordContent = document.getElementById("forgotPasswordModalContent");
        
        otpModal.classList.remove("modal-visible");
        otpModal.classList.add("hidden", "modal-hidden");
        
        forgotPasswordModal.classList.remove("hidden", "modal-hidden");
        forgotPasswordModal.classList.add("modal-visible");
        forgotPasswordModal.style.display = "flex";
        
        setTimeout(() => {
          forgotPasswordContent.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
          forgotPasswordContent.classList.add("scale-100", "opacity-100", "modal-content-visible");
        }, 10);
      }, 100);
      
      if (otpTimer) {
        clearInterval(otpTimer);
      }
    });
  }

  const otpForm = document.getElementById("otpForm");
  if (otpForm) {
    otpForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const otpCode = document.getElementById("otpCode").value;
      
      if (!otpCode || otpCode.length !== 6) {
        alert("Vui lòng nhập đầy đủ 6 chữ số OTP!");
        return;
      }
      
      // Simulate OTP verification
      if (otpCode === "123456") {
        alert("Xác thực OTP thành công! Mật khẩu mới đã được gửi đến email/SMS của bạn.");
        
        // Hide OTP modal content first
        const otpContent = document.getElementById("otpModalContent");
        otpContent.classList.remove("scale-100", "opacity-100", "modal-content-visible");
        otpContent.classList.add("scale-95", "opacity-0", "modal-content-hidden");
        
        // After animation, hide OTP modal and show login modal
        setTimeout(() => {
          const otpModal = document.getElementById("otpModal");
          const userModal = document.getElementById("userModal");
          const userContent = document.getElementById("modalContent");
          
          otpModal.classList.remove("modal-visible");
          otpModal.classList.add("hidden", "modal-hidden");
          
          userModal.classList.remove("hidden", "modal-hidden");
          userModal.classList.add("modal-visible");
          userModal.style.display = "flex";
          
          setTimeout(() => {
            userContent.classList.remove("scale-95", "opacity-0", "modal-content-hidden");
            userContent.classList.add("scale-100", "opacity-100", "modal-content-visible");
          }, 10);
        }, 100);
        
        if (otpTimer) {
          clearInterval(otpTimer);
        }
      } else {
        alert("Mã OTP không đúng! Vui lòng thử lại.");
      }
    });
  }

  // Close modals when clicking outside
  const forgotPasswordModal = document.getElementById("forgotPasswordModal");
  if (forgotPasswordModal) {
    forgotPasswordModal.addEventListener("click", function(e) {
      if (e.target === forgotPasswordModal) {
        closeForgotPasswordModal();
      }
    });
  }

  const otpModal = document.getElementById("otpModal");
  if (otpModal) {
    otpModal.addEventListener("click", function(e) {
      if (e.target === otpModal) {
        closeOtpModal();
        if (otpTimer) {
          clearInterval(otpTimer);
        }
      }
    });
  }

  console.log("Forgot password and OTP modal setup completed!");
});
