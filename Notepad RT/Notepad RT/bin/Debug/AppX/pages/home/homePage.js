﻿//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

/// <reference path="//Microsoft.WinJS.0.6/js/base.js" />
/// <reference path="//Microsoft.WinJS.0.6/js/ui.js" />

(function () {
    "use strict";
    
    var page = WinJS.UI.Pages.define("/pages/home/homePage.html", {
        ready: function (element, options) {

            var openFileButton = document.getElementById('openfile');
            var newFileButton = document.getElementById('newfile');
            openFileButton.addEventListener('click', pickFile);
            newFileButton.addEventListener('click', launchEditor); // Pass them directory to editorPage.html with no arguments
            
            initData();
            
        }
    });


})();

function badFileType(type) {
    // Create the message dialog and set its content

    var msg = new Windows.UI.Popups.MessageDialog("Notepad RT only opens supported source code and plain text files.", "Unsupported File Type");

    // Add commands and set their CommandIds
    msg.commands.append(new Windows.UI.Popups.UICommand("Ok", function () {

        // Do Nothing

    }, 1));

    msg.defaultCommandIndex = 1;

    // Show the message dialog
    msg.showAsync();

}

function launchEditor() {

    WinJS.Navigation.navigate("/pages/editor/editorPage.html");

}

function pickFile() {

    var currentState = Windows.UI.ViewManagement.ApplicationView.value;
    if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
        !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
        // Fail silently if we can't unsnap
        return;
    }

    // Create the picker object and set options
    var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.list;
    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
    openPicker.fileTypeFilter.replaceAll(["*"]);

    // Open the picker for the user to pick a file
    openPicker.pickSingleFileAsync().then(function (file) {
        var token;
        
        if (file) {
            console.log(file.contentType);
            
            if (file.contentType.match('text/') || file.contentType.length === 0) {
                // Application now has read/write access to the picked file(s)

                token = Windows.Storage.AccessCache.StorageApplicationPermissions.mostRecentlyUsedList.add(file, file.name);
                Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList.add(file);
                WinJS.Navigation.navigate("/pages/editor/editorPage.html", { filetoken: token });

            } else {

                badFileType(file.contentType);

            }

        } // Do nothing if a file wasn't picked

    });
}