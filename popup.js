// // Copyright 2018 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.

"use strict";

let buttons = document.getElementsByClassName("button");

chrome.runtime.onConnect.addListener((port) => {
  console.log("connected ", port);
});

for (let btn of buttons) {
  btn.onclick = function (element) {
    let data = element.target.getAttribute("data");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.runtime.sendMessage({ cmd: data, tabId: tabs[0].id }, (res) => {
        console.log(res.message);
      });
    });
  };
}
