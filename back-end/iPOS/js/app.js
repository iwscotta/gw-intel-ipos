var featuredSwiper;
var featuredSwiperTwo;
var carouselIndex;
var deviceData;
var $animation;
var $container;
var animationContainerOffset;
var currentMovieHolder;
var currentMovie;
var movie, stage, compClass, deviceMovie, memoryMovie, osMovie, processorMovie;

$(document).ready(function () {
    getDeviceData();
    setCarousel();
    setListeners();
    setOrientation();

    window.onresize = function () {
        setOrientation();
        verticallyCenterAnimation();
        alignDivContent();
    }
});

function verticallyCenterAnimation() {
    if (currentMovieHolder != undefined) {
        var $animation = currentMovieHolder.closest('.flow-wrapper');
        var $container = $('.featured-content');
        var delta;
        delta = $container.height() - $animation.height();
        $animation.css('margin-top', (delta / 2) + 'px');
    }
}

function alignDivContent() {
    $('.single-height p').each(function () {
        var parentWidth = $(this).parent().width();
        var imgWidth = $(this).siblings('img').width();
        var newPWidth = parentWidth - imgWidth * 1.75;
        $(this).width(newPWidth);
    });
    $('.double-height img').each(function () {
        var contWidth = $(this).parent().width();
        var margin = (contWidth - $(this).width()) / 2;
        $(this).css('margin-left', margin);
    });
}

function setAnimationObject(compId) {
    if (compId == 'ipos-device') {
        movie = AdobeEdge.getComposition(compId);
        deviceMovie = new Array(movie.getStage(), '.ipos-device');
    } else if (compId == 'ipos-memory') {
        movie = AdobeEdge.getComposition(compId);
        memoryMovie = new Array(movie.getStage(), '.ipos-memory');
    } else if (compId == 'ipos-os') {
        movie = AdobeEdge.getComposition(compId);
        osMovie = new Array(movie.getStage(), '.ipos-os');
    } else if (compId == 'ipos-processor') {
        movie = AdobeEdge.getComposition(compId);
        processorMovie = new Array(movie.getStage(), '.ipos-processor');
    }
}

function startMovie(movie, targ) {
    //TODO: DO NOT RESTART CURRENT MOVIE...

    if (currentMovie != undefined) {
        currentMovie.stop(1);
        currentMovieHolder.closest('.animation-holder').css('display', 'none');
    }
    $('.swiper-container').hide();
    currentMovieHolder = $(movie[1]);
    currentMovie = movie[0];
    currentMovieHolder.closest('.animation-holder').css('display', 'block');
    currentMovie.play();
    //HACK TO GET MOVIE TO SCALE PROPERLY..
    $(window).trigger('resize');

    /*
    if(currentMovie != undefined){
      currentMovie.stop(1);
      $(targ).closest('.animation-holder').css('display', 'none');
    }
    $('.swiper-container').hide();
    currentMovieHolder = $(movie[1]);
    //targetContainer = '#' + currentMovieHolder.closest('.orientation').attr('id') + ' ' + movie[1];
    currentMovie = movie[0];
    console.log('targetContainer = ' + targ);
    $('#landscape-view .ipos-device').closest('.animation-holder').css('display', 'block');
    currentMovie.play();
    //HACK TO GET MOVIE TO SCALE PROPERLY..
    $(window).trigger('resize');
    */
}

function animationComplete() {
    currentMovieHolder.closest('.animation-holder').css('display', 'none');
    $('.swiper-container').fadeIn();
}

function setOrientation() {
    if (window.innerHeight > window.innerWidth) {
        $('#portrait-view').css('display', 'block');
        $('#landscape-view').css('display', 'none');
    } else {
        $('#portrait-view').css('display', 'none');
        $('#landscape-view').css('display', 'block');
    }
}

function getDeviceData() {
    deviceData = CreateMachineSpecObj();

    if (deviceData == null) {
        return;
    }

    var chipTitle = '<span class="feature-nav-label">Processor<br /></span>';
    $('<p></p>').html(chipTitle + deviceData.cpu).appendTo('.processor');

    var memoryTitle = '<span class="feature-nav-label">Memory<br /></span>';
    var iposRam = deviceData.ram;
    iposRam = Math.ceil(+iposRam / 1024) + ' GB RAM';
    $('<p></p>').html(memoryTitle + iposRam).appendTo('.memory');

    var graphicsTitle = '<span class="feature-nav-label">Graphics<br /></span>';
    $('<p></p>').html(graphicsTitle + deviceData.graphicsdescription).appendTo('.graphics');

    //Camera
    var cameraTitle = '<span class="feature-nav-label">Camera<br /></span>';
    $('<p></p>').html(cameraTitle + '8MP Rear + 2MP Front').appendTo('.camera');

    //Device type
    var deviceTitle = '<span class="feature-nav-label">Device<br /></span>';
    $('<p></p>').html(deviceTitle + 'Tablet').appendTo('.device');

    var storageTitle = '<span class="feature-nav-label">Storage<br /></span>';
    var iposDiscCapacity = deviceData.diskcapacity;
    iposDiscCapacity = iposDiscCapacity + ' GB Hard Drive';
    $('<p></p>').html(storageTitle + iposDiscCapacity).appendTo('.hard-drive');

    // OS
    var osTitle = '<span class="feature-nav-label">Operating System<br /></span>';
    $('<p></p>').html(osTitle + deviceData.os).appendTo('.os');

    // AUX 1
    var peripheralTitle = '<span class="feature-nav-label">Peripherals<br /></span>';
    $('<p></p>').html(peripheralTitle + 'Loads of IO').appendTo('.aux1');

    // AUX 2
    var productivityTitle = '<span class="feature-nav-label">Productivity<br /></span>';
    $('<p></p>').html(productivityTitle + 'Horsepower to go.').appendTo('.aux2');

    $('.single-height p').each(function () {
        var parentWidth = $(this).parent().width();
        var imgWidth = $(this).siblings('img').width();
        var newPWidth = parentWidth - imgWidth * 1.75;
        $(this).width(newPWidth);
    });
    $('.double-height img').each(function () {
        var contWidth = $(this).parent().width();
        var margin = (contWidth - $(this).width()) / 2;
        $(this).css('margin-left', margin);
    });

    alignDivContent();
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

    featuredSwiperTwo = $('.featured-two').swiper({
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
    $('.nav2-icon[data-navId="' + id + '"]').addClass('nav2-icon-selected');
}

function setListeners() {
    $(".swiper-wrapper").click(function (evt) {
        var active = $(".swiper-slide-active + div");
        var clickRel = evt.pageX - active.offset().left;
        if (clickRel < 0) {
            featuredSwiper.swipePrev();
        }
        if (clickRel > active.width()) {
            featuredSwiper.swipeNext();
        }
    });
    //featuredSwiper.swipeNext();
    //http://www.idangero.us/sliders/swiper/api.php

    $('.features-nav-item').click(function (evt) {
        var id = $(this).attr('id');
        var thisMovie = id + 'Movie';
        var selectedMovie = window[thisMovie];
        if (selectedMovie != undefined) {
            // TO FIND MOVIE STAGE FOR SELECTED ORIENTATION
            var targetContainer = '#' + $(this).closest('.orientation').attr('id') + ' ' + selectedMovie[1];
            startMovie(selectedMovie, targetContainer);
        }
        updateMinorNav(id);
    });
    $('.nav2-icon').click(function (evt) {
        var id = $(this).attr('data-navId');
        $("#" + id).click();
    });
}

function navLink() {
    //alert('hit');
}