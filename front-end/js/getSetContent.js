var xmlRequest = new XMLHttpRequest();
var deviceProcessor;
var deviceRam;
var deviceOS;
var deviceWidth;
var deviceType;
var deviceSecurity;
var deviceCamera;

function getDeviceData() {
  $.ajax({
    type: 'GET',
    url: 'data/config.json',
    dataType: 'json',
    success: function(json) {
      deviceWidth = json[0].entities[2].info.deviceWidth;
      deviceType = json[0].entities[2].info.deviceType;
      deviceSecurity = json[0].entities[2].info.security;
      deviceCamera = json[0].factTags[3].details.featureNavInfo;
    }
  });
  populateMarkup();
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
  console.log('Setting for ' + selectedSection);
}