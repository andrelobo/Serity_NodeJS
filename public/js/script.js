$('.sp-dropdown').click(function(){
  			$(this).children('i').stop().toggleClass('fa-arrow-circle-up');
  $(this).stop().toggleClass('sp-dropdown-active');
  $(this).children('.sp-dropdown-menu').stop().animate({height: "toggle", 'padding-top': "toggle", 'padding-bottom': "toggle", opacity: "toggle"}, "slow");
});

$('.toggler').click(function() {
  $('body').stop().toggleClass('sp-toggle-sidebar', 300);
});