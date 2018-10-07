/******************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

******************************************************************************/

// @format

/* global window */

highed.CustomizePage = function(parent, options, chartPreview, chartFrame, props, chartContainer, planCode) {
  var events = highed.events(),
    // Main properties
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox highed-box-size'
    ),
    title = highed.dom.cr('div', 'highed-toolbox-body-title'),
    customizeTitle,
    contents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-inner-body'
    ),
    userContents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-user-contents test'
    ),
    helpIcon = highed.dom.cr(
      'div',
      'highed-toolbox-help highed-icon fa fa-question-circle'
    ),
    width,
    chartWidth = '68%',
    iconClass,
    icon = highed.dom.cr('div', iconClass),
    helpModal,
    // Data table
    customizerContainer = highed.dom.cr('div', 'highed-box-size highed-fill'), 
    customizer,
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
    ),
    iconsContainer = highed.dom.cr('div', 'highed-icons-container'),

    buttons = [
      {
        tooltip: 'Basic',
        onClick: function() {
          reduceSize(customizer.showSimpleEditor);
        },
        icon: 'cog'
      },
      {
        tooltip: 'Advanced',
        onClick: function() {
          customizer.showAdvancedEditor();
        },
        icon: 'cogs'
      },
      {
        tooltip: 'Custom Code',
        onClick: function() {
          reduceSize(customizer.showCustomCode);
        },
        icon: 'code'
      },
      {
        tooltip: 'Preview Options',
        onClick: function() {

          reduceSize(customizer.showPreviewOptions);

        },
        icon: 'eye'
      },
    ],

    isVisible = false,
    searchAdvancedOptions = highed.SearchAdvancedOptions(parent),
    resolutionSettings = highed.dom.cr('span', 'highed-resolution-settings'),
    phoneIcon = highed.dom.cr('span', '', '<i class="fa fa-mobile" aria-hidden="true"></i>');
    tabletIcon = highed.dom.cr('span', '', '<i class="fa fa-tablet" aria-hidden="true"></i>'),
    tabletIcon = highed.dom.cr('span', '', '<i class="fa fa-tablet" aria-hidden="true"></i>'),
    stretchToFitIcon = highed.dom.cr('span', '', '<i class="fa fa-laptop" aria-hidden="true"></i>'),
    chartSizeText = highed.dom.cr('span', 'text', 'Chart Size:'),
    resWidth = highed.dom.cr('input', 'highed-res-number'),
    resHeight = highed.dom.cr('input', 'highed-res-number'),
    resolutions = [
      {
        iconElement: phoneIcon,
        width: 414,
        height: 736
      },
      {
        iconElement: tabletIcon,
        width: 1024,
        height: 768
      }
    ],
    overlayAddTextModal = highed.OverlayModal(false, {
      // zIndex: 20000,
      showOnInit: false,
      width: 300,
      height: 350
    }),
    activeColor = 'rgba(0, 0, 0, 0.75)',
    addTextModalContainer = highed.dom.cr('div', 'highed-add-text-popup'),
    addTextModalInput = highed.dom.cr('textarea', 'highed-imp-input-stretch'),
    colorDropdownParent = highed.dom.cr('div'),
    typeDropdownParent = highed.dom.cr('div'),
    addTextModalColorSelect = highed.DropDown(colorDropdownParent),
    addTextModalTypeSelect = highed.DropDown(typeDropdownParent),
    addTextModalSubmit = highed.dom.cr('button', 'highed-ok-button highed-dtable-gsheet-button', 'Submit'),
    addLabelX = null,
    addLabelY = null;
    
    resWidth.placeholder = 'W';
    resHeight.placeholder = 'H';

    addTextModalColorSelect.addItems([
      {
        title: 'Black',
        id: 'black',
        select: function() {
          activeColor = 'rgba(0, 0, 0, 0.75)';
        }
      },
      {
        title: 'Red',
        id: 'red',
        select: function() {
          activeColor = 'rgba(255, 0, 0, 0.75)';
        }
      },
      {
        title: 'Blue',
        id: 'blue',
        select: function() {
          activeColor = 'rgba(0, 0, 255, 0.75)';
        }
      }
    ]);

    addTextModalColorSelect.selectByIndex(0);

    addTextModalTypeSelect.addItems([
      {
        title: 'Callout',
        id: 'callout'
      },
      {
        title: 'Connector',
        id: 'connector'
      },
      {
        title: 'Circle',
        id: 'circle'
      }
    ]);

    addTextModalTypeSelect.selectByIndex(0);

    highed.dom.ap(overlayAddTextModal.body,
      highed.dom.ap(addTextModalContainer, 
                    highed.dom.cr('div', 'highed-add-text-label', 'Text:'),
                    addTextModalInput,
                    highed.dom.cr('div', 'highed-add-text-label', 'Color:'),
                    colorDropdownParent,
                    highed.dom.cr('div', 'highed-add-text-label', 'Type:'),
                    typeDropdownParent,
                    addTextModalSubmit
                  )
    );

    highed.dom.on(addTextModalSubmit, 'click', function() {
      overlayAddTextModal.hide();
      chartPreview.addAnnotationLabel(addLabelX, addLabelY, addTextModalInput.value.replace('\n', '<br/>'), activeColor, addTextModalTypeSelect.getSelectedItem());

      addTextModalTypeSelect.selectByIndex(0);
      addTextModalTypeSelect.selectByIndex(0);
      addTextModalInput.value = '';

    });

  function init() {

    width = props.width,
    customizeTitle = highed.dom.cr('div', 'highed-customize-title'/*, props.title*/),
    iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon;

    customizerContainer.innerHTML = '';

    customizer = highed.ChartCustomizer(
      customizerContainer,
      options,
      chartPreview,
      planCode
    ),
    helpModal = highed.HelpModal(props.help || []);

    customizer.on('PropertyChange', chartPreview.options.set);
    customizer.on('PropertySetChange', chartPreview.options.setAll);
    customizer.on('TogglePlugins', chartPreview.options.togglePlugins);
  
    customizer.on('AdvancedBuilt', function() {

      var bsize = highed.dom.size(body),
      size = {
        w: bsize.w,
        h: (window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight) - highed.dom.pos(body, true).y
      };

      searchAdvancedOptions.resize(width, (size.h - highed.dom.size(chartFrame).h) - 15);
    
      searchAdvancedOptions.setOptions(customizer.getAdvancedOptions());
    });

    customizer.on('AnnotationsClicked', function() {
      chartPreview.options.togglePlugins('annotations', 1);
    });
  
    customizer.on('AdvanceClicked', function() {
  
      width = 66;
      if (highed.onTablet()) width = 64;

      chartWidth = '28%';
      highed.dom.style(backIcon, {
        display: "inline-block"
      });
  
      expand();
      resizeChart(300);
  
      setTimeout(chartPreview.resize, 1000);
      searchAdvancedOptions.show();
    });
    
    highed.dom.ap(resolutionSettings, chartSizeText, stretchToFitIcon, tabletIcon, phoneIcon, resWidth, resHeight);
    
    title.innerHTML = '';
    
    iconsContainer.innerHTML = '';

    if (!highed.onPhone()) {
      buttons.forEach(function(button, i) {
        button.element = highed.dom.cr('span', 'highed-toolbox-custom-code-icon highed-template-tooltip ' + ( i === 0 ? ' active' : ''), '<i class="fa fa-' + button.icon + '" aria-hidden="true"></i><span class="highed-tooltip-text">' + button.tooltip + '</span>');
        
        highed.dom.on(button.element, 'click', function() {
          buttons.forEach(function(b){
            b.element.classList.remove('active');
          });
          button.element.classList += ' active';
          button.onClick();
        });
        highed.dom.ap(iconsContainer, button.element);
      });
    }

    highed.dom.ap(contents, userContents);
    highed.dom.ap(body, contents);
  
    highed.dom.ap(userContents, customizerContainer);
    highed.dom.ap(parent, highed.dom.ap(container,body));
  
    customizer.resize();

    expand();
    hide();
  }

  function getResolutionContainer() {
    return resolutionSettings;
  }

  function reduceSize(fn) {
    width = props.widths.desktop;
    if (highed.onTablet() && props.widths.tablet) width = props.widths.tablet;
    else if (highed.onPhone() && props.widths.phone) width = props.widths.phone;
    
    chartWidth = "68%";

    expand();
    setTimeout(function() {
      if (fn) fn();
      resizeChart(((window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);
    }, 200);
  }

  function resize() {
    if (isVisible){
      resizeChart((((window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16));
      expand();
    }
  }
  
  if (!highed.onPhone()) {
    highed.dom.on(window, 'resize', resize);
  }

  resolutions.forEach(function(res) {
    highed.dom.on(res.iconElement, 'click', function(){
      sizeChart(res.width, res.height);

      resWidth.value = res.width;
      resHeight.value = res.height;
    });
  });

  highed.dom.on(stretchToFitIcon, 'click', function() {
    
    resWidth.value = '';
    resHeight.value = '';
    highed.dom.style(chartContainer, {
      width: '100%',
      height: '100%',
    });
    setTimeout(chartPreview.resize, 300);
  }),
  backIcon = highed.dom.cr('div','highed-back-icon', '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>');


  highed.dom.style(backIcon, {
    display: "none"
  });


  highed.dom.on(backIcon, 'click', function(){
    
    width = props.widths.desktop;
    if (highed.onTablet() && props.widths.tablet) width = props.widths.tablet;
    else if (highed.onPhone() && props.widths.phone) width = props.widths.phone;
    
    chartWidth = "68%";
    
    highed.dom.style(backIcon, {
      display: "none"
    });
    searchAdvancedOptions.hide();

    expand();
    resizeChart(((window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);

    setTimeout(customizer.showSimpleEditor, 200);
  });

  function expand() {
    
    var newWidth = width; //props.width;

    highed.dom.style(body, {
      width: 100 + '%',
      opacity: 1
    });

    highed.dom.style(container, {
      width: newWidth + '%'
    });

    events.emit('BeforeResize', newWidth);

    // expanded = true;

    function resizeBody() {
      var bsize = highed.dom.size(body),
        tsize = highed.dom.size(title),
        size = {
          w: bsize.w,
          h: (window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight) - highed.dom.pos(body, true).y
        };

        highed.dom.style(contents, {
          width: size.w + 'px',
          height: ((size.h - 16)) + 'px'
        });

      customizer.resize(size.w, (size.h - 17) - tsize.h);

      return size;
    }

    setTimeout(resizeBody, 300);  
    highed.emit('UIAction', 'ToolboxNavigation', props.title);
  }

  function show() {
    highed.dom.style(container, {
      display: 'block'
    });
    expand();
    resizeChart(((window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);
    isVisible = true;
    highed.dom.style(resolutionSettings, {
      display: 'block'
    });
  }
  
  function hide() {

    customizer.showSimpleEditor();
      
    width = props.widths.desktop;
    if (highed.onTablet() && props.widths.tablet) width = props.widths.tablet;
    else if (highed.onPhone() && props.widths.phone) width = props.widths.phone;

    chartWidth = "68%";
    
    highed.dom.style(backIcon, {
      display: "none"
    });
    searchAdvancedOptions.hide();

    expand();

    highed.dom.style(container, {
      display: 'none'
    });
    isVisible = false;
    searchAdvancedOptions.hide();
    
    highed.dom.style(resolutionSettings, {
      display: 'none'
    });

    if (!highed.onPhone()){
      buttons.forEach(function(button, i) {
        button.element.classList.remove('active');
        if (i === 0) button.element.classList += ' active';
      });
    }

    resHeight.value = '';
    resWidth.value = '';
  }

  function selectOption(event, x, y) {
    customizer.focus(event, x, y);
  }

  function destroy() {}

  function showError(title, message) {
    highed.dom.style(errorBar, {
      opacity: 1,
      'pointer-events': 'auto'
    });

    errorBarHeadline.innerHTML = title;
    errorBarBody.innerHTML = message;
  }  
  
  function sizeChart(w, h) {
    if ((!w || w.length === 0) && (!h || h.length === 0)) {
      fixedSize = false;
      resHeight.value = '';
      resWidth.value = '';
      resizeChart();
    } else {
      var s = highed.dom.size(chartFrame);

      // highed.dom.style(chartFrame, {
      //   paddingLeft: (s.w / 2) - (w / 2) + 'px',
      //   paddingTop: (s.h / 2) - (h / 2) + 'px'
      // });

      fixedSize = {
        w: w,
        h: h
      };

      w = (w === 'auto' ?  s.w : w || s.w - 100);
      h = (h === 'auto' ?  s.h : h || s.h - 100);

      highed.dom.style(chartContainer, {
        width: w + 'px',
        height: h + 'px'
      });

      //chartPreview.chart.setWidth();

      chartPreview.resize(w, h);
    }
  }

  highed.dom.on([resWidth, resHeight], 'change', function() {
    sizeChart(parseInt(resWidth.value, 10), parseInt(resHeight.value, 10));
  });


  chartPreview.on('ShowTextDialog', function(chart, x, y) {
    addLabelX = x;
    addLabelY = y;

    overlayAddTextModal.show();

  });
  
  chartPreview.on('ChartChange', function(newData) {
    events.emit('ChartChangedLately', newData);
  });

  function getIcons(){
    return iconsContainer;
  }

  function resizeChart(newHeight) {
    highed.dom.style(chartFrame, {
      /*left: newWidth + 'px',*/
      width: chartWidth, //'68%',
      height: newHeight + 'px' || '100%'
    });
/*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

    setTimeout(chartPreview.resize, 200);
  }

  
  chartPreview.on('SetResizeData', function () {
    //setToActualSize();
  });

  return {
    on: events.on,
    destroy: destroy,
    hide: hide,
    show: show,
    isVisible: function() {
      return isVisible;
    },
    init: init,
    getIcons: getIcons,
    selectOption: selectOption,
    getResolutionContainer: getResolutionContainer
    //toolbar: toolbar
  };
};
