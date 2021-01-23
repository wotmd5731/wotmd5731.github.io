window.onload = function(){
    setTimeout(function(){
      $(".related-resource-img").each(function() {
        $(this).attr("src",$(this).data("src")).fadeIn();
      });
    }, 3000);
  }
  $(document).ready(function() {
  
    var colors = ["#4572a7", "#83b2df", "#413e1a", "#8c8532", "#88a44c", "#b22a25", "#d86342", "#b27a3f", "#5a1a45", "#551e5a"];
    var rand = Math.floor(Math.random() * colors.length);
    fgDateRangeCallbacks = {};
    disableContextMenu();
    window.graphResizedByUser = false;
    if ($('#resizable-graph-container').width() != $('#main-content-column').width()) {
      window.graphResizedByUser = true;
    }
    $("#zoom-controls").on("click", "span, a", handleQuickDateSelected);
  
    $('.calendar-icon-toggle').on('click', function(e) {
        e.preventDefault();
        $( "#date-custom-range" ).toggle( "slide",{ direction:"right"});
    });
  
    $('.overlay-btn').on('click', function(event){
      event.preventDefault();
      $('.overlay-panel').addClass('is-visible');
      disableContextMenu();
      resizeGraphForPanel();
      $("#edit-lines-badge").fadeIn(2000);
      if ($('.add-series-tab').hasClass('active')) {
        $('#add-series-container').find('.add-data-series-input').focus();
      }
  
      window.fredgraph.setPanelOpen(true);
      event.stopPropagation();
    });
    function exportPng() {
      disableContextMenu();
      $('.highcharts-contextbutton').click();
      $('.highcharts-menu-item')[1].click();
    }
    $('body').on('click', '#export-png', function(e) {
      e.preventDefault();
      exportPng();
    });
  
    $('body').on('click', function(event){
      if (!$('.overlay-panel').hasClass('is-visible')
        || $(event.target).closest('#resizable-graph-container').length
        || $(event.target).closest('#zoom-controls').length
        || $(event.target).is('.fancybox-close')
        || $(event.target).closest('#remove-series-modal').length
        || ($(event.target).closest('.overlay-panel').length)
        && !$(event.target).is('.overlay-panel-close')) {
          return;
        }
        closePanel();
      });
      $('.overlay-panel-close').on('click', function(event){
        closePanel();
      });
      $(window).resize(function(){
          var containerWidth = $('#main-content-column').width();
          setGraphSize(containerWidth, $('#height').val());
      });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      if ($(this).data('target') == '#addseries') {
        $('#add-series-container').find('.add-data-series-input').focus();
      }
    });
  
  
    $('.edit-series-dropdown > a').click(function(e) {
      if ($('.series-group-tab').length <= 1)
        $('.fg-edit-series-tab').eq(0).trigger('click');
    });
    $('.tooltips').tooltip();
  
    $('#tabbed-menu li > a[href^="#"]').on('click', function (e) {
      e.preventDefault();
      $(document).off("scroll");
  
      $('#tabbed-menu li').each(function () {
        $(this).removeClass('active');
      })
      $(this).parent().addClass('active');
  
      var target = this.hash,
        menu = target;
      $target = $(target);
      $('html, body').stop().animate({
        'scrollTop': $target.offset().top+2
      }, 500, 'swing', function () {
        window.location.hash = target;
      });
    });
  
  
    var offset = 300,
      offset_opacity = 1200,
      scroll_top_duration = 700,
      $back_to_top = $('.back-top');
  
    $(window).scroll(function(){
      ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('back-is-visible') : $back_to_top.removeClass('back-is-visible back-fade-out');
      if( $(this).scrollTop() > offset_opacity ) {
        $back_to_top.addClass('back-fade-out');
      }
    });
  
    $back_to_top.on('click', function(event){
      event.preventDefault();
      $('body,html').animate({
          scrollTop: 0 ,
        }, scroll_top_duration
      );
    });
  
    var fredWhiteListedMarkup = $.fn.tooltip.Constructor.DEFAULTS.whiteList
    fredWhiteListedMarkup.table = [];
    fredWhiteListedMarkup.tbody = [];
    fredWhiteListedMarkup.tr = [];
    fredWhiteListedMarkup.td = ['class', 'colspan', 'align'];
  
    $("#recent-obs-link").popover({
      animation: "fade",
      content: $("#recent-obs-table").html(),
      delay: 500,
      html: true,
      placement: "bottom",
      trigger: "click"
    });
  
  
    $("body").on("click", function (e) {
      $("#recent-obs-link").each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $(".popover").has(e.target).length === 0) {
          $(this).popover("hide");
        }
      });
    });
    $("#fullscreen-btn").on("click", function (e) {
      toggleFullscreen();
    });
  
    var main_col = $("#main-content-column, .alfred-graph-container"),
      col_width = main_col.width(),
      height = 450;
  
    if (col_width <= 640) {
      height = col_width * 0.75;
    }
  
    $('#resizable-graph-container').css({
      'width': col_width + 'px',
    });
  
    $('#graph-container').css({
      'width': col_width + 'px',
      'height': height + 'px'
    });
  
    $('#width').val(col_width).data('original-width', col_width);
    $('#height').val(height).data('original-height', height);
    $(".series-tag-cloud").find('[data-toggle="tooltip"]').tooltip({
      placement: 'top',
      container: 'body'
    });
  
  
    if (typeof debouncer !== "undefined") {
      $(window).on("resize.respond", debouncer(function () {
  
        col_width = main_col.width();
  
        if (typeof fredgraphUi !== "undefined") {
  
          if ($('.overlay-panel').hasClass('is-visible')) {
            resizeGraphForPanel();
          } else {
  
            var height = 450;
            if (col_width <= 640) {
              height = col_width * 0.75;
            }
            setGraphSize(col_width, height, $('#show-axis-titles-value').prop("checked"));
          }
  
        }
      }));
    }
    function closePanel() {
      var containerWidth = $('#main-content-column').width();
      var customWidth = $('#width').val();
      $('.overlay-panel').removeClass('is-visible');
      $('#edit-lines-badge').css('display','none');
      setGraphSize(containerWidth, $('#height').val());
      window.fredgraph.setPanelOpen(false);
    }
    function disableContextMenu() {
      $('.highcharts-contextbutton').hide();
      $('.highcharts-contextmenu').hide();
    }
    function resizeGraphForPanel() {
      if (window.graphResizedByUser) {
        return true;
      }
  
      var graph_area = $('#main-content-column'),
        graph_area_width = graph_area.width();
  
      var graphRight = $(window).width() - (graph_area.offset().left + graph_area_width);
  
      var overlayOverlap = $('.overlay-panel-content').width() - graphRight;
  
      if (overlayOverlap > 0) {
        var newGraphWidth = graph_area_width - overlayOverlap - 10;
      } else {
        var newGraphWidth = graph_area_width;
      }
  
      if (newGraphWidth > graph_area_width) {
        newGraphWidth = graph_area_width;
      }
  
      if ($('#resizable-graph-container') == graph_area_width) {
        return true;
      }
  
      if (newGraphWidth < 600) {
        newGraphWidth = 600;
      }
  
      newGraphWidth = Math.floor(newGraphWidth);
      setGraphSize(newGraphWidth, $('#height').val(), $('#show-axis-titles-value').prop("checked"));
    }
  
    function toggleFullscreen()
    {
      if  ($('#fullscreen-container').hasClass('chart-modal')) {
        closeFullscreen();
      }
      else {
        openFullscreen();
      }
      disableContextMenu();
  
    }
    function openFullscreen()
    {
      var gHeightModifier = 20;
      if($( ".edit-map-btn-large" ).parent().hasClass('hide') === false) {
        gHeightModifier = 30;
      }
      $('#fullscreen-container').toggleClass('chart-modal');
      $("#fullscreen-btn-icon").attr("src", "/graph/images/fullscreenExit.png")
      var gwidth = $('#fullscreen-container').width();
      var gheight = $('#fullscreen-container').height();
      setGraphSize(gwidth,gheight-gHeightModifier,true);
      $('#header').css('z-index','1');
      $('#fullscreen-btn-icon').css('padding-right','20px');
  
    }
    function closeFullscreen()
    {
      $("#fullscreen-btn-icon").attr("src", "/graph/images/fullscreen.png")
      $('#fullscreen-btn-icon').css('padding-right','10px');
      $('#fullscreen-container').toggleClass('chart-modal');
      setGraphSize($('#zoom-and-share').width(),450,true);
    }
    function fixFooterInFullscreen()
    {
      $('.graph-footer').css('left','0');
      $('.graph-footer').css('bottom','0');
      $('.graph-footer').css('position','fixed');
    }
    function setGraphSize(graphWidth,graphHeight,oc){
      $('#resizable-graph-container').css({
        'width': graphWidth + 'px',
      });
      window.fredgraph.setGraphSize(graphWidth,graphHeight);
    }
  
    $('#graph-link-update-radio').on('click', function() {
      $('#graph-link-update-radio').prop("checked", true);
      $('#graph-link-static-radio').prop("checked", false);
      $('#graph-link-range-radio').prop("checked", false);
  
      window.fredgraph.appMiddleware(function(jsonObject) {
       postToApi(jsonObject,"hash/?type=updating", function(response) {
          setGraphLinks(response.hash);
        })
      });
    });
    $('#graph-link-static-radio').on('click', function() {
      $('#graph-link-update-radio').prop("checked", false);
      $('#graph-link-static-radio').prop("checked", true);
      $('#graph-link-range-radio').prop("checked", false);
  
      window.fredgraph.appMiddleware(function(jsonObject) {
        postToApi(jsonObject,"hash/?type=static", function(response) {
          setGraphLinks(response.hash);
          $('#embed-code').val(getApiHost()+"/graph/"+image+'?g='+response.hash);
        })
      });
    });
    $('#graph-link-range-radio').on('click', function() {
      $('#graph-link-update-radio').prop("checked", false);
      $('#graph-link-static-radio').prop("checked", false);
      $('#graph-link-range-radio').prop("checked", true);
      window.fredgraph.appMiddleware(function(jsonObject) {
        postToApi(jsonObject,"hash/?type=range&data_range="+$('#graph-link-range-radio').attr('data-range'), function(response) {
          setGraphLinks(response.hash);
        })
      });
    });
    $('.permalink-btn').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $('#permalink-modal').modal('show');
      $('.embed-code-container, .page-permalink-container, .image-permalink-container, #graph-radios').hide();
      $('#embed-container-responsive').addClass('hidden');
      $('#permalink-modal-header').html($(this).text());
      var container = $(this).data("target");
      $(container).show();
  
      $('#graph-link-update-radio').prop("checked", true);
      $('#graph-link-static-radio').prop("checked", false);
      $('#graph-link-range-radio').prop("checked", false);
  
      window.fredgraph.appMiddleware(function(jsonObject) {
        postToApi(jsonObject,"range/", function(response) {
          if (response.range) {
            var data = response.range;
            $('#graph-link-update').text(data.fixed_cosd);
            $('#graph-link-static').text(data.fixed_cosd_fixed_coed);
            $('#graph-link-range').text(data.floating_date_range);
            $('#graph-link-range-radio').attr('data-range', data.range);
            $('#graph-radios').show();
  
            if (data.chart_type === 'pie' ){
                $('#graph-link-static').hide();
                $('#graph-link-static-radio').hide();
                $( "#graph-link-update-radio" ).trigger( "click" );
             }
            else if ( data.fixed_cosd.length > 0)  {
                  $( "#graph-link-update-radio" ).trigger( "click" );
            } else {
              $('#graph-radios').hide();
             $( "#graph-link-static-radio" ).trigger( "click" );
            }
  
          }});
      });
  
    });
    $('.social-share-link').on('click', function(e) {
      e.preventDefault();
      var type = $(this).data( "shareType" );
      window.fredgraph.appMiddleware(function(jsonObject) {
        postToApi(jsonObject,"settings/url/", function(response) {
          if (response.url) {
            window.location = getApiHost()+'/graph/share.php?share='+type+'&' + response.url;
          }
        })
      });
    })
  
    $('.download-menu-item').on('click', function (e) {
      const action = $(this).data('action');
      var baseUrl = '';
      switch (action) {
        case 'excel':
          baseUrl = 'fredgraph.xls';
          break;
        case 'csv':
          baseUrl = 'fredgraph.csv';
          break;
        case 'pdf':
          baseUrl = 'fredgraph.pdf';
          break;
        case 'png':
          baseUrl = false;
          exportPng();
          break;
        case 'ppt':
          baseUrl = false;
          runPowerPoint(e);
          return;
          break;
        default:
          baseUrl = false;
      }
      if (baseUrl) {
        e.preventDefault();
        window.fredgraph.appMiddleware(function (jsonObject) {
          postToApi(jsonObject, 'settings/url/', function (response) {
            if (response.url) {
              var url = '/graph/' + baseUrl + '?' + response.url;
              window.location = getApiHost() + url;
            }
          });
        });
      }
    });
  
    $('#collapse-embed-responsive').on('click', function(e) {
      e.preventDefault();
      $('.embed-container-responsive').removeClass('hidden');
  
    });
  
    var clipboard = new Clipboard('.copy-to-clipboard');
    clipboard.on('success', function(e) {
      $(e.trigger).prev('input').blur().effect('highlight');
    });
    $('.embed-popover').popover({
      container: 'body',
      html: true,
      trigger: 'hover'
    });
    $('.embed-code-btn, .page-permalink-btn, .image-permalink-btn').on('click', function(e) {
      e.preventDefault();
    });
  
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
      if($(e.target).attr('href') == '#save-share') {
        $('.embed-code-container, .page-permalink-container, .image-permalink-container, #graph-radios').hide();
      }
    });
  
    function setGraphLinks(hash){
      var baseUrl = getApiHost()+'/graph/';
      var image = (window.location.href.match('alfred'))
        ? 'alfredgraph.png'
        : 'fredgraph.png';
  
      $('#link-code').val(baseUrl + '?g='+hash);
      $('#image-code').val(baseUrl + image + '?g='+hash);
  
      var embedWidth = parseInt($('#width').val()),
        embedHeight = parseInt($('#height').val());
  
      if (!window.graphResizedByUser) {
        embedWidth = 670;
        embedHeight = 475;
      }
      var embedCode = '<iframe src="'+baseUrl+'graph-landing.php?g='+hash;
      embedCode += '&width='+embedWidth+'&height='+embedHeight+'" scrolling="no" frameborder="0" ';
      embedCode += 'style="overflow:hidden; width:'+embedWidth+'px; height:'+(embedHeight+50)+'px;" ';
      embedCode += 'allowTransparency="true" loading="lazy"></iframe>';
      $('#embed-code').val(embedCode);
  
      var embedCodeResponsive = '<div class="embed-container"><iframe src="'+baseUrl+'graph-landing.php?g='+hash;
      embedCodeResponsive += '&width='+embedWidth+'&height='+embedHeight+'" scrolling="no" frameborder="0" ';
      embedCodeResponsive += 'style="overflow:hidden;" allowTransparency="true" loading="lazy">';
      embedCodeResponsive += '</iframe></div><script src="https://fred.stlouisfed.org/graph/js/embed.js" type="text/javascript"></script>';
      $('#embed-code-responsive').val(embedCodeResponsive);
    }
  
    var lastPieDate = $('#input-pie-date').val();
    $('#input-pie-date').on('changeDate', function() {
      var pieDate = $('#input-pie-date').val();
      if (lastPieDate !== pieDate && pieDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        lastPieDate = pieDate;
        window.fredgraph.updatePieChart(pieDate);
      }
    });
  
    //end document.ready
  });
  
  function unsetMapChart() {
    $(".share-dropdown").removeClass("hide");
    $(".account-dropdown").removeClass("hide");
    $("#download-button").removeClass("hide");
    $("#share-socialmedia").removeClass("hide");
    $("#meta-download-button-sm").removeClass("hide");
    $("#meta-twitter-button-sm").removeClass("hide");
    $("#cal-button-container .calendar-icon-toggle").removeClass("hide");
    $("#zoom-and-share").css('background-color', 'rgb(225, 233, 240)');
    $("#fullscreen-btn").removeClass("fullscreen-map-btn");
  }
  
  function setDateChart(){
    $(".ranges").removeClass("hide");
    $("#input-cosd").removeClass("hide");
    $("#input-coed").removeClass("hide");
    $(".date-seperator").removeClass("hide");
    $("#zoom-pie").addClass("hide");
    unsetMapChart();
  }
  
  function setNonDateChart(minDate, maxDate, currentDate, frequency){
    $(".ranges").addClass("hide");
    $("#input-cosd").addClass("hide");
    $("#input-coed").addClass("hide");
    $(".date-seperator").addClass("hide");
    $("#zoom-pie").removeClass("hide");
    initPieDatePicker(minDate,maxDate,frequency);
    if ($('#input-pie-date').val() !== currentDate) {
      $('#input-pie-date').val(currentDate);
    }
  
    unsetMapChart();
  }
  
  function setMapChart() {
    $(".ranges").addClass("hide");
    $("#input-cosd").addClass("hide");
    $("#input-coed").addClass("hide");
    $(".date-seperator").addClass("hide");
    $("#zoom-pie").addClass("hide");
    $(".share-dropdown").addClass("hide");
    $(".account-dropdown").addClass("hide");
    $("#download-button").addClass("hide");
    $("#meta-download-button-sm").addClass("hide");
    $("#meta-twitter-button-sm").addClass("hide");
    $("#cal-button-container .calendar-icon-toggle").addClass("hide");
    $("#share-socialmedia").addClass("hide");
    $("#zoom-and-share").css('background-color', '#ffffff');
    $("#fullscreen-btn").addClass("fullscreen-map-btn");
  }
  
  function initPieDatePicker(startDate, endDate, frequency){
    var minViewMode = 'years'
    if (frequency == "Daily") {
      minViewMode = 'days';
    }
    if (frequency == "Monthly") {
      minViewMode = 'months';
    }
  
    $('#input-pie-date').datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true,
      forceParse: true,
      startView: 'decade',
      minViewMode: minViewMode,
      orientation: 'bottom',
      zIndexOffset: 1901,
      startDate: startDate,
      endDate: endDate,
    });
  
    if (startDate) {
      $('#input-pie-date').datepicker('setStartDate', startDate);
    }
  
    if (endDate) {
      $('#input-pie-date').datepicker('setEndDate', endDate);
    }
  }
  
  function formatPieDate(pickerInput){
    var pieDate = new Date(pickerInput.val().replace(/(\d\d\d\d)-(\d\d)-(\d\d)/, '$2/$3/$1'));
    pieDate = pieDate.getTime();
    return pieDate;
  }
  
  function updatePageContent(seriesIds, hasTrend, fml)
  {
    updateContentSection('title','series-title-text-container',seriesIds);
  
    if ((seriesIds.length > 1) || (hasTrend === true) || (fml === true)) {
      $("#meta-left-col").addClass("hide");
    }
    else{
      $("#meta-left-col").removeClass("hide");
    }
    updateBottomContent(seriesIds);
  }
  function updateGraphTitle(jsonObject) {
    postToApi(jsonObject,"title/", function(response) {
      $( "#series-title-text-container" ).html( response.result );
    });
  }
  function updateMetaContent(jsonObject) {
    // Avoid AJAX calls that do nothing.  Minimize network calls.
    // Only update recent obs if 1 FRED graph series.
    if ((typeof jsonObject === 'undefined') || !jsonObject) {
      return false;
    }
  
    var fgchart = JSON.parse(jsonObject);
    if (typeof fgchart === 'undefined'
        || typeof fgchart.seriesObjects === 'undefined'
        || fgchart.seriesObjects.length !== 1) {
      return false;
    }
  
    postToApi(
      jsonObject,
      "metadata/",
      function(response) {
        $( "#meta-left-col").html( response.result );
        var fredWhiteListedMarkup = $.fn.tooltip.Constructor.DEFAULTS.whiteList
        fredWhiteListedMarkup.table = [];
        fredWhiteListedMarkup.tbody = [];
        fredWhiteListedMarkup.tr = [];
        fredWhiteListedMarkup.td = ['class', 'colspan', 'align'];
  
        $("#recent-obs-link").popover({
          animation: "fade",
          content: $("#recent-obs-table").html(),
          delay: 100,
          html: true,
          placement: "bottom",
          trigger: "click"
        });
        $("#meta-left-col").removeClass("hide");
      },
      function() {
        $("#meta-left-col").addClass("hide");
      }
    );
  }
  
  function updateBottomContent(seriesIds){
    updateContentSection('notes','notes-content',seriesIds);
    updateContentSection('releasetables','releasetables-content',seriesIds);
    updateContentSection('relatedcontent','relatedcontent-content',seriesIds);
  }
  
  function updateContentSection(endpoint, element, seriesIds){
    var host = getApiHost();
    var baseUrl = host+"/graph/api/series/";
    var request = $.ajax({
      url: baseUrl+endpoint+"/"+seriesIds.join(),
      method: "GET",
      data: { id : seriesIds },
      dataType: "json"
    });
    request.done(function( response ) {
      if (response.result){
        $( "#"+element ).html( response.result );
        $( "#"+endpoint ).removeClass('hide');
      }
      //Only update copyright when updating notes
      if ( endpoint === 'notes') {
        if (response.result && response.result.match(/[Cc]opyright/)) {
          $(".copyright-indicator, .copyright-note").removeClass('hide');
        }
        else {
          $(".copyright-indicator, .copyright-note").addClass('hide');
        }
      }
      $(".related-resource-img").each(function () {
        $(this).attr("src", $(this).data("src")).fadeIn();
      });
    });
    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });
  }
  function toggleTooltip(enabled){
    var displayValue =  (enabled === "no") ? "none" : "block";
    $('.highcharts-tooltip').css('display',displayValue);
  }
  function checkCopyrighted(seriesIds){
    var host = getApiHost();
    var baseUrl = host+"/graph/api/series/";
    var request = $.ajax({
      url: baseUrl+"copyright/"+seriesIds.join(),
      method: "GET",
      data: { },
      dataType: "json"
    });
    request.done(function( response ) {
        if (response.result == true) {
          $(".copyright-indicator, .copyright-note").removeClass('hide');
        }
        else {
          $(".copyright-indicator, .copyright-note").addClass('hide');
        }
    });
    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });
  }
  function setDateInputs(jsonObject, cosd, coed) {
    return jsonObject;
  }
  
  function handleDateChange(e) {
    $("#range").val("Custom");
    var cosd = $("input.cosd").val();
    var coed = $("input.coed").val();
    window.fredgraph.validateExtremes(cosd, coed, function(
      jsonObject,
      cosd,
      coed
    ) {
      window.setDateInputs(jsonObject, cosd, coed);
    });
    window.fredgraph.setExtremesWithFormattedDate(
      $("input.cosd").val(),
      $("input.coed").val()
    );
  }
  
  function handleQuickDateSelected(e) {
    e.preventDefault();
    var id = $(this).attr("id");
    if (
      typeof id === "undefined" ||
      !["zoom-1yr", "zoom-5yr", "zoom-10yr", "zoom-all"].includes(id)
    ) {
      return false;
    }
    $(
      ".embed-code-container, .page-permalink-container, .image-permalink-container, #graph-radios"
    ).hide();
    var range;
    if (id === "zoom-all") {
      $("#range").val("Max");
      range = 0;
    } else {
      if (id === "zoom-1yr") {
        $("#range").val("1yr");
        range = 1;
      } else if (id === "zoom-5yr") {
        $("#range").val("5yrs");
        range = 5;
      } else {
        $("#range").val("10yrs");
        range = 10;
      }
    }
    window.fredgraph.setExtremesWithRange(range);
    return true;
  }
  /*** Calculate MinViewMode from Freq of graph ****/
  function getMinViewModeFromFreq(frequency){
    var minViewMode = "days";
    if (/^Annual/.test(frequency) || /^5\sYear/.test(frequency)) {
      minViewMode = "years";
    } else if (
      /^Monthly/.test(frequency) ||
      /^Quarterly/.test(frequency) ||
      /^Semiannual/.test(frequency)
    ) {
      minViewMode = "months";
    }
    return minViewMode;
  }
  function initializeDatePicker(frequency, minDate, maxDate) {
  
    $(".cosd, .coed").each(function() {
      $(this).datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        forceParse: true,
        startView: "decade",
        minViewMode: getMinViewModeFromFreq(frequency),
        orientation: "bottom",
        zIndexOffset: 1901,
        startDate: minDate,
        endDate: maxDate
      });
    });
  
    $("input.cosd, input.coed").on("changeDate", handleDateChange);
  }
  
  function handleAfterSetExtremes(jsonObject, chartObject) {
    if (chartObject.chart.drp === 1) {
      $("#zoom-controls").addClass("hide");
      return true;
    }
  
    $("#zoom-controls").removeClass("hide");
    if (!$("#input-cosd").data("datepicker")) {
      initializeDatePicker(chartObject.chart.frequency, chartObject.chart.min_date, chartObject.chart.max_date);
    }
    var extremes = jsonObject.extremes;
  
    $("#input-cosd").data('datepicker')._process_options({minViewMode: getMinViewModeFromFreq(chartObject.chart.frequency)})
    $("#input-coed").data('datepicker')._process_options({minViewMode: getMinViewModeFromFreq(chartObject.chart.frequency)})
  
    $("#input-cosd").datepicker("setStartDate", extremes.dataStartDate);
    $("#input-cosd").datepicker("setEndDate", extremes.dataEndDate);
    $("#input-coed").datepicker("setStartDate", extremes.dataStartDate);
    $("#input-coed").datepicker("setEndDate", extremes.dataEndDate);
    $("#input-cosd").datepicker("update", extremes.startDate);
    $("#input-coed").datepicker("update", extremes.endDate);
    
  }
  function postToApi(jsonObject,endpoint,callback, failCallback) {
    var formData = new FormData();
    formData.append('settings', jsonObject);
    var options = { data: formData };
    var host = getApiHost();
    var baseUrl = host+"/graph/api/series/";
    var request = $.ajax({
      beforeSend: function(xhrObj){
        xhrObj.setRequestHeader("Accept","application/json");
      },
      url: baseUrl+endpoint,
      method: "POST",
      data: jsonObject,
      contentType: "application/json;charset=utf-8",
      dataType: "json",
      processData: false
    });
    request.done(function( response ) {
      callback(response);
    });
    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
      if (failCallback !== undefined) {
        failCallback();
      }
    });
  }
  
  function runPowerPoint(e) {
      e.preventDefault();
      window.fredgraph.appMiddleware(function(jsonObject) {
        postToApi(jsonObject,"hash/", function(response) {
          if (response.hash) {
            exportPowerpoint({
                id: response.hash,
                title: ' ', // Use title in chart image
                notes: scrapeNotes()
            });
          }});
      });
      return false;
  }
  
  function exportPowerpoint(options) {
    var url = '/graph/ajax-requests.php';
    downloadFile({
      url: url,
      action: 'download_as_ppt',
      g: options.id,
      id: options.id,
      title: options.title,
      notes: options.notes,
      before: function () {
        if (typeof options.beforeSend !== 'undefined') {
          options.beforeSend();
        }
      },
      success: function () {
        if (typeof options.failed !== 'undefined') {
          options.failed();
        }
      },
      complete: function () {
        if (typeof options.complete !== 'undefined') {
          options.complete();
        }
      }
    });
  }
  
  function scrapeNotes() {
    var output = '', notes = [];
  
    $(".notes-series-group").each(function (x, seriesItem) {
        $(seriesItem).find('p').each(function(y, item) {
            if ($(item).hasClass("note-faq"))
                return true;
  
            str = $(item).text();
            notes.push($.trim(str));
        });
        // Newline placeholder = ' || '
        notes.push(' || ');
    });
  
    output = notes.length ? notes.join(' || ') : '';
    return output;
  }
  function adjustColorPicker(lineIndex){
    if (wentOffScreen($('#line-color-'+lineIndex))){
      $('#line-color-'+lineIndex+'-wrapper').css('position','absolute');
      $('#line-color-'+lineIndex+'-wrapper').css('bottom','350px');
    }
  }
  
  function wentOffScreen(element){
    var elementTop = $(element).offset().top;
    var elementBottom = (elementTop + $(element).outerHeight());
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return (elementBottom+300) > viewportBottom;
  }
  
  
  function getApiHost() {
    var protocol = window.location.protocol;
    if  ((/alfred/).test(window.location.host)){
      return protocol+"//"+websiteCfg.alfred_host;
    }
    if  ((/fred/).test(window.location.host)){
      return protocol+"//"+websiteCfg.fred_host;
    }
    return window.location.protocol+"//localhost";
  }
  