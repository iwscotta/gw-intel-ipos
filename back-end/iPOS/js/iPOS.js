/*This javascript file is intended for platform specific operation
*/
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
    };

    function minimize(exit) {
        var x = sendToast();
        app.stop();
        window.close();
    }

    app.start();

    var page = WinJS.UI.Pages.define("index.html", {
        ready: function (element, options) {
            document.getElementById("explore").addEventListener("click", minimize, false);
        }        
    });
    
    ReadMachineSpec();

})();

function sendToast() {
    var notifications = Windows.UI.Notifications;

    var template = notifications.ToastTemplateType.toastImageAndText01;
    var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
    var toastImageElements = toastXml.getElementsByTagName("image");
    toastImageElements[0].setAttribute("src", "ms-appx:///images/150x150.png");
    toastImageElements[0].setAttribute("alt", "iPOS");

    var toastTextElements = toastXml.getElementsByTagName("text");
    toastTextElements[0].appendChild(toastXml.createTextNode("Learn more with iPOS"));

    var toastNode = toastXml.selectSingleNode("/toast");
    toastNode.setAttribute("duration", "long");

    toastXml.selectSingleNode("/toast").setAttribute("launch", '{"type":"toast","param1":"12345","param2":"67890"}');
    var toast = new notifications.ToastNotification(toastXml);

    var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
    toastNotifier.show(toast);
    return true;
}




function ReadMachineSpec() {

    var data = GetFromLocalStorage("machinespec");
    if (data != null) {
        return;
    }

    Windows.Storage.KnownFolders.documentsLibrary.getFileAsync("hardware.xml").then(

      function (file) {

          return Windows.Storage.FileIO.readTextAsync(file);

      },
      function (err) {

      }).done(function (text) {
          SaveToLocalStorage("machinespec", text);
          getDeviceData();
      } );
}

function TransferToFile() {
    var outputDiv = document.getElementById("content");
    outputDiv.innerHTML = "";
    var m = CreateAnalyticObject();

    if (m == null) {
        return;
    }

    var xml = JSON.stringify(m);

    Windows.Storage.KnownFolders.documentsLibrary.createFileAsync("machineanalytic.xml", Windows.Storage.CreationCollisionOption.openIfExists).done(
        function (file) {
            Windows.Storage.FileIO.appendTextAsync(file, xml).done(function () {
                outputDiv.innerHTML = "The file  was created.";
            },
            function (err) {
                outputDiv.innerHTML = "Error while transferring data to file.";
            });
        },
        function (error) {
            WinJS.log && WinJS.log(error, "sample", "error");
        });

}