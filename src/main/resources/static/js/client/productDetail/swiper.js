// Product Detail Swiper Functions
// ================================

async function initializeSwiper() {
  return new Promise((resolve) => {
    if (typeof Swiper !== "undefined") {
      resolve();
    } else {
      const checkSwiper = setInterval(() => {
        if (typeof Swiper !== "undefined") {
          clearInterval(checkSwiper);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(checkSwiper);
        resolve();
      }, 1000);
    }
  }).then(() => {
    if (typeof Swiper !== "undefined") {
      const thumbsSwiper = new Swiper(".pd-thumbs", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
          640: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 6,
          },
        },
      });

      const mainSwiper = new Swiper(".pd-main", {
        spaceBetween: 10,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        thumbs: {
          swiper: thumbsSwiper,
        },
        on: {
          slideChange: function () {
            const activeIndex = this.realIndex;
            const thumbIndex = activeIndex % thumbsSwiper.slides.length;
            thumbsSwiper.slideTo(thumbIndex, 300);
          },
        },
      });

      thumbsSwiper.on("click", function (swiper, event) {
        const clickedSlide = event.target.closest(".swiper-slide");
        if (clickedSlide) {
          const slideIndex = Array.from(clickedSlide.parentNode.children).indexOf(clickedSlide);
          mainSwiper.slideTo(slideIndex, 300);
        }
      });
    }
  });
}

function waitForSwiper(timeout = 1000) {
  return new Promise((resolve) => {
    if (typeof Swiper !== "undefined") {
      resolve();
    } else {
      const checkSwiper = setInterval(() => {
        if (typeof Swiper !== "undefined") {
          clearInterval(checkSwiper);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(checkSwiper);
        resolve();
      }, timeout);
    }
  });
}

// Make functions globally available
window.initializeSwiper = initializeSwiper;
window.waitForSwiper = waitForSwiper;
