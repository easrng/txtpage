export default (() => {
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/.
   *
   * Based on code from:
   *  - https://searchfox.org/mozilla-central/source/intl/locale/PluralForm.jsm
   *  - https://searchfox.org/mozilla-central/source/toolkit/components/reader/AboutReader.jsm
   *  - https://searchfox.org/mozilla-central/source/toolkit/locales/en-US/chrome/global/aboutReader.properties
   */
  console.log("inpage js loaded");
  let gStrings = (() => {
    let strings = Object.fromEntries(
      `aboutReader.loading2=Loading…
aboutReader.loadError=Failed to load article from page

aboutReader.colorScheme.light=Light
aboutReader.colorScheme.dark=Dark
aboutReader.colorScheme.sepia=Sepia
aboutReader.colorScheme.auto=Auto

aboutReader.estimatedReadTimeValue1=#1 minute;#1 minutes

aboutReader.estimatedReadTimeRange1=#1-#2 minute;#1-#2 minutes

aboutReader.fontType.serif=Serif
aboutReader.fontType.sans-serif=Sans-serif

aboutReader.fontTypeSample=Aa

aboutReader.toolbar.close=Close Reader View
aboutReader.toolbar.typeControls=Type controls

readerView.savetopocket.label=Save To %S
readerView.done.label=Done
readerView.enter=Enter Reader View
readerView.enter.accesskey=R
readerView.close=Close Reader View
readerView.close.accesskey=R

aboutReader.toolbar.minus = Decrease Font Size
aboutReader.toolbar.plus = Increase Font Size
aboutReader.toolbar.contentwidthminus = Decrease Content Width
aboutReader.toolbar.contentwidthplus = Increase Content Width
aboutReader.toolbar.lineheightminus = Decrease Line Height
aboutReader.toolbar.lineheightplus = Increase Line Height
aboutReader.toolbar.colorschemelight = Color Scheme Light
aboutReader.toolbar.colorschemedark = Color Scheme Dark
aboutReader.toolbar.colorschemesepia = Color Scheme Sepia`
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e)
        .map((e) => e.split("=").map((e) => e.trim()))
    );
    return { GetStringFromName: (s) => strings[s] };
  })();

  let PluralForm = (() => {
    /**
     * This module provides the PluralForm object which contains a method to figure
     * out which plural form of a word to use for a given number based on the
     * current localization. There is also a makeGetter method that creates a get
     * function for the desired plural rule. This is useful for extensions that
     * specify their own plural rule instead of relying on the browser default.
     * (I.e., the extension hasn't been localized to the browser's locale.)
     *
     * See: http://developer.mozilla.org/en/docs/Localization_and_Plurals
     *
     * NOTE: any change to these plural forms need to be reflected in
     * compare-locales:
     * https://hg.mozilla.org/l10n/compare-locales/file/default/compare_locales/plurals.py
     *
     * List of methods:
     *
     * string pluralForm
     * get(int aNum, string aWords)
     *
     * int numForms
     * numForms()
     *
     * [string pluralForm get(int aNum, string aWords), int numForms numForms()]
     * makeGetter(int aRuleNum)
     * Note: Basically, makeGetter returns 2 functions that do "get" and "numForm"
     */

    //const kIntlProperties = "chrome://global/locale/intl.properties";

    // These are the available plural functions that give the appropriate index
    // based on the plural rule number specified. The first element is the number
    // of plural forms and the second is the function to figure out the index.
    /* eslint-disable no-nested-ternary */
    var gFunctions = [
      // 0: Chinese
      [1, (n) => 0],
      // 1: English
      [2, (n) => (n != 1 ? 1 : 0)],
      // 2: French
      [2, (n) => (n > 1 ? 1 : 0)],
      // 3: Latvian
      [3, (n) => (n % 10 == 1 && n % 100 != 11 ? 1 : n % 10 == 0 ? 0 : 2)],
      // 4: Scottish Gaelic
      [
        4,
        (n) =>
          n == 1 || n == 11
            ? 0
            : n == 2 || n == 12
            ? 1
            : n > 0 && n < 20
            ? 2
            : 3,
      ],
      // 5: Romanian
      [
        3,
        (n) => (n == 1 ? 0 : n == 0 || (n % 100 > 0 && n % 100 < 20) ? 1 : 2),
      ],
      // 6: Lithuanian
      [
        3,
        (n) =>
          n % 10 == 1 && n % 100 != 11
            ? 0
            : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)
            ? 2
            : 1,
      ],
      // 7: Russian
      [
        3,
        (n) =>
          n % 10 == 1 && n % 100 != 11
            ? 0
            : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
            ? 1
            : 2,
      ],
      // 8: Slovak
      [3, (n) => (n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2)],
      // 9: Polish
      [
        3,
        (n) =>
          n == 1
            ? 0
            : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
            ? 1
            : 2,
      ],
      // 10: Slovenian
      [
        4,
        (n) =>
          n % 100 == 1
            ? 0
            : n % 100 == 2
            ? 1
            : n % 100 == 3 || n % 100 == 4
            ? 2
            : 3,
      ],
      // 11: Irish Gaeilge
      [
        5,
        (n) =>
          n == 1
            ? 0
            : n == 2
            ? 1
            : n >= 3 && n <= 6
            ? 2
            : n >= 7 && n <= 10
            ? 3
            : 4,
      ],
      // 12: Arabic
      [
        6,
        (n) =>
          n == 0
            ? 5
            : n == 1
            ? 0
            : n == 2
            ? 1
            : n % 100 >= 3 && n % 100 <= 10
            ? 2
            : n % 100 >= 11 && n % 100 <= 99
            ? 3
            : 4,
      ],
      // 13: Maltese
      [
        4,
        (n) =>
          n == 1
            ? 0
            : n == 0 || (n % 100 > 0 && n % 100 <= 10)
            ? 1
            : n % 100 > 10 && n % 100 < 20
            ? 2
            : 3,
      ],
      // 14: Unused
      [3, (n) => (n % 10 == 1 ? 0 : n % 10 == 2 ? 1 : 2)],
      // 15: Icelandic, Macedonian
      [2, (n) => (n % 10 == 1 && n % 100 != 11 ? 0 : 1)],
      // 16: Breton
      [
        5,
        (n) =>
          n % 10 == 1 && n % 100 != 11 && n % 100 != 71 && n % 100 != 91
            ? 0
            : n % 10 == 2 && n % 100 != 12 && n % 100 != 72 && n % 100 != 92
            ? 1
            : (n % 10 == 3 || n % 10 == 4 || n % 10 == 9) &&
              n % 100 != 13 &&
              n % 100 != 14 &&
              n % 100 != 19 &&
              n % 100 != 73 &&
              n % 100 != 74 &&
              n % 100 != 79 &&
              n % 100 != 93 &&
              n % 100 != 94 &&
              n % 100 != 99
            ? 2
            : n % 1000000 == 0 && n != 0
            ? 3
            : 4,
      ],
      // 17: Shuar
      [2, (n) => (n != 0 ? 1 : 0)],
      // 18: Welsh
      [
        6,
        (n) =>
          n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n == 3 ? 3 : n == 6 ? 4 : 5,
      ],
      // 19: Slavic languages (bs, hr, sr). Same as rule 7, but resulting in different CLDR categories
      [
        3,
        (n) =>
          n % 10 == 1 && n % 100 != 11
            ? 0
            : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
            ? 1
            : 2,
      ],
    ];
    /* eslint-enable no-nested-ternary */

    var PluralForm = {
      /**
       * Get the correct plural form of a word based on the number
       *
       * @param aNum
       *        The number to decide which plural form to use
       * @param aWords
       *        A semi-colon (;) separated string of words to pick the plural form
       * @return The appropriate plural form of the word
       */
      get get() {
        // This method will lazily load to avoid perf when it is first needed and
        // creates getPluralForm function. The function it creates is based on the
        // value of pluralRule specified in the intl stringbundle.
        // See: http://developer.mozilla.org/en/docs/Localization_and_Plurals

        // Delete the getters to be overwritten
        delete PluralForm.numForms;
        delete PluralForm.get;

        // Make the plural form get function and set it as the default get
        [PluralForm.get, PluralForm.numForms] = PluralForm.makeGetter(
          PluralForm.ruleNum
        );
        return PluralForm.get;
      },

      /**
       * Create a pair of plural form functions for the given plural rule number.
       *
       * @param aRuleNum
       *        The plural rule number to create functions
       * @return A pair: [function that gets the right plural form,
       *                  function that returns the number of plural forms]
       */
      makeGetter(aRuleNum) {
        // Default to "all plural" if the value is out of bounds or invalid
        if (aRuleNum < 0 || aRuleNum >= gFunctions.length || isNaN(aRuleNum)) {
          log(["Invalid rule number: ", aRuleNum, " -- defaulting to 0"]);
          aRuleNum = 0;
        }

        // Get the desired pluralRule function
        let [numForms, pluralFunc] = gFunctions[aRuleNum];

        // Return functions that give 1) the number of forms and 2) gets the right
        // plural form
        return [
          function (aNum, aWords) {
            // Figure out which index to use for the semi-colon separated words
            let index = pluralFunc(aNum ? Number(aNum) : 0);
            let words = aWords ? aWords.split(/;/) : [""];

            // Explicitly check bounds to avoid strict warnings
            let ret = index < words.length ? words[index] : undefined;

            // Check for array out of bounds or empty strings
            if (ret == undefined || ret == "") {
              // Report the caller to help figure out who is causing badness
              let caller = "top";

              // Display a message in the error console
              log([
                "Index #",
                index,
                " of '",
                aWords,
                "' for value ",
                aNum,
                " is invalid -- plural rule #",
                aRuleNum,
                "; called by ",
                caller,
              ]);

              // Default to the first entry (which might be empty, but not undefined)
              ret = words[0];
            }

            return ret;
          },
          () => numForms,
        ];
      },

      /**
       * Get the number of forms for the current plural rule
       *
       * @return The number of forms
       */
      get numForms() {
        // We lazily load numForms, so trigger the init logic with get()
        PluralForm.get();
        return PluralForm.numForms;
      },

      /**
       * Get the plural rule number from the intl stringbundle
       *
       * @return The plural rule number
       */
      get ruleNum() {
        return Number(
          1
          /*Services.strings
        .createBundle(kIntlProperties)
        .GetStringFromName("pluralRule")*/
        );
      },
    };

    /**
     * Private helper function to log errors to the error console and command line
     *
     * @param aMsg
     *        Error message to log or an array of strings to concat
     */
    function log(aMsg) {
      let msg = "PluralForm.jsm: " + (aMsg.join ? aMsg.join("") : aMsg);
      console.log(msg);
    }

    return PluralForm;
  })();

  let AboutReader = (() => {
    let isAppLocaleRTL = false;
    function getWeakReference(o) {
      // I hope this is ok and doesn't cause mem leaks
      return { get: () => o };
    }
    var AboutReader = function (mm, win, articlePromise) {
      let doc = win.document; /*
  this._mm = mm;
  this._mm.addMessageListener("Reader:CloseDropdown", this);
  this._mm.addMessageListener("Reader:AddButton", this);
  this._mm.addMessageListener("Reader:RemoveButton", this);
  this._mm.addMessageListener("Reader:GetStoredArticleData", this);
  this._mm.addMessageListener("Reader:ZoomIn", this);
  this._mm.addMessageListener("Reader:ZoomOut", this);
  this._mm.addMessageListener("Reader:ResetZoom", this);*/

      this._docRef = getWeakReference(doc);
      this._winRef = getWeakReference(win);

      this._article = null;
      this._languagePromise = new Promise((resolve) => {
        this._foundLanguage = resolve;
      });

      if (articlePromise) {
        this._articlePromise = articlePromise;
      }

      this._headerElementRef = getWeakReference(
        doc.querySelector(".reader-header")
      );
      this._domainElementRef = getWeakReference(
        doc.querySelector(".reader-domain")
      );
      this._titleElementRef = getWeakReference(
        doc.querySelector(".reader-title")
      );
      this._readTimeElementRef = getWeakReference(
        doc.querySelector(".reader-estimated-time")
      );
      this._creditsElementRef = getWeakReference(
        doc.querySelector(".reader-credits")
      );
      this._contentElementRef = getWeakReference(
        doc.querySelector(".moz-reader-content")
      );
      this._toolbarContainerElementRef = getWeakReference(
        doc.querySelector(".toolbar-container")
      );
      this._toolbarElementRef = getWeakReference(
        doc.querySelector(".reader-controls")
      );
      this._messageElementRef = getWeakReference(
        doc.querySelector(".reader-message")
      );
      this._containerElementRef = getWeakReference(
        doc.querySelector(".container")
      );

      doc.addEventListener("mousedown", this);
      doc.addEventListener("click", this);
      doc.addEventListener("touchstart", this);

      win.addEventListener("pagehide", this);
      win.addEventListener("resize", this);
      win.addEventListener("wheel", this, { passive: false });

      this._topScrollChange = this._topScrollChange.bind(this);
      this._intersectionObs = new win.IntersectionObserver(
        this._topScrollChange,
        {
          root: null,
          threshold: [0, 1],
        }
      );
      this._intersectionObs.observe(doc.querySelector(".top-anchor"));

      /*this._setupButton(
    "close-button",
    this._onReaderClose.bind(this),
    "aboutReader.toolbar.close"
  );*/

      // we're ready for any external setup, send a signal for that.
      //this._mm.sendAsyncMessage("Reader:OnSetup");

      let colorSchemeValues = ["light", "dark", "sepia"];
      let colorSchemeOptions = colorSchemeValues.map((value) => {
        return {
          name: gStrings.GetStringFromName("aboutReader.colorScheme." + value),
          groupName: "color-scheme",
          value,
          itemClass: value + "-button",
        };
      });

      let colorScheme =
        localStorage.getItem("_txtpage_color_scheme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      this._setupSegmentedButton(
        "color-scheme-buttons",
        colorSchemeOptions,
        colorScheme,
        this._setColorSchemePref.bind(this)
      );

      let styleButton = this._doc.querySelector(".style-button");
      this._setButtonTip(styleButton, "aboutReader.toolbar.typeControls");

      // See bug 1637089.
      // let fontTypeSample = gStrings.GetStringFromName("aboutReader.fontTypeSample");

      let fontTypeOptions = [
        {
          name: gStrings.GetStringFromName("aboutReader.fontType.sans-serif"),
          groupName: "font-type",
          value: "sans-serif",
          itemClass: "sans-serif-button",
        },
        {
          name: gStrings.GetStringFromName("aboutReader.fontType.serif"),
          groupName: "font-type",
          value: "serif",
          itemClass: "serif-button",
        },
      ];

      let fontType = localStorage.getItem("_txtpage_font_type") || "sans-serif";
      this._setupSegmentedButton(
        "font-type-buttons",
        fontTypeOptions,
        fontType,
        this._setFontType.bind(this)
      );
      this._setFontType(fontType);

      this._setupFontSizeButtons();

      this._setupContentWidthButtons();

      this._setupLineHeightButtons();

      /*if (win.speechSynthesis && Services.prefs.getBoolPref("narrate.enabled")) {
    new NarrateControls(mm, win, this._languagePromise);
  }*/

      //this._loadArticle();

      let dropdown = this._toolbarElement;

      let elemL10nMap = {
        ".minus-button": "minus",
        ".plus-button": "plus",
        ".content-width-minus-button": "contentwidthminus",
        ".content-width-plus-button": "contentwidthplus",
        ".line-height-minus-button": "lineheightminus",
        ".line-height-plus-button": "lineheightplus",
        ".light-button": "colorschemelight",
        ".dark-button": "colorschemedark",
        ".sepia-button": "colorschemesepia",
      };

      for (let [selector, stringID] of Object.entries(elemL10nMap)) {
        dropdown
          .querySelector(selector)
          .setAttribute(
            "title",
            gStrings.GetStringFromName("aboutReader.toolbar." + stringID)
          );
      }
      this._setColorSchemePref(colorScheme);
      document.body.style.opacity = "";
    };

    AboutReader.prototype = {
      _BLOCK_IMAGES_SELECTOR:
        ".content p > img:only-child, " +
        ".content p > a:only-child > img:only-child, " +
        ".content .wp-caption img, " +
        ".content figure img",

      FONT_SIZE_MIN: 1,

      FONT_SIZE_LEGACY_MAX: 9,

      FONT_SIZE_MAX: 15,

      FONT_SIZE_EXTENDED_VALUES: [32, 40, 56, 72, 96, 128],

      get _doc() {
        return this._docRef.get();
      },

      get _win() {
        return this._winRef.get();
      },

      get _headerElement() {
        return this._headerElementRef.get();
      },

      get _domainElement() {
        return this._domainElementRef.get();
      },

      get _titleElement() {
        return this._titleElementRef.get();
      },

      get _readTimeElement() {
        return this._readTimeElementRef.get();
      },

      get _creditsElement() {
        return this._creditsElementRef.get();
      },

      get _contentElement() {
        return this._contentElementRef.get();
      },

      get _toolbarElement() {
        return this._toolbarElementRef.get();
      },

      get _toolbarContainerElement() {
        return this._toolbarContainerElementRef.get();
      },

      get _messageElement() {
        return this._messageElementRef.get();
      },

      get _containerElement() {
        return this._containerElementRef.get();
      },

      get _isToolbarVertical() {
        if (this._toolbarVertical !== undefined) {
          return this._toolbarVertical;
        }
        return (this._toolbarVertical = true) /*Services.prefs.getBoolPref(
      "reader.toolbar.vertical"
    )*/;
      },

      /* Provides unique view Id.
  get viewId() {
    let _viewId = Cc["@mozilla.org/uuid-generator;1"]
      .getService(Ci.nsIUUIDGenerator)
      .generateUUID()
      .toString();
    Object.defineProperty(this, "viewId", { value: _viewId });

    return _viewId;
  },*/

      receiveMessage(message) {
        switch (message.name) {
          // Triggered by Android user pressing BACK while the banner font-dropdown is open.
          case "Reader:CloseDropdown": {
            // Just close it.
            this._closeDropdowns();
            break;
          }

          case "Reader:AddButton": {
            if (
              message.data.id &&
              message.data.image &&
              !this._doc.getElementsByClassName(message.data.id)[0]
            ) {
              let btn = this._doc.createElement("button");
              btn.dataset.buttonid = message.data.id;
              btn.className = "button " + message.data.id;
              let tip = this._doc.createElement("span");
              tip.className = "hover-label";
              tip.textContent = message.data.label;
              btn.append(tip);
              btn.setAttribute("aria-label", message.data.label);
              btn.style.backgroundImage = "url('" + message.data.image + "')";
              if (message.data.width && message.data.height) {
                btn.style.backgroundSize = `${message.data.width}px ${message.data.height}px`;
              }
              let tb = this._toolbarElement;
              tb.appendChild(btn);
              this._setupButton(message.data.id, (button) => {
                /*this._mm.sendAsyncMessage(
              "Reader:Clicked-" + button.dataset.buttonid,
              { article: this._article }
            );*/
              });
            }
            break;
          }
          case "Reader:RemoveButton": {
            if (message.data.id) {
              let btn = this._doc.getElementsByClassName(message.data.id)[0];
              if (btn) {
                btn.remove();
              }
            }
            break;
          }
          case "Reader:GetStoredArticleData": {
            /*this._mm.sendAsyncMessage("Reader:StoredArticleData", {
          article: this._article,
        });*/
            break;
          }
          case "Reader:ZoomIn": {
            this._changeFontSize(+1);
            break;
          }
          case "Reader:ZoomOut": {
            this._changeFontSize(-1);
            break;
          }
          case "Reader:ResetZoom": {
            this._resetFontSize();
            break;
          }
        }
      },

      handleEvent(aEvent) {
        if (!aEvent.isTrusted) {
          return;
        }

        let target = aEvent.target;
        switch (aEvent.type) {
          case "touchstart":
          /* fall through */
          case "mousedown":
            if (!target.closest(".dropdown-popup")) {
              this._closeDropdowns();
            }
            break;
          case "click":
            if (target.classList.contains("dropdown-toggle")) {
              this._toggleDropdownClicked(aEvent);
            }
            break;
          case "scroll":
            let lastHeight = this._lastHeight;
            this._lastHeight = this._doc.body.getBoundingClientRect().height;
            // Only close dropdowns if the scroll events are not a result of line
            // height / font-size changes that caused a page height change.
            if (lastHeight == this._lastHeight) {
              this._closeDropdowns(true);
            }

            break;
          case "resize":
            this._updateImageMargins();
            this._scheduleToolbarOverlapHandler();
            break;

          case "wheel":
            let doZoom = false;
            //  (aEvent.ctrlKey && zoomOnCtrl) || (aEvent.metaKey && zoomOnMeta);
            if (!doZoom) {
              return;
            }
            aEvent.preventDefault();

            // Throttle events to once per 150ms. This avoids excessively fast zooming.
            if (aEvent.timeStamp <= this._zoomBackoffTime) {
              return;
            }
            this._zoomBackoffTime = aEvent.timeStamp + 150;

            // Determine the direction of the delta (we don't care about its size);
            // This code is adapted from normalizeWheelEventDelta in
            // browser/extensions/pdfjs/content/web/viewer.js
            let delta = Math.abs(aEvent.deltaX) + Math.abs(aEvent.deltaY);
            let angle = Math.atan2(aEvent.deltaY, aEvent.deltaX);
            if (-0.25 * Math.PI < angle && angle < 0.75 * Math.PI) {
              delta = -delta;
            }

            if (delta > 0) {
              this._changeFontSize(+1);
            } else if (delta < 0) {
              this._changeFontSize(-1);
            }
            break;

          case "pagehide":
            this._closeDropdowns();

            this._intersectionObs.unobserve(
              this._doc.querySelector(".top-anchor")
            );
            delete this._intersectionObs;
            /*this._mm.removeMessageListener("Reader:CloseDropdown", this);
        this._mm.removeMessageListener("Reader:AddButton", this);
        this._mm.removeMessageListener("Reader:RemoveButton", this);
        this._mm.removeMessageListener("Reader:GetStoredArticleData", this);
        this._mm.removeMessageListener("Reader:ZoomIn", this);
        this._mm.removeMessageListener("Reader:ZoomOut", this);
        this._mm.removeMessageListener("Reader:ResetZoom", this);*/
            this._windowUnloaded = true;
            break;
        }
      },

      observe(subject, topic, data) {
        /*if (
      subject.QueryInterface(Ci.nsISupportsPRUint64).data != this._innerWindowId
    ) {
      return;
    }

    Services.obs.removeObserver(this, "inner-window-destroyed");

    this._mm.removeMessageListener("Reader:CloseDropdown", this);
    this._mm.removeMessageListener("Reader:AddButton", this);
    this._mm.removeMessageListener("Reader:RemoveButton", this);
    this._windowUnloaded = true;*/
      },

      _onReaderClose() {
        //ReaderMode.leaveReaderMode(this._mm.docShell, this._win);
      },

      async _resetFontSize() {
        localStorage.removeItem("_txtpage_font_size");
        let currentSize = 5;
        this._setFontSize(currentSize);
      },

      _setFontSize(newFontSize) {
        this._fontSize = Math.min(
          this.FONT_SIZE_MAX,
          Math.max(this.FONT_SIZE_MIN, newFontSize)
        );
        let size;
        if (this._fontSize > this.FONT_SIZE_LEGACY_MAX) {
          // -1 because we're indexing into a 0-indexed array, so the first value
          // over the legacy max should be 0, the next 1, etc.
          let index = this._fontSize - this.FONT_SIZE_LEGACY_MAX - 1;
          size = this.FONT_SIZE_EXTENDED_VALUES[index];
        } else {
          size = 10 + 2 * this._fontSize;
        }

        let readerBody = this._doc.body;
        readerBody.style.setProperty("--font-size", size + "px");
        localStorage.setItem("_txtpage_font_size", this._fontSize);
      },

      _setupFontSizeButtons() {
        let plusButton = this._doc.querySelector(".plus-button");
        let minusButton = this._doc.querySelector(".minus-button");

        let currentSize =
          parseInt(localStorage.getItem("_txtpage_font_size")) || 5;
        this._setFontSize(currentSize);
        this._updateFontSizeButtonControls();

        plusButton.addEventListener(
          "click",
          (event) => {
            if (!event.isTrusted) {
              return;
            }
            event.stopPropagation();
            this._changeFontSize(+1);
          },
          true
        );

        minusButton.addEventListener(
          "click",
          (event) => {
            if (!event.isTrusted) {
              return;
            }
            event.stopPropagation();
            this._changeFontSize(-1);
          },
          true
        );
      },

      _updateFontSizeButtonControls() {
        let plusButton = this._doc.querySelector(".plus-button");
        let minusButton = this._doc.querySelector(".minus-button");

        let currentSize = this._fontSize;
        let fontValue = this._doc.querySelector(".font-size-value");
        fontValue.textContent = currentSize;

        if (currentSize === this.FONT_SIZE_MIN) {
          minusButton.setAttribute("disabled", true);
        } else {
          minusButton.removeAttribute("disabled");
        }
        if (currentSize === this.FONT_SIZE_MAX) {
          plusButton.setAttribute("disabled", true);
        } else {
          plusButton.removeAttribute("disabled");
        }
      },

      _changeFontSize(changeAmount) {
        let currentSize =
          parseInt(localStorage.getItem("_txtpage_font_size")) + changeAmount;
        this._setFontSize(currentSize);
        this._updateFontSizeButtonControls();
        this._scheduleToolbarOverlapHandler();
      },

      _setContentWidth(newContentWidth) {
        this._contentWidth = newContentWidth;
        this._displayContentWidth(newContentWidth);
        let width = 20 + 5 * (this._contentWidth - 1) + "em";
        this._doc.body.style.setProperty("--content-width", width);
        this._scheduleToolbarOverlapHandler();
        localStorage.setItem("_txtpage_content_width", this._contentWidth);
      },

      _displayContentWidth(currentContentWidth) {
        let contentWidthValue = this._doc.querySelector(".content-width-value");
        contentWidthValue.textContent = currentContentWidth;
      },

      _setupContentWidthButtons() {
        const CONTENT_WIDTH_MIN = 1;
        const CONTENT_WIDTH_MAX = 9;

        let currentContentWidth =
          parseInt(localStorage.getItem("_txtpage_content_width")) || 3;
        currentContentWidth = Math.max(
          CONTENT_WIDTH_MIN,
          Math.min(CONTENT_WIDTH_MAX, currentContentWidth)
        );

        this._displayContentWidth(currentContentWidth);

        let plusButton = this._doc.querySelector(".content-width-plus-button");
        let minusButton = this._doc.querySelector(
          ".content-width-minus-button"
        );

        function updateControls() {
          if (currentContentWidth === CONTENT_WIDTH_MIN) {
            minusButton.setAttribute("disabled", true);
          } else {
            minusButton.removeAttribute("disabled");
          }
          if (currentContentWidth === CONTENT_WIDTH_MAX) {
            plusButton.setAttribute("disabled", true);
          } else {
            plusButton.removeAttribute("disabled");
          }
        }

        updateControls();
        this._setContentWidth(currentContentWidth);

        plusButton.addEventListener(
          "click",
          (event) => {
            if (!event.isTrusted) {
              return;
            }
            event.stopPropagation();

            if (currentContentWidth >= CONTENT_WIDTH_MAX) {
              return;
            }

            currentContentWidth++;
            updateControls();
            this._setContentWidth(currentContentWidth);
          },
          true
        );

        minusButton.addEventListener(
          "click",
          (event) => {
            if (!event.isTrusted) {
              return;
            }
            event.stopPropagation();

            if (currentContentWidth <= CONTENT_WIDTH_MIN) {
              return;
            }

            currentContentWidth--;
            updateControls();
            this._setContentWidth(currentContentWidth);
          },
          true
        );
      },

      _setLineHeight(newLineHeight) {
        this._displayLineHeight(newLineHeight);
        let height = 1 + 0.2 * (newLineHeight - 1) + "em";
        this._containerElement.style.setProperty("--line-height", height);
        localStorage.setItem("_txtpage_line_height", newLineHeight);
      },

      _displayLineHeight(currentLineHeight) {
        let lineHeightValue = this._doc.querySelector(".line-height-value");
        lineHeightValue.textContent = currentLineHeight;
      },

      _setupLineHeightButtons() {
        const LINE_HEIGHT_MIN = 1;
        const LINE_HEIGHT_MAX = 9;

        let currentLineHeight =
          parseInt(localStorage.getItem("_txtpage_line_height")) || 4;
        currentLineHeight = Math.max(
          LINE_HEIGHT_MIN,
          Math.min(LINE_HEIGHT_MAX, currentLineHeight)
        );

        this._displayLineHeight(currentLineHeight);

        let plusButton = this._doc.querySelector(".line-height-plus-button");
        let minusButton = this._doc.querySelector(".line-height-minus-button");

        function updateControls() {
          if (currentLineHeight === LINE_HEIGHT_MIN) {
            minusButton.setAttribute("disabled", true);
          } else {
            minusButton.removeAttribute("disabled");
          }
          if (currentLineHeight === LINE_HEIGHT_MAX) {
            plusButton.setAttribute("disabled", true);
          } else {
            plusButton.removeAttribute("disabled");
          }
        }

        updateControls();
        this._setLineHeight(currentLineHeight);

        plusButton.addEventListener(
          "click",
          (event) => {
            if (!event.isTrusted) {
              return;
            }
            event.stopPropagation();

            if (currentLineHeight >= LINE_HEIGHT_MAX) {
              return;
            }

            currentLineHeight++;
            updateControls();
            this._setLineHeight(currentLineHeight);
          },
          true
        );

        minusButton.addEventListener(
          "click",
          (event) => {
            if (!event.isTrusted) {
              return;
            }
            event.stopPropagation();

            if (currentLineHeight <= LINE_HEIGHT_MIN) {
              return;
            }

            currentLineHeight--;
            updateControls();
            this._setLineHeight(currentLineHeight);
          },
          true
        );
      },

      _setColorScheme(newColorScheme) {
        // "auto" is not a real color scheme
        if (this._colorScheme === newColorScheme || newColorScheme === "auto") {
          return;
        }

        let bodyClasses = this._doc.body.classList;

        if (this._colorScheme) {
          bodyClasses.remove(this._colorScheme);
        }

        this._colorScheme = newColorScheme;
        bodyClasses.add(this._colorScheme);
        for (let rule of document.styleSheets[0].cssRules)
          if (rule instanceof CSSStyleRule)
            for (let style of rule.style) {
              let m = rule.style
                .getPropertyValue(style)
                .match(/^url\(['"]?(data:image\/svg.+?)['"]?\)$/);
              if (m) {
                var request = new XMLHttpRequest();
                request.open("GET", m[1], false);
                request.send(null);
                let svg = new DOMParser().parseFromString(
                  request.responseText,
                  "image/svg+xml"
                );
                let ele = document.querySelector(rule.selectorText);
                if (!ele) console.log(rule.selectorText);
                for (let e of svg.querySelectorAll("[fill]"))
                  e.setAttribute(
                    "fill",
                    rule.style.getPropertyValue("fill") || ele
                      ? getComputedStyle(ele).fill || e.getAttribute("fill")
                      : e.getAttribute("fill")
                  );
                rule.style.setProperty(
                  style,
                  "url('data:image/svg+xml;base64," +
                    btoa(svg.documentElement.outerHTML) +
                    "')"
                );
              }
            }
      },

      // Pref values include "dark", "light", and "sepia"
      _setColorSchemePref(colorSchemePref) {
        this._setColorScheme(colorSchemePref);
        localStorage.setItem("_txtpage_color_scheme", colorSchemePref);
      },

      _setFontType(newFontType) {
        if (this._fontType === newFontType) {
          return;
        }

        let bodyClasses = this._doc.body.classList;

        if (this._fontType) {
          bodyClasses.remove(this._fontType);
        }

        this._fontType = newFontType;
        bodyClasses.add(this._fontType);

        localStorage.setItem("_txtpage_font_type", this._fontType);
      },

      _updateImageMargins() {
        let windowWidth = this._win.innerWidth;
        let bodyWidth = this._doc.body.clientWidth;

        let setImageMargins = function (img) {
          // If the image is at least as wide as the window, make it fill edge-to-edge on mobile.
          if (img.naturalWidth >= windowWidth) {
            img.setAttribute("moz-reader-full-width", true);
          } else {
            img.removeAttribute("moz-reader-full-width");
          }

          // If the image is at least half as wide as the body, center it on desktop.
          if (img.naturalWidth >= bodyWidth / 2) {
            img.setAttribute("moz-reader-center", true);
          } else {
            img.removeAttribute("moz-reader-center");
          }
        };

        let imgs = this._doc.querySelectorAll(this._BLOCK_IMAGES_SELECTOR);
        for (let i = imgs.length; --i >= 0; ) {
          let img = imgs[i];

          if (img.naturalWidth > 0) {
            setImageMargins(img);
          } else {
            img.onload = function () {
              setImageMargins(img);
            };
          }
        }
      },

      _maybeSetTextDirection: function Read_maybeSetTextDirection(article) {
        // Set the article's "dir" on the contents.
        // If no direction is specified, the contents should automatically be LTR
        // regardless of the UI direction to avoid inheriting the parent's direction
        // if the UI is RTL.
        this._containerElement.dir = article.dir || "ltr";

        // The native locale could be set differently than the article's text direction.
        this._readTimeElement.dir = isAppLocaleRTL ? "rtl" : "ltr";

        // This is used to mirror the line height buttons in the toolbar, when relevant.
        this._toolbarElement.setAttribute("articledir", article.dir || "ltr");
      },

      _formatReadTime(slowEstimate, fastEstimate) {
        let displayStringKey = "aboutReader.estimatedReadTimeRange1";

        // only show one reading estimate when they are the same value
        if (slowEstimate == fastEstimate) {
          displayStringKey = "aboutReader.estimatedReadTimeValue1";
        }

        return PluralForm.get(
          slowEstimate,
          gStrings.GetStringFromName(displayStringKey)
        )
          .replace("#1", fastEstimate)
          .replace("#2", slowEstimate);
      },

      _showError() {
        this._headerElement.classList.remove("reader-show-element");
        this._contentElement.classList.remove("reader-show-element");

        let errorMessage = gStrings.GetStringFromName("aboutReader.loadError");
        this._messageElement.textContent = errorMessage;
        this._messageElement.style.display = "block";

        this._doc.title = errorMessage;

        this._doc.documentElement.dataset.isError = true;

        this._error = true;

        this._doc.dispatchEvent(
          new this._win.CustomEvent("AboutReaderContentError", {
            bubbles: true,
            cancelable: false,
          })
        );
      },

      // This function is the JS version of Java's StringUtils.stripCommonSubdomains.
      _stripHost(host) {
        if (!host) {
          return host;
        }

        let start = 0;

        if (host.startsWith("www.")) {
          start = 4;
        } else if (host.startsWith("m.")) {
          start = 2;
        } else if (host.startsWith("mobile.")) {
          start = 7;
        }

        return host.substring(start);
      },

      _showContent(article) {
        /*this._messageElement.classList.remove("reader-show-element");

    this._article = article;

    this._domainElement.href = article.url;
    let articleUri = Services.io.newURI(article.url);
    this._domainElement.textContent = this._stripHost(articleUri.host);
    this._creditsElement.textContent = article.byline;

    this._titleElement.textContent = article.title;
    this._readTimeElement.textContent = this._formatReadTime(
      article.readingTimeMinsSlow,
      article.readingTimeMinsFast
    );
    this._doc.title = article.title;

    this._headerElement.classList.add("reader-show-element");

    let parserUtils = Cc["@mozilla.org/parserutils;1"].getService(
      Ci.nsIParserUtils
    );
    let contentFragment = parserUtils.parseFragment(
      article.content,
      Ci.nsIParserUtils.SanitizerDropForms |
        Ci.nsIParserUtils.SanitizerAllowStyle,
      false,
      articleUri,
      this._contentElement
    );
    this._contentElement.innerHTML = "";
    this._contentElement.appendChild(contentFragment);
    this._maybeSetTextDirection(article);
    this._foundLanguage(article.language);

    this._contentElement.classList.add("reader-show-element");
    this._updateImageMargins();

    this._requestFavicon();
    this._doc.body.classList.add("loaded");

    this._goToReference(articleUri.ref);

    Services.obs.notifyObservers(this._win, "AboutReader:Ready");

    this._doc.dispatchEvent(
      new this._win.CustomEvent("AboutReaderContentReady", {
        bubbles: true,
        cancelable: false,
      })
    );*/
      },

      _hideContent() {
        this._headerElement.classList.remove("reader-show-element");
        this._contentElement.classList.remove("reader-show-element");
      },

      _showProgressDelayed() {
        this._win.setTimeout(() => {
          // No need to show progress if the article has been loaded,
          // if the window has been unloaded, or if there was an error
          // trying to load the article.
          if (this._article || this._windowUnloaded || this._error) {
            return;
          }

          this._headerElement.classList.remove("reader-show-element");
          this._contentElement.classList.remove("reader-show-element");

          this._messageElement.textContent = gStrings.GetStringFromName(
            "aboutReader.loading2"
          );
          this._messageElement.classList.add("reader-show-element");
        }, 300);
      },

      _setupSegmentedButton(id, options, initialValue, callback) {
        let doc = this._doc;
        let segmentedButton = doc.getElementsByClassName(id)[0];

        for (let option of options) {
          let radioButton = doc.createElement("input");
          radioButton.id = "radio-item" + option.itemClass;
          radioButton.type = "radio";
          radioButton.classList.add("radio-button");
          radioButton.name = option.groupName;
          segmentedButton.appendChild(radioButton);

          let item = doc.createElement("label");
          item.textContent = option.name;
          item.htmlFor = radioButton.id;
          item.classList.add(option.itemClass);

          segmentedButton.appendChild(item);

          radioButton.addEventListener(
            "input",
            function (aEvent) {
              if (!aEvent.isTrusted) {
                return;
              }

              // Just pass the ID of the button as an extra and hope the ID doesn't change
              // unless the context changes
              //UITelemetry.addEvent("action.1", "button", null, id);

              let labels = segmentedButton.children;
              for (let label of labels) {
                label.removeAttribute("checked");
              }

              aEvent.target.nextElementSibling.setAttribute("checked", "true");
              callback(option.value);
            },
            true
          );

          if (option.value === initialValue) {
            radioButton.checked = true;
            item.setAttribute("checked", "true");
          }
        }
      },

      _setupButton(id, callback, titleEntity) {
        let button = this._doc.querySelector("." + id);
        if (titleEntity) {
          this._setButtonTip(button, titleEntity);
        }

        button.removeAttribute("hidden");
        button.addEventListener(
          "click",
          function (aEvent) {
            if (!aEvent.isTrusted) {
              return;
            }

            let btn = aEvent.target;
            callback(btn);
          },
          true
        );
      },

      /**
       * Sets a tooltip-style label on a button.
       * @param   Localizable string providing UI element usage tip.
       */
      _setButtonTip(button, titleEntity) {
        let tip = this._doc.createElement("span");
        let localizedString = gStrings.GetStringFromName(titleEntity);
        tip.textContent = localizedString;
        tip.className = "hover-label";
        button.setAttribute("aria-label", localizedString);
        button.append(tip);
      },

      _toggleDropdownClicked(event) {
        let dropdown = event.target.closest(".dropdown");

        if (!dropdown) {
          return;
        }

        event.stopPropagation();

        if (dropdown.classList.contains("open")) {
          this._closeDropdowns();
        } else {
          this._openDropdown(dropdown);
        }
      },

      /*
       * If the ReaderView banner font-dropdown is closed, open it.
       */
      _openDropdown(dropdown, window) {
        if (dropdown.classList.contains("open")) {
          return;
        }

        this._closeDropdowns();

        // Get the height of the doc and start handling scrolling:
        this._lastHeight = this._doc.body.getBoundingClientRect().height;
        this._doc.addEventListener("scroll", this);

        dropdown.classList.add("open");

        this._toolbarContainerElement.classList.add("dropdown-open");
        this._toggleToolbarFixedPosition(true);
      },

      /*
       * If the ReaderView has open dropdowns, close them. If we are closing the
       * dropdowns because the page is scrolling, allow popups to stay open with
       * the keep-open class.
       */
      _closeDropdowns(scrolling) {
        let selector = ".dropdown.open";
        if (scrolling) {
          selector += ":not(.keep-open)";
        }

        let openDropdowns = this._doc.querySelectorAll(selector);
        let haveOpenDropdowns = openDropdowns.length;
        for (let dropdown of openDropdowns) {
          dropdown.classList.remove("open");
        }

        if (haveOpenDropdowns) {
          this._toolbarContainerElement.classList.remove("dropdown-open");
          this._toggleToolbarFixedPosition(false);
        }

        // Stop handling scrolling:
        this._doc.removeEventListener("scroll", this);
      },

      _toggleToolbarFixedPosition(shouldBeFixed) {
        let el = this._toolbarContainerElement;
        let fontSize = this._doc.body.style.getPropertyValue("--font-size");
        let contentWidth =
          this._doc.body.style.getPropertyValue("--content-width");
        if (shouldBeFixed) {
          el.style.setProperty("--font-size", fontSize);
          el.style.setProperty("--content-width", contentWidth);
          el.classList.add("transition-location");
        } else {
          let expectTransition =
            el.style.getPropertyValue("--font-size") != fontSize ||
            el.style.getPropertyValue("--content-width") != contentWidth;
          if (expectTransition) {
            el.addEventListener(
              "transitionend",
              () => el.classList.remove("transition-location"),
              { once: true }
            );
          } else {
            el.classList.remove("transition-location");
          }
          el.style.removeProperty("--font-size");
          el.style.removeProperty("--content-width");
          el.classList.remove("overlaps");
        }
      },

      _scheduleToolbarOverlapHandler() {
        if (this._enqueuedToolbarOverlapHandler) {
          return;
        }
        this._enqueuedToolbarOverlapHandler = this._win.requestAnimationFrame(
          () => {
            this._win.setTimeout(() => this._toolbarOverlapHandler(), 0);
          }
        );
      },

      _toolbarOverlapHandler() {
        delete this._enqueuedToolbarOverlapHandler;
        // Ensure the dropdown is still open to avoid racing with that changing.
        if (this._toolbarContainerElement.classList.contains("dropdown-open")) {
          let toolbarBounds =
            this._toolbarElement.parentNode.getBoundingClientRect();
          let textBounds = this._containerElement.getBoundingClientRect();
          let overlaps = false;
          if (isAppLocaleRTL) {
            overlaps = textBounds.right > toolbarBounds.left;
          } else {
            overlaps = textBounds.left < toolbarBounds.right;
          }
          this._toolbarContainerElement.classList.toggle("overlaps", overlaps);
        }
      },

      _topScrollChange(entries) {
        if (!entries.length) {
          return;
        }
        // If we don't intersect the item at the top of the document, we're
        // scrolled down:
        let scrolled = !entries[entries.length - 1].isIntersecting;
        let tbc = this._toolbarContainerElement;
        tbc.classList.toggle("scrolled", scrolled);
      },

      /*
       * Scroll reader view to a reference
       */
      _goToReference(ref) {
        if (ref) {
          this._win.location.hash = ref;
        }
      },
    };
    return AboutReader;
  })();

  new AboutReader(null, window);
})
  .toString()
  .match(/{([\s\S]+)}/)[1];
