var xmlRequest = new XMLHttpRequest();
var deviceProcessor;
var deviceRam;
var deviceOS;
var deviceWidth;
var deviceType;
var deviceSecurity;
var deviceCamera;
var configData;
var contentImgPath = 'images/content/';

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
      configData = json;
      populateMarkup();
    }
  });
}

function populateMarkup() {
  $.ajax({
    type: 'GET',
    url: 'data/Profile.xml',
    dataType: 'xml',
    success: function(xml){
      
		  var iposCpu = $(xml).find('cpu');
      deviceProcessor = $(iposCpu).find('name').text();
      var chipTitle = '<span class="feature-nav-label">Processor<br /></span>';
      $('<p></p>').html(chipTitle + deviceProcessor).appendTo('.processor');

      var memoryTitle = '<span class="feature-nav-label">Memory<br /></span>';
  		var iposStorage = $(xml).find('storage');
      deviceRam = $(iposStorage).find('ram').text();
      deviceRam = Math.ceil(+deviceRam / 1024) + 'GB';
      iposRam = deviceRam + ' RAM';
      $('<p></p>').html(memoryTitle + iposRam).appendTo('.memory');
    
      //Graphics
      $(xml).find('graphics').each(function() {
        var graphicsTitle = '<span class="feature-nav-label">Graphics<br /></span>';
        var iposGraphicsDescription = this.getAttribute('inUseDescription');
        $('<p></p>').html(graphicsTitle + iposGraphicsDescription).appendTo('.graphics');
      });
    
      //Camera
      var cameraTitle = '<span class="feature-nav-label">Camera<br /></span>';
      $('<p></p>').html(cameraTitle + deviceCamera).appendTo('.camera');
    
      //Device type
      var deviceTitle = '<span class="feature-nav-label">Device<br /></span>';
      $('<p></p>').html(deviceTitle + 'Tablet').appendTo('.device');
    
      $(iposStorage).find('diskDrives').find('drive').each(function(i) {
        if(i == 0){
          var storageTitle = '<span class="feature-nav-label">Storage<br /></span>';
          var iposDiscCapacity = this.getAttribute('capacity');
          iposDiscCapacity = iposDiscCapacity + ' GB Hard Drive';
          $('<p></p>').html(storageTitle + iposDiscCapacity).appendTo('.hard-drive');
        }
      });
    
      // OS
      var osTitle = '<span class="feature-nav-label">Operating System<br /></span>';
      var iposOS = $(xml).find('operatingSystem');
      deviceOS = $(iposOS).find('name').text();
      $('<p></p>').html(osTitle + deviceOS).appendTo('.os');
      
      // Security
      var peripheralTitle = '<span class="feature-nav-label">Security<br /></span>';
      $('<p></p>').html(peripheralTitle + deviceSecurity).appendTo('.security');
      
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
    }
  }
}