$(window).on("load", function (e) {
    $('.header_menu__hover').hover(
      function () {
        // $('.shop-header__top').addClass('uk-background-05');
        $('.mask_menu').fadeIn(300);
      },
      function () {
        // $('.shop-header__top').removeClass('uk-background-05');
        $('.mask_menu').stop(true, true).fadeOut(300);
      }
    );
});