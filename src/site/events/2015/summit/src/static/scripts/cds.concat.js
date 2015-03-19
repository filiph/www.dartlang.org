/*

 JS Signals <http://millermedeiros.github.com/js-signals/>
 Released under the MIT license
 Author: Miller Medeiros
 Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
*/
(function(i){function h(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function g(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}function e(){this._bindings=[];this._prevParams=null;var a=this;this.dispatch=function(){e.prototype.dispatch.apply(a,arguments)}}h.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):
a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal;delete this._listener;delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+
", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new h(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},
_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){g(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){g(a,"addOnce");return this._registerListener(a,
!0,b,c)},remove:function(a,b){g(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=
b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var f=e;f.Signal=e;typeof define==="function"&&define.amd?define(function(){return f}):typeof module!=="undefined"&&module.exports?module.exports=f:i.signals=
f})(this);

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




var CDS = {};



















/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.EventPublisher = (function() {

  "use strict";

  var eventSignals = {
    resize: new signals.Signal(),
    scroll: new signals.Signal(),
    keyup: new signals.Signal(),
    load: new signals.Signal()
  };
  var target = window;

  function onEvent(evt) {

    if (!eventSignals[evt.type])
      throw 'Unsupported event' + evt.type;

    eventSignals[evt.type].dispatch(evt);

    // It may well be that we have used some addOnce
    // listeners and these may have expired. If so, remove.
    if (eventSignals[evt.type].getNumListeners() > 0)
      return;

    target.removeEventListener(evt.type, onEvent);
  }

  function add(eventName, eventHandler) {
    if (!eventSignals[eventName])
      throw 'Unsupported event: ' + eventName;

    eventSignals[eventName].add(eventHandler);

    // If we have already subscribed for these events
    // we can afford to leave, otherwise subscribe.
    if (eventSignals[eventName].getNumListeners() > 1)
      return;

    target.addEventListener(eventName, onEvent);
  }

  function addOnce(eventName, eventHandler) {
    if (!eventSignals[eventName])
      throw 'Unsupported event: ' + eventName;

    eventSignals[eventName].addOnce(eventHandler);

    // If we have already subscribed for these events
    // we can afford to leave, otherwise subscribe.
    if (eventSignals[eventName].getNumListeners() > 1)
      return;

    target.addEventListener(eventName, onEvent);
  }

  function remove(name) {

    if (!eventSignals[eventName])
      throw 'Unsupported event: ' + eventName;

    eventSignals[eventName].remove(eventHandler);

    // If we still have listeners leave, otherwise remove
    // the event listener.
    if (eventSignals[eventName].getNumListeners() > 0)
      return;

    target.removeEventListener(eventName, onEvent);
  }

  return {
    add: add,
    addOnce: addOnce,
    remove: remove
  };


})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Util = (function() {

  "use strict";
  var appElement = document.querySelector('.app');

  function makeObject(keys, defaultValue) {

    var obj = {};
    for (var i = 0; i < keys.length; i++) {
      obj[keys[i]] = defaultValue;
    }

    return obj;
  }

  function getWindowScrollPosition() {
    if (typeof window.scrollY === 'undefined')
      return document.documentElement.scrollTop;
    else
      return window.scrollY;
  }

  function isIOS() {
    return (/(iPhone|iPad|iPod)/gi).test(navigator.platform);
  }

  function isSafari() {
    var userAgent = navigator.userAgent;
    return (/Safari/gi).test(userAgent) &&
      !(/Chrome/gi).test(userAgent);
  }

  function canRunFastClipAnimations() {
    // Right now the only answer to this is Chrome,
    // but in future I'm hopeful we can expand this.
    var userAgent = navigator.userAgent;
    return (/Chrome/gi).test(userAgent);
  }

  function isIE() {
    var userAgent = navigator.userAgent;
    return (/Trident/gi).test(userAgent);
  }

  return {
    appElement: appElement,
    isIE: isIE,
    isIOS: isIOS,
    isSafari: isSafari,
    canRunFastClipAnimations: canRunFastClipAnimations,
    makeObject: makeObject,
    getWindowScrollPosition: getWindowScrollPosition
  };

})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.History = (function() {

  "use strict";

  var activePath;
  var transitioningCard = null;

  function manageCards(opt_disableAnimation) {

    var currentPath = document.location.pathname;
    var compositePath = '/';

    if (typeof opt_disableAnimation !== 'boolean')
      opt_disableAnimation = false;

    if (activePath === currentPath)
      return;

    if (transitioningCard)
      return;

    // If the new card is not a child of the current section collapse it
    // before opening the new card.
    if (currentPath.indexOf(activePath) === -1 &&
      typeof CDS.Cards[activePath] !== 'undefined') {

      transitioningCard = CDS.Cards[activePath];
      transitioningCard.collapse();

    } else if (typeof CDS.Cards[currentPath] !== 'undefined') {

      // Step up through the path making sure any other cards are enabled
      currentPath.split('/').forEach(function(part) {

        if (part === '')
          return;

        compositePath += part + '/';

        if (compositePath !== currentPath &&
            typeof CDS.Cards[compositePath] !== 'undefined') {

          CDS.Cards[compositePath].expand(true);

        } else if (compositePath === currentPath) {

          transitioningCard = CDS.Cards[currentPath];
          transitioningCard.expand(opt_disableAnimation);
        }
      });
    }

    if (transitioningCard !== null) {
      transitioningCard.addEventListener('transitionend',
          onTransitionEnd.bind(transitioningCard), true);
    }

    activePath = currentPath;
  }

  function onPopState(evt) {
    evt.preventDefault();
    requestAnimFrame(manageCards);
  }

  function onTransitionEnd() {
    transitioningCard = null;
    requestAnimFrame(manageCards);
  }

  function forth(path) {
    window.history.pushState(null, "", path);
    requestAnimFrame(manageCards);
  }

  function back() {
    window.history.back();
  }

  function init() {
    manageCards(true);
    transitioningCard = null;
  }

  function onKeyUp(evt) {

    // We only care about the user hitting escape
    // to collapse the card down.
    if (evt.keyCode !== 27)
      return;

    if (typeof CDS.Cards[activePath] !== 'undefined')
      forth('../');

  }

  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('popstate', onPopState);

  return {
    back: back,
    forth: forth,
    init: init
  };

})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Analytics = (function() {

  "use strict";

  function track(name, type, value) {

    if (typeof ga === 'function') {
      ga('send', 'event', name, type, value);
    }
  }

  return {
    track: track
  };

})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Theme = (function() {

  "use strict";

  var themeMeta = document.querySelector('#theme-color');

  function set(color) {
    themeMeta.content = color;
  }

  return {
    set: set
  };

})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.VideoEmbedder = (function() {

  function embed(element) {

    var containerElement = element.parentNode
        .querySelector('.session__header-image');
    var youtubeURL = /youtube\.com/;
    var urlToEmbed = element.dataset.embed;
    var iframe;

    if (!youtubeURL.test(urlToEmbed))
      return;

    if (containerElement.querySelector('iframe')) {
      iframe = containerElement.querySelector('iframe');
    } else {
      iframe = document.createElement('iframe');
      containerElement.appendChild(iframe);
    }

    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');
    iframe.setAttribute('src', urlToEmbed + '?autoplay=1');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'yes');
    iframe.classList.add('session__video-embed');

    element.classList.add('hidden');
  }

  function killAllEmbeddedVideos() {
    var videos = document.querySelectorAll('.session__video-embed');
    var videoEmbedFABS = document.querySelectorAll('.session__fab');

    for (var i = 0; i < videos.length; i++)
      videos[i].parentNode.removeChild(videos[i]);

    for (var j = 0; j < videoEmbedFABS.length; j++)
      videoEmbedFABS[j].classList.remove('hidden');
  }

  return {
    embed: embed,
    killAllEmbeddedVideos: killAllEmbeddedVideos
  };
})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Button = (function() {

  "use strict";

  var buttons = document.querySelectorAll('.paper-button');
  var button, bound, x, y, ripple, size, transformString;
  var frameCount = 0;

  for (var b = 0; b < buttons.length; b++) {

    button = buttons[b];
    bound = button.getBoundingClientRect();
    size = Math.max(bound.width, bound.height) * 2;

    ripple = button.querySelector('.button__ripple');

    if (!ripple)
      continue;

    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';

    button.addEventListener('click', onClick);
  }

  function onClick(evt) {

    if (frameCount > 0)
      return;

    if (evt.currentTarget.dataset && evt.currentTarget.dataset.embed)
      CDS.VideoEmbedder.embed(evt.currentTarget);

    if (evt.currentTarget.dataset && evt.currentTarget.dataset.url)
      window.location = evt.currentTarget.dataset.url;

    frameCount = 1;
    bound = evt.currentTarget.getBoundingClientRect();
    x = Math.round(evt.clientX - bound.left);
    y = Math.round(evt.clientY - bound.top);
    transformString = 'translate(-50%, -50%) ' +
        'translate(' + x + 'px, ' + y + 'px) ' +
        'scale(0.0001, 0.0001)';

    ripple = evt.currentTarget.querySelector('.button__ripple');
    ripple.style.webkitTransform = transformString;
    ripple.style.transform = transformString;
    ripple.style.opacity = '0.4';
    ripple.classList.remove('button__ripple--animate');

    requestAnimFrame(reset);

  }

  function reset() {

    if (frameCount-- > 0) {
      requestAnimFrame(reset);
    } else {

      transformString = 'translate(-50%, -50%) ' +
          'translate(' + x + 'px, ' + y + 'px)' +
          'scale(1, 1)';

      ripple.style.webkitTransform = transformString;
      ripple.style.transform = transformString;
      ripple.style.opacity = '0';
      ripple.classList.add('button__ripple--animate');
    }
  }


})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Card = function(element) {

  "use strict";

  this.elements_ = {
    root: element,
    seeMoreLink: element.querySelector('.card__see-more'),
    container: element.querySelector('.card__container'),
    title: element.querySelector('.card__title'),
    logo: element.querySelector('.card__logo'),
    contentWrapper: element.querySelector('.card__content-wrapper'),
    collapseButton: element.querySelector('.card__collapse-button')
  };

  // Go with lofi for anything that can't run fast clip animations.
  this.runLoFiAnimations_ = !CDS.Util.canRunFastClipAnimations();
  this.expanded_ = false;
  this.boxPositionOnExpand_ = null;
  this.preventChangesToTitleScale_ =
      this.elements_.root.classList.contains('card--no-title-scale');
  this.preventChangesToTitleOpacityOnScroll_ =
      this.elements_.root.classList
          .contains('card--no-title-opacity-during-scroll');

  // We need to disable fixed position navigation on cards for iOS
  // as it causes judder during scrolls.
  if (CDS.Util.isIOS())
    this.elements_.root.classList.add('card__no-fixed-header');

  this.parts_ = Object.keys(this.elements_);
  this.properties_ = [
      'left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'opacity'];
  this.collapsedPositions_ = CDS.Util.makeObject(this.parts_, null);
  this.expandedPositions_ = CDS.Util.makeObject(this.parts_, null);
  this.contentColor_ = window.getComputedStyle(
      this.elements_.container).backgroundColor;

  this.diffs_ = {
    root: CDS.Util.makeObject(this.properties_, 0),
    seeMoreLink: CDS.Util.makeObject(this.properties_, 0),
    container: CDS.Util.makeObject(this.properties_, 0),
    title: CDS.Util.makeObject(this.properties_, 0),
    logo: CDS.Util.makeObject(this.properties_, 0),
    contentWrapper: CDS.Util.makeObject(this.properties_, 0),
    collapseButton: CDS.Util.makeObject(this.properties_, 0)
  };

  this.events_ = {
    expand: new signals.Signal(),
    collapse: new signals.Signal(),
    transitionend: new signals.Signal()
  };

  // Ensure there is a copy of the callback functions per card.
  this.onSeeMoreLinkClick_ = this.onSeeMoreLinkClick_.bind(this);
  this.onCollapseButtonClick_ = this.onCollapseButtonClick_.bind(this);
  this.onCollapseTransitionEnd_ = this.onCollapseTransitionEnd_.bind(this);
  this.onExpandTransitionEnd_ = this.onExpandTransitionEnd_.bind(this);
  this.onCardContentScroll_ = this.onCardContentScroll_.bind(this);
  this.onWindowResize_ = this.onWindowResize_.bind(this);
  this.disableTabbingToLinks_ = this.disableTabbingToLinks_.bind(this);

  this.elements_.seeMoreLink.addEventListener('click',
      this.onSeeMoreLinkClick_);
  this.elements_.collapseButton.addEventListener('click',
      this.onCollapseButtonClick_);

  this.elements_.container.addEventListener('scroll',
      this.onCardContentScroll_);

  CDS.EventPublisher.add('resize', this.onWindowResize_);

  this.disableTabbingToLinks_();
};

CDS.Card.prototype = {

  onWindowResize_: function(evt) {

    if (!this.expanded_)
      return;

    this.onCardContentScroll_(evt);
  },

  onExpandTransitionEnd_: function(evt) {

    if (typeof evt !== 'undefined' &&
        evt.target !== this.elements_.container)
      return;

    this.elements_.container.classList.add('card__container--scrollable');
    this.elements_.root.classList.remove('card--animatable');

    if (this.runLoFiAnimations_)
      this.elements_.container.classList.remove(
          'card__container--lofi-animations');

    this.resetElementTransformsAndOpacity_();
    this.resetElementClip_();

    this.elements_.container.removeEventListener('transitionend',
        this.onExpandTransitionEnd_);
    this.elements_.container.removeEventListener('webkittransitionend',
        this.onExpandTransitionEnd_);

    this.enableTabbingToLinksAndFocusBackButton_();
    this.events_.transitionend.dispatch(this);
  },

  onCollapseTransitionEnd_: function(evt) {

    if (typeof evt !== 'undefined' &&
        evt.target !== this.elements_.contentWrapper)
      return;

    this.expanded_ = false;
    this.elements_.root.classList.remove('card--expanded');
    this.elements_.root.classList.remove('card--collapsing');
    this.elements_.root.classList.remove('card--animatable');

    this.resetElementTransformsAndOpacity_();
    this.resetElementClip_();

    this.elements_.contentWrapper.removeEventListener('transitionend',
        this.onCollapseTransitionEnd_);
    this.elements_.contentWrapper.removeEventListener('webkittransitionend',
        this.onCollapseTransitionEnd_);

    this.disableTabbingToLinks_();
    this.events_.transitionend.dispatch(this);
  },

  onCardContentScroll_: function(evt) {

    var range = 50;
    var y = this.elements_.container.scrollTop;
    var width = window.innerWidth;
    var target = width < 900 ? this.elements_.logo : this.elements_.title;

    if (y < 0)
      return;

    if (this.preventChangesToTitleOpacityOnScroll_)
      return;

    this.elements_.logo.style.opacity = 1;
    this.elements_.title.style.opacity = 1;

    target.style.opacity = 1 - Math.min(1, Math.max(0, y / range));

    if (width > 900) {
      this.elements_.container.classList.remove('card--navbar-shadow');
      return;
    }

    if (y > 145)
      this.elements_.container.classList.add('card--navbar-shadow');
    else
      this.elements_.container.classList.remove('card--navbar-shadow');
  },

  onSeeMoreLinkClick_: function(evt) {

    CDS.History.forth(this.elements_.seeMoreLink.href);

    evt.preventDefault();
    evt.stopImmediatePropagation();
  },

  onCollapseButtonClick_: function(evt) {

    CDS.History.forth('../');

    if (typeof evt === 'undefined')
      return;

    evt.preventDefault();
    evt.stopImmediatePropagation();
  },

  disableTabbingToLinks_: function() {

    this.elements_.collapseButton.setAttribute('tabindex', -1);

    var contentLinks = this.elements_.contentWrapper.querySelectorAll('a');
    for (var i = 0; i < contentLinks.length; i++) {
      contentLinks[i].setAttribute('tabindex', -1);
    }

  },

  enableTabbingToLinksAndFocusBackButton_: function() {

    this.elements_.collapseButton.focus();
    this.elements_.collapseButton.setAttribute('tabindex', 1);

    var contentLinks = this.elements_.contentWrapper.querySelectorAll('a');
    for (var i = 0; i < contentLinks.length; i++) {
      contentLinks[i].setAttribute('tabindex', (i + 2));
    }
  },

  applyClipRect_: function() {
    if (!this.expanded_)
      return;

    var contentLocation = this.elements_.container.getBoundingClientRect();
    this.elements_.container.style.clip = 'rect(0, ' +
        contentLocation.width + 'px, ' +
        contentLocation.height + 'px, 0)';
  },

  getContentColor: function() {
    return this.contentColor_;
  },

  getRootElement: function() {
    return this.elements_.root;
  },

  isExpanded: function() {
    return this.expanded_;
  },

  addEventListener: function(name, callback, addOnce) {
    if (!this.events_[name])
      throw "Unknown event type: " + name;

    if (addOnce)
      this.events_[name].addOnce(callback);
    else
      this.events_[name].add(callback);
  },

  expand: function(opt_disableAnimations) {

    if (typeof opt_disableAnimations === 'undefined')
      opt_disableAnimations = false;

    if (this.expanded_)
      return;

    this.boxPositionOnExpand_ = this.elements_.root.getBoundingClientRect();
    this.expanded_ = true;

    // Read the viewport position of the card and elements.
    this.collectProperties_(this.collapsedPositions_);

    // Set the expanded class
    this.elements_.root.classList.add('card--expanded');
    this.elements_.container.classList.add('card__container--scrollable');

    // Read them in their expanded positions.
    this.collectProperties_(this.expandedPositions_);

    // Calculate the position differences.
    this.calculatePositionDiffs_();

    // Bail here if we're not animating.
    if (opt_disableAnimations) {

      // Set the positions and clip on exit.
      this.setElementTransformsToZeroAndClipToExpanded_();
      this.onExpandTransitionEnd_();
      this.events_.expand.dispatch(this);
      return;
    }

    // Set them all back to collapsed.
    this.setElementTransformsToStartAndClipToCollapsed_();

    // Read again to force the style change to take hold.
    var readValue2 = this.elements_.root.offsetTop;

    // Switch on animations.
    this.elements_.root.classList.add('card--animatable');

    // Now expand.
    this.setElementTransformsToZeroAndClipToExpanded_();

    this.elements_.container.addEventListener('transitionend',
        this.onExpandTransitionEnd_);
    this.elements_.container.addEventListener('webkittransitionend',
        this.onExpandTransitionEnd_);

    this.events_.expand.dispatch(this);

    CDS.Analytics.track('card', 'expand', this.elements_.seeMoreLink.href);
  },

  collapse: function(opt_disableAnimations) {

    if (typeof opt_disableAnimations === 'undefined')
      opt_disableAnimations = false;

    if (!this.expanded_)
      return;

    this.applyClipRect_();
    this.elements_.root.classList.add('card--collapsing');
    this.elements_.root.classList.add('card--animatable');

    if (this.runLoFiAnimations_) {

      this.elements_.container.classList.add(
          'card__container--lofi-animations');
    }

    this.elements_.container.scrollTop = 0;
    this.elements_.container.classList.remove('card__container--scrollable');

    this.elements_.contentWrapper.addEventListener('transitionend',
        this.onCollapseTransitionEnd_);
    this.elements_.contentWrapper.addEventListener('webkittransitionend',
        this.onCollapseTransitionEnd_);

    this.setElementTransformsToStartAndClipToCollapsed_();

    this.events_.collapse.dispatch(this);

    CDS.Analytics.track('card', 'collapse', this.elements_.seeMoreLink.href);

  },

  resetElementTransformsAndOpacity_: function() {
    var part;
    for (var p = 0; p < this.parts_.length; p++) {
      part = this.parts_[p];

      this.setElementTransformAndOpacity_(this.elements_[part], '', '');
    }
  },

  resetElementClip_: function() {
    this.elements_.container.style.clip = '';
  },

  setElementTransformsToStartAndClipToCollapsed_: function() {

    // Work out if the root element has moved and adjust
    // the values for the animation correspondingly.
    var currentBoxPosition = this.elements_.root.getBoundingClientRect();
    var leftDifference = currentBoxPosition.left -
        this.boxPositionOnExpand_.left;
    var topDifference = currentBoxPosition.top -
        this.boxPositionOnExpand_.top;

    var part;
    for (var p = 0; p < this.parts_.length; p++) {
      part = this.parts_[p];

      // We don't need or want to move the container or the root
      // element during this animation so ignore them.
      if (part === 'container' || part === 'root')
        continue;

      // Adjust for changes in scroll position since the card expanded.
      this.diffs_[part].top += topDifference;
      this.diffs_[part].left += leftDifference;

      this.setElementTransformAndOpacity_(this.elements_[part],
          this.diffs_[part], this.diffs_[part].opacity);
    }

    if (this.runLoFiAnimations_) {

      this.diffs_.container.top += topDifference;
      this.diffs_.container.left += leftDifference;

      this.elements_.container.classList.add(
          'card__container--lofi-animations');
      this.setElementTransformAndOpacity_(this.elements_.container,
          this.diffs_.container);

      return;

    }

    var clipLeft = this.collapsedPositions_.container.left + leftDifference;
    var clipRight = this.collapsedPositions_.container.right + leftDifference;
    var clipTop = this.collapsedPositions_.container.top + topDifference;
    var clipBottom = this.collapsedPositions_.container.bottom + topDifference;

    this.elements_.container.style.clip = 'rect(' +
        clipTop + 'px, ' +
        clipRight + 'px, ' +
        clipBottom + 'px, ' +
        clipLeft + 'px)';

  },

  setElementTransformsToZeroAndClipToExpanded_: function() {

    var part;
    for (var p = 0; p < this.parts_.length; p++) {
      part = this.parts_[p];

      if (part === 'container' && !this.runLoFiAnimations_)
        continue;

      if (part === 'root')
        continue;

      this.setElementTransformAndOpacity_(this.elements_[part],
          'translate(0,0) scale(1)',
          this.expandedPositions_[part].opacity);
    }

    this.elements_.container.style.clip = 'rect(' +
        this.expandedPositions_.container.top + 'px, ' +
        this.expandedPositions_.container.right + 'px, ' +
        this.expandedPositions_.container.bottom + 'px, ' +
        this.expandedPositions_.container.left + 'px)';

  },

  setElementTransformAndOpacity_: function(element, transform, opacity) {

    var transformString = transform;

    if (typeof transform !== 'string') {
      transformString = 'translate(' +
          transform.left + 'px,' +
          transform.top + 'px)';

      if (element !== this.elements_.contentWrapper &&
          element !== this.elements_.content)
        transformString += ' scale(' +
            transform.scaleX + ', ' +
            transform.scaleY + ')';
    }

    element.style.webkitTransform = transformString;
    element.style.transform = transformString;

    if (typeof opacity !== 'undefined')
      element.style.opacity = opacity;
  },

  collectProperties_: function(target) {
    var part, rect;
    for (var p = 0; p < this.parts_.length; p++) {
      part = this.parts_[p];
      rect = this.elements_[part].getBoundingClientRect();

      // We need to make a copy here because the gBCR call
      // gives us an immutable object.
      target[part] = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom
      };

      target[part].opacity = parseFloat(window.getComputedStyle(
          this.elements_[part]).opacity);

      // We need to limit the size for browsers that
      // allow bleed past the edge of the viewport.
      target[part].width = Math.min(target[part].width, window.innerWidth);
      target[part].height = Math.min(target[part].height, window.innerHeight);
    }
  },

  calculatePositionDiffs_: function() {

    var part;
    for (var p = 0; p < this.parts_.length; p++) {
      part = this.parts_[p];

      this.diffs_[part].left = this.collapsedPositions_[part].left -
          this.expandedPositions_[part].left;

      this.diffs_[part].top = this.collapsedPositions_[part].top -
          this.expandedPositions_[part].top;

      this.diffs_[part].width = this.collapsedPositions_[part].width -
          this.expandedPositions_[part].width;

      this.diffs_[part].height = this.collapsedPositions_[part].height -
          this.expandedPositions_[part].height;

      this.diffs_[part].scaleX = this.collapsedPositions_[part].width /
          this.expandedPositions_[part].width;

      this.diffs_[part].scaleY = this.collapsedPositions_[part].height /
          this.expandedPositions_[part].height;

      if (part === 'title' && this.preventChangesToTitleScale_)
        this.diffs_[part].scaleX = this.diffs_[part].scaleY = 1;

      this.diffs_[part].opacity = 1 - (this.expandedPositions_[part].opacity -
          this.collapsedPositions_[part].opacity);

    }

  }

};

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Cards = (function() {

  "use strict";

  var cardElements = document.querySelectorAll('.card');
  var card;
  var cards = {};
  var cardId = '';

  function onCardChange() {

    CDS.VideoEmbedder.killAllEmbeddedVideos();

    if (!CDS.Cards[window.location.pathname]) {
      CDS.Theme.set('#362A6C');
      return;
    }

    var currentCard = CDS.Cards[window.location.pathname];
    CDS.Theme.set(currentCard.getContentColor());
  }

  for (var i = 0; i < cardElements.length; i++) {
    card = cardElements[i];
    cardId = card.querySelector('.card__see-more').getAttribute('href');
    cards[cardId] = new CDS.Card(card);
    cards[cardId].addEventListener('expand', onCardChange);
    cards[cardId].addEventListener('collapse', onCardChange);
  }

  return cards;

})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Toast = function(message) {

  this.element_ = document.createElement('div');
  this.elementInner_ = document.createElement('div');

  this.elementInner_.innerText = message;

  this.element_.classList.add('toast');
  this.elementInner_.classList.add('toast__message');

  this.hide = this.hide.bind(this);

  this.element_.appendChild(this.elementInner_);
  document.body.appendChild(this.element_);

  requestAnimFrame(this.hide);

  return this;
};

CDS.Toast.prototype = {

  hide: function() {
    this.element_.classList.add('toast__hidden');
    this.element_.addEventListener('transitionend', this.remove_);
    this.element_.addEventListener('webkittransitionend', this.remove_);
  },

  remove_: function() {

    if (!this.element_)
      return;

    document.removeChild(this.element_);
  }
};

CDS.Toaster = {
  create: function(message) {
    return new CDS.Toast(message);
  }
};

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Masthead = (function() {

  "use strict";

  var RANGE = 30;
  var masthead = document.querySelector('.masthead');
  var mastheadColorBlock = masthead.querySelector('.masthead__color-block');
  var y;

  function onScroll() {

    y = CDS.Util.getWindowScrollPosition();

    if (y < 0)
      return;

    mastheadColorBlock.style.opacity = Math.min(1, Math.max(0, y / RANGE));
  }

  CDS.EventPublisher.add('scroll', onScroll);

})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CDS.Schedule = (function() {

  "use strict";

  var dPR = window.devicePixelRatio;
  var card = CDS.Cards['/events/2015/summit/schedule/'];
  var rootElement = card.getRootElement();
  var container = rootElement.querySelector('.schedule__overview-container');
  var canvas = rootElement.querySelector('canvas');
  var day1Button = rootElement.querySelector('.schedule__day-1');
  var day2Button = rootElement.querySelector('.schedule__day-2');
  var ctx = canvas.getContext('2d');

  var padding = {
    top: 82,
    bottom: 74,
    left: 16,
    right: 54
  };
  var lineOvershoot = 10;
  var rootWidth = 0;
  var rootHeight = 0;
  var labelWidth = 165;
  var availableWidth = 0;
  var availableHeight = 0;
  var selectedDay = 0;
  var today = new Date();
  var day1HitArea = {
    x: 0, y: 0,
    width: 50, height: 26
  };
  var day2HitArea = {
    x: 0, y: 0,
    width: 50, height: 26
  };

  var WHITE = '#FFF';
  var PURPLE = '#362A6C';
  var BLUE = '#4A90E2';

  var days = [{
    "Registration": [{
      start: 8.5, duration: 1
    }],
    "Keynote": [{
      start: 9.5, duration: 0.5
    }],
    "Sessions": [{
      start: 10, duration: 0.5
    }, {
      start: 11, duration: 1
    },{
      start: 12.5, duration: 0.5
    },{
      start: 14.5, duration: 1
    }, {
      start: 16.5, duration: 1
    }],
    "Interactive": [{
      start: 12, duration: 0.5,
    }, {
      start: 15.5, duration: 0.5
    }],
    "Break": [{
      start: 10.5, duration: 0.5
    },{
      start: 13, duration: 1.5
    },{
      start: 16, duration: 0.5
    }],
    "Lightning Talks": [{
      start: 17.5, duration: 0.5
    }],
    "After Party": [{
      start: 18, duration: 4
    }]
  },
  {
    "Registration": [{
      start: 8.5, duration: 1
    }],
    "Keynote": [{
      start: 9.5, duration: 0.5
    }],
    "Sessions": [{
      start: 10, duration: 0.5
    }, {
      start: 11, duration: 1
    },{
      start: 12.5, duration: 0.5
    },{
      start: 14.5, duration: 1
    }, {
      start: 16.5, duration: 1
    }],
    "Interactive": [{
      start: 12, duration: 0.5,
    }, {
      start: 15.5, duration: 0.5
    }],
    "Break": [{
      start: 10.5, duration: 0.5
    },{
      start: 13, duration: 1.5
    },{
      start: 16, duration: 0.5
    }]
  }];
  var dayData = {};

  function getHoursRange(dayId) {
    var min = Number.POSITIVE_INFINITY;
    var max = Number.NEGATIVE_INFINITY;
    var day = days[dayId];
    var section, blocks, block;

    if (dayData[dayId])
      return dayData[dayId];

    var sections = Object.keys(day);
    for (var s = 0; s < sections.length; s++) {
      section = sections[s];
      for (var t = 0; t < day[section].length; t++) {
        blocks = day[section];

        for (var b = 0; b < blocks.length; b++) {
          block = blocks[b];
          if (block.start < min)
            min = block.start;
          if (block.start + block.duration > max)
            max = block.start + block.duration;
        }
      }
    }

    dayData[dayId] = {
      min: min,
      max: max
    };

    return dayData[dayId];
  }

  function onResize() {

    rootWidth = rootElement.offsetWidth;
    rootHeight = rootElement.offsetHeight;

    canvas.width = rootWidth * dPR;
    canvas.height = rootHeight * dPR;

    ctx.scale(dPR, dPR);

    canvas.style.width = rootWidth + 'px';
    canvas.style.height = rootHeight + 'px';

    availableWidth = rootWidth - labelWidth - padding.left - padding.right;
    availableHeight = rootHeight - padding.top - padding.bottom;

    day1HitArea.x = rootWidth - 136;
    day1HitArea.y = 20;

    day2HitArea.x = rootWidth - 66;
    day2HitArea.y = 20;

    draw();
  }

  function clear() {
    ctx.clearRect(0, 0, rootWidth, rootHeight);
    // ctx.fillStyle = PURPLE;
    // ctx.fillRect(padding.left + labelWidth, padding.top,
    //    availableWidth, availableHeight);
  }

  function draw() {

    clear();
    var timeRange = getHoursRange(selectedDay);
    drawLinesAndTimes(timeRange);
    drawBlocksAndLabels(timeRange);
    updateDayLabels();
  }

  function updateDayLabels() {

    if (selectedDay === 0)
      day1Button.classList.remove('schedule__day-1--inactive');
    else
      day1Button.classList.add('schedule__day-1--inactive');

    if (selectedDay === 1)
      day2Button.classList.remove('schedule__day-2--inactive');
    else
      day2Button.classList.add('schedule__day-2--inactive');
  }

  function drawLinesAndTimes(timeRange) {

    var range = timeRange.max - timeRange.min;
    var step = Math.floor(availableWidth / range);
    var x, time;
    var lineHeight = availableHeight + lineOvershoot * 2;

    ctx.save();
    ctx.translate(padding.left + labelWidth + 0.5,
        padding.top + 0.5 - lineOvershoot);
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#FFF';
    ctx.globalAlpha = 0.3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    var crossedNoon = false;

    for (var r = 0; r <= range; r++) {

      x = r * step;
      time = (timeRange.min + r);

      if (time >= 13) {
        time = time - 12;
      }

      if (time % 1 == 0.5) {
        time = (time - (time % 1)) + ':30';
      }

      if (r === 0)
        time += 'AM';
      
      if (!crossedNoon && (timeRange.min + r) >= 12) {
        time += 'PM';
        crossedNoon = true;
      }

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, lineHeight);
      ctx.stroke();
      ctx.closePath();

      ctx.font = '500 14px/1 Roboto';
      ctx.fillText(time, x, lineHeight + 5);
    }
    ctx.restore();
  }

  function drawBlocksAndLabels(timeRange) {

    var range = timeRange.max - timeRange.min;
    var day = days[selectedDay];
    var height = 10;
    var halfHeight = height * 0.5;
    var section, blocks, block, x, y, width;
    var sections = Object.keys(day);
    var widthStep = Math.floor(availableWidth / range);
    var heightStep = (availableHeight - height) / (sections.length - 1);

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.translate(padding.left, padding.top);

    for (var s = 0; s < sections.length; s++) {

      section = sections[s];
      y = Math.floor(s * heightStep);

      ctx.fillStyle = WHITE;
      ctx.globalAlpha = 0.56;
      ctx.font = '300 16px/1 Roboto';
      ctx.fillText(section, 0, y - halfHeight);

      ctx.fillStyle = BLUE;
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.translate(labelWidth, 0);

      for (var t = 0; t < day[section].length; t++) {
        blocks = day[section];

        for (var b = 0; b < blocks.length; b++) {
          block = blocks[b];

          x = Math.floor((block.start - timeRange.min) * widthStep);
          width = Math.round(block.duration * widthStep);

          ctx.fillRect(x, y, width, height);
        }
      }

      ctx.restore();
    }

    ctx.restore();

  }

  function onDay1ButtonClick(evt) {
    evt.preventDefault();
    selectedDay = 0;
    draw();
  }

  function onDay2ButtonClick(evt) {
    evt.preventDefault();
    selectedDay = 1;
    draw();
  }

  function onExpand() {
    container.classList.add('schedule__overview-container--hidden');
  }

  function onCollapse() {
    container.classList.remove('schedule__overview-container--hidden');
  }

  function onLoad() {
    draw();
  }

  if (today.getMonth() === 10 &&
      today.getDate() === 20 &&
      today.getFullYear() === 2014) {
    selectedDay = 1;
  }

  (function init() {

    day1Button.addEventListener('click', onDay1ButtonClick);
    day2Button.addEventListener('click', onDay2ButtonClick);

    card.addEventListener('expand', onExpand);
    card.addEventListener('collapse', onCollapse);
    onResize();
    clear();
  })();

  CDS.EventPublisher.add('resize', onResize);
  CDS.EventPublisher.add('load', onLoad);

})();

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
CDS.EventPublisher.add('load', function() {

  // Remove the color-blocks
  document.body.classList.remove('deeplink-schedule');
  document.body.classList.remove('deeplink-sessions');
  document.body.classList.remove('deeplink-attendee-information');
  document.body.classList.remove('deeplink-get-involved');
  document.body.classList.remove('deeplink-about-chrome-dev-summit');

  document.body.classList.add('loaded');

});

CDS.History.init();

// Not yet. Will come back to this.
// if ('serviceWorker' in navigator) {

//   navigator.serviceWorker.register('/events/2015/summit/sw.js', {
//     scope: '/events/2015/summit/'
//   }).then(function(registration) {

//     var newServiceWorkerAvailableMessage =
//         'A new version of this page is available. Please force-refresh.';

//     // If this fires we should check if there's a new Service Worker
//     // waiting to be activated. If so, ask the user to force refresh.
//     if (registration.waiting) {
//       CDS.Toaster.create(newServiceWorkerAvailableMessage);
//       return;
//     }

//     // We should also start tracking for any updates to the Service Worker.
//     registration.onupdatefound = function(event) {

//       console.log("A new version has been found... Installing...");

//       // If an update is found the spec says that there is a new Service Worker
//       // installing, so we should wait for that to complete then show a
//       // notification to the user.
//       registration.installing.onstatechange = function(event) {
//         if (this.state === 'installed')
//           CDS.Toaster.create(newServiceWorkerAvailableMessage);
//         else
//           console.log("New Service Worker state: ", this.state);
//       };
//     };
//   }, function(err) {
//     console.log(err);
//   });
// }
