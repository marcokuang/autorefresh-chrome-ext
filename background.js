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
let TimeInterval = (function () {
  let timeInterval = null;
  return {
    getTimeInterval: function () {
      if (timeInterval !== null) {
        return timeInterval;
      }
    },

    setTimeInterval: function (newInterval) {
      if (timeInterval !== null) {
        this.clearInterval();
      }

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
    sendResponse({ message: "clearing the interval id..." });
    TimeInterval.clearInterval();
  } else {
    sendResponse({ message: "Registering reload id" });
    let intervalId = setInterval(() => {
      // handle runtime.lastError
      chrome.tabs.get(request.tabId, () => {
        if (!chrome.runtime.lastError) {
          chrome.tabs.reload(request.tabId);
        } else {
          console.log(
            "trying to recover from message: ",
            chrome.runtime.lastError.message,
            " interval ID: ",
            TimeInterval.getTimeInterval()
          );
          TimeInterval.clearInterval();
        }
      });
    }, request.cmd * 1000);
    TimeInterval.setTimeInterval(intervalId);
  }
});
