// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ["http", "https"] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

// using singleton pattern
let timeInterval = (function () {
  let timeInterval = null;
  return {
    getTimeInterval: function () {
      if (timeInterval !== null) {
        return timeInterval;
      }
    },

    setTimeInterval: function (newInterval) {
      timeInterval = newInterval;
    },

    clearInterval: function () {
      clearInterval(timeInterval);
    },
  };
})();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.cmd, request.tabId);

  if (request.cmd === "cancel") {
    timeInterval.clearInterval();
  } else {
    timeInterval.setTimeInterval(
      setInterval(() => {
        console.log("calling reload");
        chrome.tabs.reload(request.tabId);
      }, request.cmd * 1000)
    );
  }
});
