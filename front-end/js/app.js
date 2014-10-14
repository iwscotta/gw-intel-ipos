var featuredSwiper;
var featuredSwiperTwo;
var carouselIndex;
var deviceData;
var $animation;
var $container;
var animationContainerOffset;
var currentMovieHolder;
var currentMovie;
var currentButton;
var selectedSection;
var expandPrice = true;
var activeTimeout;
var attractLoopActive = false;
var idleTime = 120;
var priceWidth;
var movie, stage, compClass, deviceMovie, memoryMovie, osMovie, processorMovie, attractionMovie, comingsoonMovie;

$(document).ready(function () {
  getDeviceData();
  setCarousel();
  setListeners();
  setOrientation();
  $('.content-container').hide();
  
  window.onresize = function() {
    setOrientation();
    verticallyCenterAnimation();
    alignDivContent();
  }

  $(document).mousemove(function(){
    clearTimeout(activeTimeout);
    if (attractLoopActive) {
        stopAttractLoop();
    }
    activeTimeout = setTimeout(function(){
        startAttractLoop();
    }, 1000 * idleTime);			
  });

});

function startAttractLoop(){
  $('.info-card-closer').trigger('click');
  currentMovie.stop(1);
  currentMovieHolder.closest('.animation-holder').css('display', 'none');
  attractLoopActive = true;
  startMovie(attractionMovie);
  selectedSection = null;
}

function stopAttractLoop(){
  resetButtons();
  currentMovie.stop(1);
  currentMovieHolder.closest('.animation-holder').css('display', 'none');
  attractLoopActive = false;
}

function verticallyCenterAnimation(){
  if(currentMovieHolder != undefined) {
    var $animation = currentMovieHolder.closest('.flow-wrapper');
    var $container = $('.featured-content');
    var delta;
    delta = $container.height() - $animation.height();
    $animation.css('margin-top', (delta / 2) + 'px');
  }
}

function alignDivContent() {
  $('.single-height p').each(function() {
    if($(this).siblings('img').attr('src') != undefined){
      var parentWidth = $(this).parent().width();
      var imgWidth = $(this).siblings('img').width();
      var newPWidth = parentWidth - imgWidth * 1.75;
      $(this).width(newPWidth);
    }
  });
  $('.double-height img').each(function() {
    var contWidth = $(this).parent().width();
    var margin = (contWidth - $(this).width()) / 2;
    $(this).css('margin-left', margin);
  });
}

function setAnimationObject(compId) {
  if(compId == 'ipos-device') {
    movie = AdobeEdge.getComposition(compId);
    deviceMovie = new Array(movie.getStage(), '.ipos-device');
  }else if(compId == 'ipos-memory') {
    movie = AdobeEdge.getComposition(compId);
    memoryMovie = new Array(movie.getStage(), '.ipos-memory');
  }else if(compId == 'ipos-os') {
    movie = AdobeEdge.getComposition(compId);
    osMovie = new Array(movie.getStage(), '.ipos-os');
  }else if(compId == 'ipos-processor') {
    movie = AdobeEdge.getComposition(compId);
    processorMovie = new Array(movie.getStage(), '.ipos-processor');
  }else if(compId == 'ipos-comingsoon') {
    movie = AdobeEdge.getComposition(compId);
    comingsoonMovie = new Array(movie.getStage(), '.ipos-comingsoon');
  }else if(compId == 'ipos-attraction') {
    movie = AdobeEdge.getComposition(compId);
    attractionMovie = new Array(movie.getStage(), '.ipos-attraction');
    attractLoopActive = true;
    startMovie(attractionMovie);
  }
}

function startMovie(movie) {
  if(currentMovie != undefined){
    currentMovie.stop(1);
    currentMovieHolder.closest('.animation-holder').css('display', 'none');
  }
  $('.content-container').hide();
  currentMovieHolder = $(movie[1]);
  currentMovie = movie[0];
  currentMovieHolder.closest('.animation-holder').css('display', 'block');
  currentMovie.play();
  //HACK TO GET MOVIE TO SCALE PROPERLY..
  $(window).trigger('resize');
}

function animationComplete() {
  if(currentMovieHolder.attr('class') == 'ipos-comingsoon') {
    currentMovie.play();
  }else {
    currentMovieHolder.closest('.animation-holder').css('display', 'none');
    $('.content-container').fadeIn();
  }
}

function setOrientation() {
  if(window.innerHeight > window.innerWidth){
    $('.portrait-nav').css('display', 'block');
    $('.landscape-nav').css('display', 'none');
  }else {
    $('.portrait-nav').css('display', 'none');
    $('.landscape-nav').css('display', 'block');
  }
}

function setCarousel() {
  featuredSwiper = $('.featured').swiper({
    loop: true,
	  slidesPerView: 3,
    initialSlide: 2,
		tdFlow: {
			rotate: 30,
			stretch: 10,
			depth: 150
		}
	});
}

function updateMinorNav(id) {
  $('.nav2-icon-selected').removeClass('nav2-icon-selected');
  $('.nav2-icon[data-navId="'+id+'"]').addClass('nav2-icon-selected');
}

function hideInfoCard() {
  $(this).closest('div.show').removeClass('show');
  $('.pagination-button').parent().show('fast').prev().each(function() {
    if(expandPrice) {
      $(this).animate({ width: priceWidth},'slow');
    }             
  });
}

function showInfoCard(contentType) {
  //$('.info-card').find('.content').html('<div>' + contentType + ' content here please!</div>');
  $('.info-card').addClass('show');
  //Show/hide pagnation button and optionally expand the price container.
  $('.pagination-button').parent().hide('slow').prev().each(function() {
    priceWidth = $(this).css('width');;
    if(expandPrice) {
      $(this).animate({ width: '100%'},'slow');
    }             
  });
}

function highlightButton(id) {
  currentButton = '#' + id;
  $(currentButton).addClass('feature-nav-active');
}

function resetButtons() {
  $('.nav2-icon-selected').removeClass('nav2-icon-selected');
  $(currentButton).removeClass('feature-nav-active');
}

function setListeners() {
  $('.main-nav').click(function(evt) {
    navLink($(evt.target).data('id'));
  });
  
  $('.swiper-wrapper').click(function(evt) {
    var active = $('.swiper-slide-active + div');
    var clickRel = evt.pageX - active.offset().left;
    if(clickRel < 0){
      featuredSwiper.swipePrev();
    }
    if(clickRel > active.width()){
      featuredSwiper.swipeNext();
    }
  });
  //featuredSwiper.swipeNext();
  //http://www.idangero.us/sliders/swiper/api.php

  $('.features-nav-item').click(function(evt) {
    // Do nothing if current button is clicked
    if(selectedSection != $(this).attr('id')) {
      resetButtons();
      $('.swiper-container').hide();
      selectedSection = $(this).attr('id');
      showInfoCard(selectedSection);
      updateMinorNav(selectedSection);
      setSelectedContent(selectedSection);
      var thisMovie = selectedSection + 'Movie';
      var selectedMovie = window[thisMovie];
      if(attractLoopActive) {
        currentMovie.stop(1);
        currentMovieHolder.closest('.animation-holder').css('display', 'none');
        attractLoopActive = false;
        if(selectedMovie != undefined) {
          $('.content-container').fadeIn();
        }else {
          startMovie(comingsoonMovie);
        }
      }else {
        if(selectedMovie != undefined){
          startMovie(selectedMovie);
        }else {
          startMovie(comingsoonMovie);
        }
      }
    }
  });
  
  $('.nav2-icon').click(function(evt){
    var id = $(this).attr('data-navId');
    $('#' + id).click();
  });
  
  $('.pagination-button').click(function(evt) {
    var elm = $('.features-nav').each(function() {
      if($(this).is(':visible')) {
        if($(this).scrollTop() === 0) {
          var to =  $(this)[0].scrollHeight - $(this).height();
          $('.pagination-button .left, .pagination-button .right').addClass('down');
          $(this).animate({'scrollTop': to});
        } else {
          $('.pagination-button .left, .pagination-button .right').removeClass('down');//('upArrow');
          $(this).animate({'scrollTop' : 0});
        }
      }
    });
  });
  
  $('.pagination-button').click(function(evt) {
    var elm = $('.features-nav').each(function() {
      var to =  $(this)[0].scrollHeight - $(this).height();
      $(this).scrollTop() == 0 ? $(this).animate({'scrollTop': to}) : $(this).animate({'scrollTop' : 0});
    });
  });
  
  $('.info-card-closer').click(function(evt) {
    hideInfoCard.call(this);
    $('.swiper-container').fadeIn();
    $('.content-container').hide();
    if(currentMovie != undefined){
      currentMovie.stop(1);
      currentMovieHolder.closest('.animation-holder').css('display', 'none');
    }
    resetButtons();
    selectedSection = null;
  });
  
}

function navLink(id) {
  $('.info-card-closer').trigger('click');
  // explore, compare, testdrive
  console.log('main nav, clicked ' + id);
}