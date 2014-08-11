/* global marked, prettyPrint */
;(function(window, document, marked, prettyPrint) {
  'use strict';

  //////////////////////////////////////////////////////////////////////
  //
  // Shims for IE < 9
  //
  var i, ii;
  document.head = document.getElementsByTagName('head')[0];

  if (!('getElementsByClassName' in document)) {
    document.getElementsByClassName = function(name) {
      function getElementsByClassName(node, classname) {
        var a = [];
        var re = new RegExp('(^| )'+classname+'( |$)');
        var els = node.getElementsByTagName('*');
        for(var i=0,j=els.length; i<j; i++) {
          if(re.test(els[i].className)) {
            a.push(els[i]);
          }
        }
        return a;
      }
      return getElementsByClassName(document.body, name);
    };
  }

  //////////////////////////////////////////////////////////////////////
  //
  // Get user elements we need
  //

  var markdownEl = document.getElementsByTagName('xmp')[0] || document.getElementsByTagName('textarea')[0],
      titleEl = document.getElementsByTagName('title')[0],
      scriptEls = document.getElementsByTagName('script'),
      navbarEl = document.getElementsByClassName('navbar')[0];

  if (!markdownEl) {
    console.warn('No embedded Markdown found in this document for Strapdown.js to work on! Visit http://strapdownjs.com/ to learn more.');
    return;
  }

  // Hide body until we're done fiddling with the DOM
  document.body.style.display = 'none';

  //////////////////////////////////////////////////////////////////////
  //
  // <head> stuff
  //

  // Use <meta> viewport so that Bootstrap is actually responsive on mobile
  var metaEl = document.createElement('meta');
  metaEl.name = 'viewport';
  metaEl.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0';
  if (document.head.firstChild) {
    document.head.insertBefore(metaEl, document.head.firstChild);
  } else {
    document.head.appendChild(metaEl);
  }

  // Get origin of script
  var origin = '';
  for (i = 0; i < scriptEls.length; i++) {
    if (scriptEls[i].src.match('strapdown')) {
      origin = scriptEls[i].src;
    }
  }
  var originBase = origin.substr(0, origin.lastIndexOf('/'));
  window.originBase = originBase;

  // Get theme
  var theme = markdownEl.getAttribute('theme') || 'bootstrap';
  theme = theme.toLowerCase();

  // Stylesheets
  var linkEl = document.createElement('link');
  // linkEl.href = originBase + '/themes/'+theme+'.min.css';
  // linkEl.rel = 'stylesheet';
  // document.head.appendChild(linkEl);

  linkEl = document.createElement('link');
  linkEl.href = originBase + '/strapdown.css';
  linkEl.rel = 'stylesheet';
  document.head.appendChild(linkEl);

  //////////////////////////////////////////////////////////////////////
  //
  // Extra features

  // var delayedLoads = [];

  // Table of contents
  if (markdownEl.getAttribute('toc')) {
    // Extra features: back to top
    var tocTopLink = markdownEl.getAttribute('toc-top-link');
    if (tocTopLink) {
      window.strapdownToc = {
        includeBackToTopLink: true
      };

      if (tocTopLink !== '1' && tocTopLink !== 'true') {
        window.strapdownToc.backToTopLinkLabel = tocTopLink;
      }
    }

    // delayedLoads.push(function ()  {
    //   var scriptEl;

    //   scriptEl = document.createElement('script');
    //   scriptEl.src = originBase + '/strapdown-toc.js';
    //   document.head.appendChild(scriptEl);

    //   linkEl = document.createElement('link');
    //   linkEl.href = originBase + '/strapdown-toc.css';
    //   linkEl.rel = 'stylesheet';
    //   document.head.appendChild(linkEl);
    // });
  }


  //////////////////////////////////////////////////////////////////////
  //
  // <body> stuff
  //

  var markdown = markdownEl.textContent || markdownEl.innerText;


  var newNode = document.createElement('div');
  newNode.className = 'container';
  newNode.innerHTML = '<div id="content"></div>';
  markdownEl.parentNode.replaceChild(newNode, markdownEl);

  // Insert navbar if there's none
  newNode = document.createElement('div');
  newNode.className = 'navbar navbar-inverse navbar-fixed-top';
  if (!navbarEl && titleEl) {
    newNode.innerHTML = '<div class="container"> <div class="navbar-header"> <div id="headline" class="navbar-brand"></div> </div> </div>';
    document.body.insertBefore(newNode, document.body.firstChild);
    var title = titleEl.innerHTML;
    var headlineEl = document.getElementById('headline');
    if (headlineEl) {
      headlineEl.innerHTML = title;
    }
  }

  //////////////////////////////////////////////////////////////////////
  //
  // Markdown!
  //

  // Generate Markdown
  var html = marked(markdown);
  document.getElementById('content').innerHTML = html;

  // Prettify
  var codeEls = document.getElementsByTagName('code');
  for (i=0, ii=codeEls.length; i<ii; i++) {
    var codeEl = codeEls[i];
    var lang = codeEl.className;
    codeEl.className = 'prettyprint lang-' + lang;
  }
  prettyPrint();

  // Style tables
  var tableEls = document.getElementsByTagName('table');
  for (i=0, ii=tableEls.length; i<ii; i++) {
    var tableEl = tableEls[i];
    tableEl.className = 'table table-striped table-bordered';
  }

  // Make the images responsive
  var imgEls = document.getElementsByTagName('img');
  for (i=0, ii=imgEls.length; i<ii; i++) {
    var imgEl = imgEls[i];
    imgEl.className = 'img-responsive';
  }

  // All done - show body
  document.body.style.display = '';

  // Register the delayed loads
  // window.onload = function() {
  //   for (var i=0, ii=delayedLoads.length; i<ii; i++) {
  //     delayedLoads[i]();
  //   }
  // };
})(window, document, marked, prettyPrint);
