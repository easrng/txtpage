/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * Copied from https://searchfox.org/mozilla-central/source/toolkit/themes/shared/aboutReader.css
 */
export default `/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. Copied from https://searchfox.org/mozilla-central/source/toolkit/themes/shared/aboutReader.css */

/* Avoid adding ID selector rules in this style sheet, since they could
 * inadvertently match elements in the article content. */
:root {
  --body-padding: 64px;
  --popup-border: rgba(0, 0, 0, 0.12);
  --opaque-popup-border: #e0e0e0;
  --popup-shadow: rgba(49, 49, 49, 0.3);
  --grey-90-a10: rgba(12, 12, 13, 0.1);
  --grey-90-a20: rgba(12, 12, 13, 0.2);
  --grey-90-a30: rgba(12, 12, 13, 0.3);
  --grey-90-a80: rgba(12, 12, 13, 0.8);
  --grey-30: #d7d7db;
  --blue-40: #45a1ff;
  --blue-40-a30: rgba(69, 161, 255, 0.3);
  --blue-60: #0060df;
  --active-color: #0B83FF;
  --font-size: 12;
  --content-width: 22em;
  --line-height: 1.6em;
  --tooltip-background: var(--grey-90-a80);
  --tooltip-foreground: white;
  --toolbar-button-hover: var(--grey-90-a10);
  --toolbar-button-active: var(--grey-90-a20);
}

body {
  --main-background: #fff;
  --main-foreground: #333;
  --toolbar-border: var(--grey-90-a20);
  --toolbar-box-shadow: var(--grey-90-a10);
  --popup-button-hover: hsla(0,0%,70%,.4);
  --popup-button-active: hsla(240,5%,5%,.15);
  --popup-bgcolor: white;
  --popup-button: #edecf0;
  --selected-fonttype-background: var(--blue-40-a30);
  --selected-border: var(--blue-40);
  --popup-line: var(--grey-30);
  --font-value-border: var(--grey-30);
  --font-color: #000000;
  --icon-fill: #3b3b3c;
  --icon-disabled-fill: #8080807F;
  /* light colours */
}

body.sepia {
  --main-background: #f4ecd8;
  --main-foreground: #5b4636;
  --toolbar-border: #5b4636;
}

body.dark {
  --main-background: #333;
  --main-foreground: #eee;
  --toolbar-border: #4a4a4b;
  --toolbar-box-shadow: black;
  --toolbar-button-hover: var(--grey-90-a30);
  --toolbar-button-active: var(--grey-90-a80);
  --popup-button-active: hsla(0,0%,70%,.6);
  --popup-bgcolor: #4c4a50;
  --popup-button: #5c5c61;
  --popup-line: #5c5c61;
  --opaque-popup-border: #434146;
  --font-value-border: #656468;
  --font-color: #fff;
  --icon-fill: #fff;
  --icon-disabled-fill: #ffffff66;
  --tooltip-background: black;
  --tooltip-foreground: white;
  /* dark colours */
}

body {
  margin: 0;
  padding: var(--body-padding);
  background-color: var(--main-background);
  color: var(--main-foreground);
}

body.loaded {
  transition: color 0.4s, background-color 0.4s;
}

body.dark *::-moz-selection {
  background-color: #FFFFFF;
  color: #0095DD;
}
body.dark a::-moz-selection {
  color: #DD4800;
}

body.sans-serif,
body.sans-serif .remove-button {
  font-family: Helvetica, Arial, sans-serif;
}

body.serif,
body.serif .remove-button {
  font-family: Georgia, "Times New Roman", serif;
}

.container {
  margin: 0 auto;
  font-size: var(--font-size);
  max-width: var(--content-width);
  line-height: var(--line-height);
}

/* Override some controls and content styles based on color scheme */

body.light > .container > .header > .domain {
  border-bottom-color: #333333 !important;
}

body.sepia > .container > .header > .domain {
  border-bottom-color: #5b4636 !important;
}

body.dark > .container > .header > .domain {
  border-bottom-color: #eeeeee !important;
}

body.sepia > .container > .footer {
  background-color: #dedad4 !important;
}

body.light blockquote {
  border-inline-start: 2px solid #333333 !important;
}

body.sepia blockquote {
  border-inline-start: 2px solid #5b4636 !important;
}

body.dark blockquote {
  border-inline-start: 2px solid #eeeeee !important;
}

.light-button {
  color: #333333;
  background-color: #ffffff;
}

.dark-button {
  color: #eeeeee;
  background-color: #333333;
}

.sepia-button {
  color: #5b4636;
  background-color: #f4ecd8;
}

/* Loading/error message */

.reader-message {
  margin-top: 40px;
  display: none;
  text-align: center;
  width: 100%;
  font-size: 0.9em;
}

/* Detector element to see if we're at the top of the doc or not. */
.top-anchor {
  position: absolute;
  top: 0;
  width: 0;
  height: 5px;
  pointer-events: none;
}

/* Header */

.header {
  text-align: start;
  display: none;
}

.domain {
  font-size: 0.9em;
  line-height: 1.48em;
  padding-bottom: 4px;
  font-family: Helvetica, Arial, sans-serif;
  text-decoration: none;
  border-bottom: 1px solid;
  color: #0095dd;
}

.header > h1 {
  font-size: 1.6em;
  line-height: 1.25em;
  width: 100%;
  margin: 30px 0;
  padding: 0;
}

.header > .credits {
  font-size: 0.9em;
  line-height: 1.48em;
  margin: 0 0 10px;
  padding: 0;
  font-style: italic;
}

.header > .meta-data {
  font-size: 0.65em;
  margin: 0 0 15px;
}

.reader-estimated-time {
  text-align: match-parent;
}

/*======= Controls toolbar =======*/

.toolbar-container {
  position: sticky;
  z-index: 2;
  top: 32px;
  height: 0; /* take up no space, so body is at the top. */

  /* As a stick container, we're positioned relative to the body. Move us to
   * the edge of the viewport using margins, and take the width of
   * the body padding into account for calculating our width.
   */
  margin-inline-start: calc(-1 * var(--body-padding));
  width: max(var(--body-padding), calc((100% - var(--content-width)) / 2 + var(--body-padding)));
  font-size: var(--font-size); /* Needed to ensure 'em' units match, is reset for .reader-controls */
}

.toolbar {
  padding-block: 16px;
  border: 1px solid var(--toolbar-border);
  border-radius: 6px;
  box-shadow: 0 2px 8px var(--toolbar-box-shadow);

  width: 32px; /* basic width, without padding/border */

  /* padding should be 16px, except if there's not enough space for that, in
   * which case use half the available space for padding (=25% on each side).
   * The 34px here is the width + borders. We use a variable because we need
   * to know this size for the margin calculation.
   */
  --inline-padding: min(16px, calc(25% - 0.25 * 34px));
  padding-inline: var(--inline-padding);

  /* Keep a maximum of 96px distance to the body, but center once the margin
   * gets too small. We need to set the start margin, however...
   * To center, we'd want 50% of the container, but we'd subtract half our
   * own width (16px) and half the border (1px) and the inline padding.
   * When the other margin would be 96px, we want 100% - 96px - the complete
   * width of the actual toolbar (34px + 2 * padding)
   */
  margin-inline-start: max(calc(50% - 17px - var(--inline-padding)), calc(100% - 96px - 34px - 2 * var(--inline-padding)));

  font-family: Helvetica, Arial, sans-serif;
  list-style: none;
  -moz-user-select: none;
}

@media (prefers-reduced-motion: no-preference) {
  .toolbar {
    transition-property: border-color, box-shadow;
    transition-duration: 250ms;
  }

  .toolbar .button {
    transition-property: opacity;
    transition-duration: 250ms;
  }

  .toolbar-container.scrolled .toolbar:not(:hover) {
    border-color: transparent;
    box-shadow: 0 2px 8px transparent;
  }

  .toolbar-container.scrolled .toolbar:not(:hover) .button {
    opacity: 0.6;
  }

  .toolbar-container.transition-location {
    transition-duration: 250ms;
    transition-property: width;
  }
}

.toolbar-container.overlaps .button {
  opacity: 0.1;
}

.dropdown-open .toolbar {
  border-color: transparent;
  box-shadow: 0 2px 8px transparent;
}

.reader-controls {
  /* We use 'em's above this node to get it to the right size. However,
   * the UI inside the toolbar should use a fixed, smaller size. */
  font-size: 11px;
}

.button {
  position: relative;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 4px;
  margin: 4px 0;
  background-color: transparent;
  background-size: 16px 16px;
  background-position: center;
  background-repeat: no-repeat;
  color: var(--font-color);
}

.button:hover,
.button:-moz-focusring {
  background-color: var(--toolbar-button-hover);
}

.open .button,
.button:active {
  background-color: var(--toolbar-button-active);
  color: var(--active-color);
}

.open .style-button, .style-button:active {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%230B83FF' d='M10.87,18.989h2.144L8.3,3.991H5.724l-4.739,15H3.044l1.115-4.171h5.6ZM4.652,12.91L6.968,5.69l2.294,7.22H4.652ZM22.1,16.515v-5.06c0-2.31-.984-3.713-3.65-3.713a10.236,10.236,0,0,0-3.7.756L15.116,9.9A9.9,9.9,0,0,1,18.1,9.317c1.533,0,1.958.627,1.958,2.223v0.975h-1.35c-3.086,0-4.871,1.125-4.871,3.5a3.217,3.217,0,0,0,3.527,3.338,3.205,3.205,0,0,0,2.945-1.659,2.573,2.573,0,0,0,2.436,1.659l0.441-1.344A1.408,1.408,0,0,1,22.1,16.515ZM17.8,17.9a1.744,1.744,0,0,1-1.911-1.995c0-1.512,1.029-2.111,3.065-2.111h1.1V16.18C19.426,17.334,18.938,17.9,17.8,17.9Z'/%3E%3C/svg%3E");
}

.hover-label {
  position: absolute;
  top: 4px;
  inset-inline-start: 36px;
  line-height: 16px;
  white-space: pre; /* make sure we don't wrap */
  background-color: var(--tooltip-background);
  color: var(--tooltip-foreground);
  padding: 4px 8px;
  border-radius: 2px;
  visibility: hidden;
  pointer-events: none;
}

.button:hover > .hover-label,
.button:-moz-focusring > .hover-label {
  visibility: visible;
}

button {
  -moz-context-properties: fill;
  color: var(--font-color);
  fill: var(--icon-fill);
}

button:disabled {
  fill: var(--icon-disabled-fill);
}

.toolbar button::-moz-focus-inner {
  border: 0;
}

.dropdown {
  text-align: center;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.dropdown li {
  margin: 0;
  padding: 0;
}

/* Don't show hover styles while dropdowns are open, except in the dropdown. */
.dropdown-open {
  pointer-events: none;
}

.dropdown-open .dropdown-popup {
  pointer-events: initial;
}

/*======= Popup =======*/

.dropdown .dropdown-popup {
  text-align: start;
  position: absolute;
  inset-inline-start: 40px;
  z-index: 1000;
  background-color: var(--popup-bgcolor);
  visibility: hidden;
  border-radius: 4px;
  border: 1px solid var(--popup-border);
  box-shadow: 0 4px 6px 0 var(--popup-shadow);
  border-bottom-width: 0;
  top: 0;
}

.open > .dropdown-popup {
  visibility: visible;
}

.dropdown-arrow {
  position: absolute;
  height: 24px;
  width: 16px;
  inset-inline-start: -16px;
  display: block;
  fill: var(--popup-bgcolor);
  stroke: var(--opaque-popup-border);
  pointer-events: none;
}

.dropdown-arrow:dir(rtl) {
  transform: scaleX(-1);
}

/* Align the style dropdown arrow (narrate does its own) */
.style-dropdown .dropdown-arrow {
  top: 7px;
}

/*======= Font style popup =======*/

.radio-button {
  /* We visually hide these, but we keep them around so they can be focused
   * and changed by interacting with them via the label, or the keyboard, or
   * assistive technology.
   */
  opacity: 0;
  pointer-events: none;
  position: absolute;
}

.radiorow,
.buttonrow {
  display: flex;
}

.content-width-value,
.font-size-value,
.line-height-value {
  box-sizing: border-box;
  width: 36px;
  height: 15px;
  line-height: 15px;
  display: flex;
  justify-content: center;
  align-content: center;
  margin: auto;
  border-radius: 10px;
  border: 1px solid var(--font-value-border);
  background-color: var(--popup-button);
}

.buttonrow > button {
  border: 0;
  height: 60px;
  width: 90px;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
}

.buttonrow > button:enabled:hover,
.buttonrow > button:enabled:-moz-focusring {
  background-color: var(--popup-button-hover);
}

.buttonrow > button:enabled:active {
  background-color: var(--popup-button-active);
}

.radiorow:not(:last-child),
.buttonrow:not(:last-child) {
  border-bottom: 1px solid var(--popup-line);
}

.radiorow > label {
  position: relative;
  box-sizing: border-box;
  border-radius: 2px;
  border: 2px solid var(--popup-border);
}

.radiorow > label[checked] {
  border-color: var(--selected-border);
}

/* For the hover style, we draw a line under the item by means of a
 * pseudo-element. Because these items are variable height, and
 * because their contents are variable height, position it absolutely,
 * and give it a width of 100% (the content width) + 4px for the 2 * 2px
 * border width.
 */
.radiorow > input[type=radio]:-moz-focusring + label::after,
.radiorow > label:hover::after {
  content: "";
  display: block;
  border-bottom: 2px solid var(--blue-40);
  width: calc(100% + 4px);
  position: absolute;
  /* to skip the 2 * 2px border + 2px spacing. */
  bottom: -6px;
  /* Match the start of the 2px border of the element: */
  inset-inline-start: -2px;
}

.color-scheme-buttons > label {
  height: 34px;
  width: 70px;
  font-size: 12px;
  /* Center the labels horizontally as well as vertically */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* We want 10px between items, but there's no margin collapsing in flexbox. */
  margin: 10px 5px;
}

.color-scheme-buttons > input:first-child + label {
  margin-inline-start: 10px;
}

.color-scheme-buttons > label:last-child {
  margin-inline-end: 10px;
}

.font-type-buttons > label {
  height: 64px;
  width: 105px;
  /* Slightly more space between these items. */
  margin: 10px;
  /* Center the Sans-serif / Serif labels */
  text-align: center;
  background-size: 63px 39px;
  background-repeat: no-repeat;
  background-position: center 18px;
  background-color: var(--popup-button);
  fill: currentColor;
  /* This mostly matches baselines, but because of differences in font
   * baselines between serif and sans-serif, this isn't always enough. */
  line-height: 1;
  padding-top: 2px;
}

.font-type-buttons > label[checked] {
  background-color: var(--selected-fonttype-background);
}

.sans-serif-button {
  font-family: Helvetica, Arial, sans-serif;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='13' fill='%23333'%3E%3Cpath d='M 7.276027,7.16854 5.432216,1.80247 3.47265,7.16854 Z M 4.572322,0 H 6.43267 l 4.406957,12.146004 H 9.037157 L 7.805193,8.507991 H 3.001361 L 1.686716,12.146004 H 0 Z'/%3E%3Cpath d='m 13.295286,9.789564 q 0,0.64492 0.471288,1.01699 0.471288,0.372069 1.116209,0.372069 0.78548,0 1.521351,-0.363801 1.240232,-0.603579 1.240232,-1.976103 V 7.639828 Q 17.371515,7.813461 16.941568,7.929216 16.511621,8.044971 16.09821,8.09458 L 15.196975,8.210335 Q 14.38669,8.317822 13.981548,8.549332 13.295286,8.937938 13.295286,9.789564 Z m 3.604941,-3.00963 q 0.512629,-0.06614 0.686262,-0.429947 0.09922,-0.198437 0.09922,-0.570507 0,-0.760675 -0.545702,-1.099672 -0.537434,-0.347265 -1.546156,-0.347265 -1.165818,0 -1.653642,0.628384 -0.272851,0.347265 -0.355533,1.033527 h -1.38906 q 0.04134,-1.637106 1.058331,-2.273759 1.025259,-0.64492 2.372977,-0.64492 1.562693,0 2.538342,0.595311 0.967381,0.595311 0.967381,1.85208 v 5.101487 q 0,0.23151 0.09095,0.37207 0.09922,0.140559 0.405142,0.140559 0.09922,0 0.223242,-0.0083 0.124023,-0.01654 0.264583,-0.04134 v 1.099672 q -0.347265,0.09922 -0.529166,0.124024 -0.1819,0.0248 -0.496093,0.0248 -0.768943,0 -1.116208,-0.545702 -0.181901,-0.289387 -0.256315,-0.818553 -0.454752,0.595311 -1.306378,1.033527 -0.851625,0.438215 -1.876884,0.438215 -1.231964,0 -2.017444,-0.744139 -0.777212,-0.752407 -0.777212,-1.876884 0,-1.231964 0.768944,-1.909958 0.768944,-0.677993 2.017444,-0.835089 z M 15.668263,3.075775 Z'/%3E%3C/svg%3E");
}

/* Tweak padding to match the baseline on mac */
:root[platform=macosx] .sans-serif-button {
  padding-top: 3px;
}

.serif-button {
  font-family: Georgia, "Times New Roman", serif;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='13' fill='%23333'%3E%3Cpath d='M 12.088127,11.897958 H 7.2016131 v -0.587043 q 0.6449206,-0.04134 1.0665998,-0.165364 0.4299469,-0.124023 0.4299469,-0.305924 0,-0.07441 -0.01654,-0.181901 -0.01654,-0.107486 -0.04961,-0.190168 L 7.656365,7.838266 H 3.547063 Q 3.315553,8.417041 3.166726,8.846988 3.026166,9.276935 2.910411,9.640736 2.802924,9.996269 2.761583,10.219511 q -0.04134,0.223242 -0.04134,0.363802 0,0.330728 0.520897,0.512629 0.520898,0.1819 1.174087,0.214973 v 0.587043 H 0 v -0.587043 q 0.214974,-0.01654 0.53743401,-0.09095 0.32246003,-0.08268 0.52916499,-0.214974 0.330729,-0.223241 0.51263,-0.46302 0.1819,-0.248046 0.355533,-0.677993 Q 2.819461,7.656365 3.88606,4.90305 4.95266,2.149735 5.787749,0 h 0.661457 l 3.910865,10.120293 q 0.124023,0.32246 0.281119,0.520897 0.157096,0.198437 0.438215,0.388606 0.190169,0.115755 0.496093,0.198437 0.305924,0.07441 0.512629,0.08268 z M 7.3587101,7.102395 5.5810441,2.554878 3.836451,7.102395 Z'/%3E%3Cpath d='m 20.03388,11.749131 q -0.388606,0.140559 -0.686262,0.223241 -0.289387,0.09095 -0.661457,0.09095 -0.64492,0 -1.033526,-0.297656 -0.380338,-0.305924 -0.487825,-0.884699 H 17.1152 q -0.537434,0.595312 -1.15755,0.909504 -0.611848,0.314192 -1.48001,0.314192 -0.917772,0 -1.513083,-0.562239 -0.587043,-0.562238 -0.587043,-1.471742 0,-0.471288 0.132291,-0.843357 0.132291,-0.37207 0.396874,-0.669726 0.206706,-0.248046 0.545702,-0.438215 0.338997,-0.198437 0.636653,-0.314192 0.372069,-0.14056 1.504814,-0.520897 1.141014,-0.380338 1.537888,-0.595312 V 5.87043 q 0,-0.107487 -0.04961,-0.41341 -0.04134,-0.305924 -0.190169,-0.578775 -0.165364,-0.305924 -0.471288,-0.529166 -0.297656,-0.23151 -0.851626,-0.23151 -0.380338,0 -0.711066,0.132291 -0.322461,0.124024 -0.454752,0.264583 0,0.165365 0.07441,0.487825 0.08268,0.32246 0.08268,0.595311 0,0.289388 -0.264583,0.529166 -0.256315,0.239778 -0.719334,0.239778 -0.413411,0 -0.611848,-0.289387 -0.190169,-0.297656 -0.190169,-0.661458 0,-0.380337 0.264583,-0.727602 0.272851,-0.347265 0.702798,-0.620116 0.372069,-0.23151 0.901235,-0.388606 0.529166,-0.165364 1.033527,-0.165364 0.69453,0 1.207159,0.09922 0.520897,0.09095 0.942576,0.405143 0.421679,0.305923 0.636652,0.835089 0.223242,0.520897 0.223242,1.347719 0,1.182354 -0.02481,2.100126 -0.0248,0.909503 -0.0248,1.992639 0,0.32246 0.107487,0.512629 0.115755,0.190169 0.347265,0.322461 0.124023,0.07441 0.388607,0.08268 0.27285,0.0083 0.553969,0.0083 z M 17.148274,7.383514 q -0.702799,0.206705 -1.231964,0.405143 -0.529166,0.198437 -0.983918,0.496092 -0.41341,0.28112 -0.653188,0.669726 -0.239779,0.380337 -0.239779,0.909503 0,0.686262 0.355534,1.008722 0.363801,0.32246 0.917771,0.32246 0.587043,0 1.033527,-0.281119 0.446483,-0.289387 0.752407,-0.677993 z'/%3E%3C/svg%3E");
}

/*======= Toolbar icons =======*/

.style-button {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%233b3b3c' d='M10.87,18.989h2.144L8.3,3.991H5.724l-4.739,15H3.044l1.115-4.171h5.6ZM4.652,12.91L6.968,5.69l2.294,7.22H4.652ZM22.1,16.515v-5.06c0-2.31-.984-3.713-3.65-3.713a10.236,10.236,0,0,0-3.7.756L15.116,9.9A9.9,9.9,0,0,1,18.1,9.317c1.533,0,1.958.627,1.958,2.223v0.975h-1.35c-3.086,0-4.871,1.125-4.871,3.5a3.217,3.217,0,0,0,3.527,3.338,3.205,3.205,0,0,0,2.945-1.659,2.573,2.573,0,0,0,2.436,1.659l0.441-1.344A1.408,1.408,0,0,1,22.1,16.515ZM17.8,17.9a1.744,1.744,0,0,1-1.911-1.995c0-1.512,1.029-2.111,3.065-2.111h1.1V16.18C19.426,17.334,18.938,17.9,17.8,17.9Z'/%3E%3C/svg%3E");
}

.minus-button {
  background-size: 18px 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%233b3b3c' d='M0,13.5v-3h24v3H0z'/%3E%3C/svg%3E");
}

.plus-button {
  background-size: 18px 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b3b3c'%3E%3Cpath fill='context-fill' d='M24,13.5H13.5V24h-3V13.5H0v-3h10.5V0h3v10.5H24V13.5z'/%3E%3C/svg%3E");
}

.content-width-minus-button {
  background-size: 42px 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='42' height='16' viewBox='0 0 42 16' fill='%233b3b3c'%3E%3Cpath d='M14.5,7 L8.75,1.25 L10,-1.91791433e-15 L18,8 L17.375,8.625 L10,16 L8.75,14.75 L14.5,9 L1.13686838e-13,9 L1.13686838e-13,7 L14.5,7 Z'/%3E%3Cpath d='M38.5,7 L32.75,1.25 L34,6.58831647e-15 L42,8 L41.375,8.625 L34,16 L32.75,14.75 L38.5,9 L24,9 L24,7 L38.5,7 Z' transform='translate(33.000000, 8.000000) scale(-1, 1) translate(-33.000000, -8.000000)'/%3E%3C/svg%3E");
}

.content-width-plus-button {
  background-size: 44px 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='16' viewBox='0 0 44 16' fill='%233b3b3c'%3E%3Cpath d='M14.5,7 L8.75,1.25 L10,-1.91791433e-15 L18,8 L17.375,8.625 L10,16 L8.75,14.75 L14.5,9 L1.13686838e-13,9 L1.13686838e-13,7 L14.5,7 Z' transform='translate(9.000000, 8.000000) scale(-1, 1) translate(-9.000000, -8.000000)'/%3E%3Cpath d='M40.5,7 L34.75,1.25 L36,-5.17110888e-16 L44,8 L43.375,8.625 L36,16 L34.75,14.75 L40.5,9 L26,9 L26,7 L40.5,7 Z'/%3E%3C/svg%3E");
}

.line-height-minus-button {
  background-size: 34px 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='14' viewBox='0 0 38 14' fill='%233b3b3c'%3E%3Crect x='0' y='0' width='28' height='2'/%3E%3Crect x='0' y='6' width='38' height='2'/%3E%3Crect x='0' y='12' width='18' height='2'/%3E%3C/svg%3E");
}

.line-height-plus-button {
  background-size: 34px 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='24' viewBox='0 0 38 24' fill='%233b3b3c'%3E%3Crect x='0' y='0' width='28' height='2'/%3E%3Crect x='0' y='11' width='38' height='2'/%3E%3Crect x='0' y='22' width='18' height='2'/%3E%3C/svg%3E");
}

/* Mirror the line height buttons if the article is RTL. */
.reader-controls[articledir="rtl"] .line-height-minus-button,
.reader-controls[articledir="rtl"] .line-height-plus-button {
  transform: scaleX(-1);
}

@media print {
  .toolbar {
    display: none !important;
  }
}

/*======= Article content =======*/

/* Note that any class names from the original article that we want to match on
 * must be added to CLASSES_TO_PRESERVE in ReaderMode.jsm, so that
 * Readability.js doesn't strip them out */

.moz-reader-content {
  display: none;
  font-size: 1em;
}

@media print {
  .moz-reader-content p,
  .moz-reader-content code,
  .moz-reader-content pre,
  .moz-reader-content blockquote,
  .moz-reader-content ul,
  .moz-reader-content ol,
  .moz-reader-content li,
  .moz-reader-content figure,
  .moz-reader-content .wp-caption {
    margin: 0 0 10px !important;
    padding: 0 !important;
  }
}

.moz-reader-content h1,
.moz-reader-content h2,
.moz-reader-content h3 {
  font-weight: bold;
}

.moz-reader-content h1 {
  font-size: 1.6em;
  line-height: 1.25em;
}

.moz-reader-content h2 {
  font-size: 1.2em;
  line-height: 1.51em;
}

.moz-reader-content h3 {
  font-size: 1em;
  line-height: 1.66em;
}

.moz-reader-content a:link {
  text-decoration: underline;
  font-weight: normal;
}

.moz-reader-content a:link,
.moz-reader-content a:link:hover,
.moz-reader-content a:link:active {
  color: #0095dd;
}

.moz-reader-content a:visited {
  color: #c2e;
}

.moz-reader-content * {
  max-width: 100%;
  height: auto;
}

.moz-reader-content p,
.moz-reader-content p,
.moz-reader-content code,
.moz-reader-content pre,
.moz-reader-content blockquote,
.moz-reader-content ul,
.moz-reader-content ol,
.moz-reader-content li,
.moz-reader-content figure,
.moz-reader-content .wp-caption {
  margin: -10px -10px 20px;
  padding: 10px;
  border-radius: 5px;
}

.moz-reader-content li {
  margin-bottom: 0;
}

.moz-reader-content li > ul,
.moz-reader-content li > ol {
  margin-bottom: -10px;
}

.moz-reader-content p > img:only-child,
.moz-reader-content p > a:only-child > img:only-child,
.moz-reader-content .wp-caption img,
.moz-reader-content figure img {
  display: block;
}

.moz-reader-content img[moz-reader-center] {
  margin-inline: auto;
}

.moz-reader-content .caption,
.moz-reader-content .wp-caption-text
.moz-reader-content figcaption {
  font-size: 0.9em;
  line-height: 1.48em;
  font-style: italic;
}

.moz-reader-content code,
.moz-reader-content pre {
  white-space: pre-wrap;
}

.moz-reader-content blockquote {
  padding: 0;
  padding-inline-start: 16px;
}

.moz-reader-content ul,
.moz-reader-content ol {
  padding: 0;
}

.moz-reader-content ul {
  padding-inline-start: 30px;
  list-style: disc;
}

.moz-reader-content ol {
  padding-inline-start: 30px;
  list-style: decimal;
}

table,
th,
td {
  border: 1px solid currentColor;
  border-collapse: collapse;
  padding: 6px;
  vertical-align: top;
}

table {
  margin: 5px;
}

/* Visually hide (but don't display: none) screen reader elements */
.moz-reader-content .visually-hidden,
.moz-reader-content .visuallyhidden,
.moz-reader-content .sr-only {
  display: inline-block;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  border-width: 0;
}

/* Hide elements with common "hidden" class names */
.moz-reader-content .hidden,
.moz-reader-content .invisible {
  display: none;
}

/* Enforce wordpress and similar emoji/smileys aren't sized to be full-width,
 * see bug 1399616 for context. */
.moz-reader-content img.wp-smiley,
.moz-reader-content img.emoji {
  display: inline-block;
  border-width: 0;
  /* height: auto is implied from '.moz-reader-content *' rule. */
  width: 1em;
  margin: 0 .07em;
  padding: 0;
}

.reader-show-element {
  display: initial;
}
`
