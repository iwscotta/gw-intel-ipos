var xmlRequest = new XMLHttpRequest();
var deviceProcessor;
var deviceRam;
var deviceOS;
var deviceWidth;
var deviceType;
var deviceSecurity;
var priceDollars;
var priceCents;
var deviceCamera;
var configData;
var contentImgPath = 'images/content/';
var configFactTags;

function getDeviceData() {
  $.ajax({
    type: 'GET',
    url: 'data/config.json',
    dataType: 'text',
    contentType: "application/json",
    success: function(response) {
      json = eval(response);
      deviceWidth = json[0].entities[2].info.deviceWidth;
      deviceType = json[0].entities[2].info.deviceType;
      deviceSecurity = json[0].entities[2].info.security;
      deviceCamera = json[0].factTags[3].featureNavInfo;
      priceDollars = json[0].entities[2].info.priceDollars;
      priceCents = json[0].entities[2].info.priceCents;
      configData = json;
      configFactTags = json[0].factTags;
      populateMarkup();
    }
  });
}

function getDeviceInfo(item) {
  var result = false;
  $.each(configFactTags, function(i, tag) {
    if (tag.name === item) {
      result = tag.featureNavRolloverInfo;
    }
  });
  return result;
}

function populateMarkup() {
  var rolloverInfo;
  $.ajax({
    type: 'GET',
    url: 'data/Profile.xml',
    dataType: 'xml',
    success: function(xml){
      
		  var iposCpu = $(xml).find('cpu');
      deviceProcessor = $(iposCpu).find('name').text();
      var chipTitle = '<span class="feature-nav-label">Processor<br /></span>';
      $('<p></p>').html(chipTitle + deviceProcessor).appendTo('.processor .menu-item-front');
      rolloverInfo = getDeviceInfo('processor');
      $('.processor .menu-item-back').append('<div class="callout">' + rolloverInfo.calloutText.replace('%','<span>%</span>') + '</div><p>' + rolloverInfo.featureText + '</p>')

      var memoryTitle = '<span class="feature-nav-label">Memory<br /></span>';
  		var iposStorage = $(xml).find('storage');
      deviceRam = $(iposStorage).find('ram').text();
      deviceRam = Math.ceil(+deviceRam / 1024) + 'GB';
      iposRam = deviceRam + ' RAM';
      $('<p></p>').html(memoryTitle + iposRam).appendTo('.memory .menu-item-front');
      rolloverInfo = getDeviceInfo('memory');
      $('.memory .menu-item-back').append('<div class="callout">' + rolloverInfo.calloutText.replace('%','<span>%</span>') + '</div><p>' + rolloverInfo.featureText + '</p>')

      //Graphics
      $(xml).find('graphics').each(function() {
        var graphicsTitle = '<span class="feature-nav-label">Graphics<br /></span>';
        var iposGraphicsDescription = this.getAttribute('inUseDescription');
        $('<p></p>').html(graphicsTitle + iposGraphicsDescription).appendTo('.graphics .menu-item-front');
      });
      rolloverInfo = getDeviceInfo('graphics');
      $('.graphics .menu-item-back').append('<div class="callout">' + rolloverInfo.calloutText + '</div><p>' + rolloverInfo.featureText + '</p>')

      //Camera
      var cameraTitle = '<span class="feature-nav-label">Camera<br /></span>';
      $('<p></p>').html(cameraTitle + deviceCamera).appendTo('.camera .menu-item-front');
      rolloverInfo = getDeviceInfo('camera');
      $('.camera .menu-item-back').append('<div class="callout">' + rolloverInfo.calloutText + '</div><p>' + rolloverInfo.featureText + '</p>')

      //Device type
      var deviceTitle = '<span class="feature-nav-label">Device<br /></span>';
      $('<p></p>').html(deviceTitle + 'Tablet').appendTo('.device .menu-item-front');
      rolloverInfo = getDeviceInfo('device');
      $('.device .menu-item-back').append('<div class="callout">' + rolloverInfo.calloutText + '</div><p>' + rolloverInfo.featureText + '</p>')

      $(iposStorage).find('diskDrives').find('drive').each(function(i) {
        if(i == 0){
          var storageTitle = '<span class="feature-nav-label">Storage<br /></span>';
          var iposDiscCapacity = this.getAttribute('capacity');
          iposDiscCapacity = iposDiscCapacity + ' GB Hard Drive';
          $('<p></p>').html(storageTitle + iposDiscCapacity).appendTo('.hard-drive .menu-item-front');
        }
      });
      rolloverInfo = getDeviceInfo('hard-drive');
      $('.hard-drive .menu-item-back').append('<div class="callout">' + rolloverInfo.calloutText + '</div><p>' + rolloverInfo.featureText + '</p>')

      // OS
      var osTitle = '<span class="feature-nav-label">Operating System<br /></span>';
      var iposOS = $(xml).find('operatingSystem');
      deviceOS = $(iposOS).find('name').text();
      $('<p></p>').html(osTitle + deviceOS).appendTo('.os .menu-item-front');
      rolloverInfo = getDeviceInfo('os');
      $('.os .menu-item-back').append('<p>' + rolloverInfo.featureText + '</p>')

      // Security
      var peripheralTitle = '<span class="feature-nav-label">Security<br /></span>';
      $('<p></p>').html(peripheralTitle + deviceSecurity).appendTo('.security .menu-item-front');
      rolloverInfo = getDeviceInfo('security');
      $('.security .menu-item-back').append('<div class="callout">' + rolloverInfo.calloutText.replace('%','<span>%</span>') + '</div><p>' + rolloverInfo.featureText + '</p>')

      $('.dollars').text(priceDollars + '.');
      $('.cents').text(priceCents);
      
      $('.single-height p').each(function() {
        var parentWidth = $(this).parent().width();
        var imgWidth = $(this).siblings('img').width();
        var newPWidth = parentWidth - imgWidth * 1.75;
        //$(this).width(newPWidth);
      });
      $('.double-height img').each(function() {
        var contWidth = $(this).parent().width();
        var margin = (contWidth - $(this).width()) / 2;
        $(this).css('margin-left', margin);
      });
      alignDivContent();
    },
    error: function() {
      alert('An error occurred while processing XML file.');
    }
  });
}

function setSelectedContent(selectedSection) {
  for(var i=0; i<json[0].factTags.length; i++) {
    if(json[0].factTags[i].name == selectedSection){
      $('.content-container .title-label').text(json[0].factTags[i].featureContentTitleLabel);
      $('.content-container .tag-lines').text(json[0].factTags[i].featureContentTagLines);
      $('.content-container .overview-label').text(json[0].factTags[i].featureContentOverviewLabel);
      
      $('.content-container .first-feature .spotlight').text(json[0].factTags[i].featureContentSpotlight1);
      $('.content-container .first-feature .content-superscript').text(json[0].factTags[i].featureContentSpotlight1Super);
      $('.content-container .first-feature .top-content-labels').text(json[0].factTags[i].featureContentSpotlight1Label);
      $('.content-container .first-feature img').attr('src', contentImgPath + json[0].factTags[i].featureContentSpotlight1Image);
      $('.content-container .column-headers .first-feature').text(json[0].factTags[i].featureContentSpotlight1Title);
      
      $('.content-container .second-feature .spotlight').text(json[0].factTags[i].featureContentSpotlight2);
      $('.content-container .second-feature .content-superscript').text(json[0].factTags[i].featureContentSpotlight2Super);
      $('.content-container .second-feature .top-content-labels').text(json[0].factTags[i].featureContentSpotlight2Label);
      $('.content-container .second-feature img').attr('src', contentImgPath + json[0].factTags[i].featureContentSpotlight2Image);
      $('.content-container .column-headers .second-feature').text(json[0].factTags[i].featureContentSpotlight2Title);
      
      $('.content-container .third-feature .spotlight').text(json[0].factTags[i].featureContentSpotlight3);
      $('.content-container .third-feature .content-superscript').text(json[0].factTags[i].featureContentSpotlight3Super);
      $('.content-container .third-feature .top-content-labels').text(json[0].factTags[i].featureContentSpotlight3Label);
      $('.content-container .third-feature img').attr('src', contentImgPath + json[0].factTags[i].featureContentSpotlight3Image);
      $('.content-container .column-headers .third-feature').text(json[0].factTags[i].featureContentSpotlight3Title);
      
      // Info Card
      var infoCardImageString = "images/icons/" + json[0].factTags[i].featureCardImage;
      $('.info-card-prod').attr("src", infoCardImageString);
      $('.info-card h3').text(selectedSection);
      $('.info-card h2').text(json[0].factTags[i].featureCardProductName);
      $('.info-card > .content > p').text(json[0].factTags[i].featureCardCopy);
      $('.info-card > .content > h2').text(json[0].factTags[i].featureCardHeader);
    }
  }
}