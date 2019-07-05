(function($){
	
	/* Helper functions */
	/* 1) full screen */
	function toggleFullScreen(elem) {
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			if (elem.requestFullScreen) {
				elem.requestFullScreen();
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullScreen) {
				elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
	}

	/* 2) Time Format Helper Function */ 
	String.prototype.timeFormat = function () {
		var sec_num = parseInt(this, 10); //second
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		if (hours > 0) {
			return hours+':'+minutes+':'+seconds;
		} else {
			return minutes+':'+seconds;
		}
	}

	$('video').each(function(){
		var video = $(this)[0],
		videoContainer = video.closest('div'),
		$playToggleBtn = $(videoContainer).find('input[name="play-pause"]'),
		$progressBar =  $(videoContainer).find('.progress-bar'),
		$progress = $(videoContainer).find('.progress'),
		$current_time =  $(videoContainer).find('.current-time'),
		$durationDisplay = $(videoContainer).find('.duration'),
		$volumeSlider =  $(videoContainer).find('.volume-slider'),
		$mute_toggle =  $(videoContainer).find('.mute-toggle'),
		$muteBtn =  $mute_toggle.find('input[type="checkbox"]'),
		$rate_display =  $(videoContainer).find('.rate_display'),
		$fullScreenToggler =  $(videoContainer).find('input[name="screen-toggler"]'),
		$playSpeed =  $(videoContainer).find('.playback-rate ul li');

		var playPause = function(){
			if (video.paused) {
				$(this).val('Pause').addClass('pause').removeClass('play');
				video.play();
				getPlaybackRate();
			} else {
				$(this).val('Play').addClass('play').removeClass('pause');
				video.pause();
			}
		}

		var muteToggle = function(){
			if($muteBtn.is(':checked')) {
				video.muted = true;
				$(this).addClass('muted');
			} else {
				video.muted = false;
				$(this).removeClass('muted');
			}
		}

		var ajustVolume = function(){
			var liveVolume = $(this).val();
			video.volume = liveVolume;
			if (liveVolume == 0) {
				$muteBtn.prop('checked', true);
				video.muted = true;
				$mute_toggle.addClass('muted');
			} else {
				$muteBtn.prop('checked', false);
				video.muted = false;
				$mute_toggle.removeClass('muted');
			}
		}

		var updateProgressBar = function() {
			var progressRadio = video.currentTime / video.duration;
			var progressPercent = (progressRadio * 100) + "%";
			$progress.width(progressPercent);
		}

		var rewindVideo = function(){
			if (video.currentTime == video.duration) {
				video.load();
				$playToggleBtn.val('Play').removeClass('pause').addClass('play');
			}
		}

		var currentTimeDuration = function(){
			var currTimeStr = Math.round(video.currentTime).toString();
			var durationStr = Math.round(video.duration).toString();
			$current_time.text(currTimeStr.timeFormat());
			$durationDisplay.text(durationStr.timeFormat());
		}

		var skipTime = function(evt){
			var mouseX = evt.pageX - $(this).offset().left;
			var width = $(this).outerWidth();
			video.currentTime = mouseX/width*video.duration;
		}

		var fullScreen = function(){
			if (!$(videoContainer).hasClass('fullscreen')) {
				$(videoContainer).addClass('fullscreen');
				$(this).addClass('exit');
			} else {
				$(videoContainer).removeClass('fullscreen');
				$(this).removeClass('exit');
			}
			toggleFullScreen(document.body);
		}

		var getPlaybackRate = function() {
			if (video.playbackRate == 1) {
				var playbackText = "Normal";
			} else {				
				var playbackText = video.playbackRate + "x";
			}
			
			$rate_display.text(playbackText);
		};

		var setPlaybackRate = function() {
			var playRate = $(this).data('rate');
			video.playbackRate = playRate;
			getPlaybackRate();
		};

		/* ===== Events ===== */

		// If mobile, add "mobile" class to th body tag
		$(window).load(function(){
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				$('body').addClass('mobile');
			}
		});
		
		$(video).on('loadedmetadata', currentTimeDuration);

		$playToggleBtn.on('click', playPause);

		$mute_toggle.on('click', muteToggle);

		/*========= On time update do the following =========*/
		$(video).on('timeupdate', function(){
			updateProgressBar();
			currentTimeDuration();
			rewindVideo();
		});

		$progressBar.on('click', skipTime);
		$volumeSlider.on('input', ajustVolume);
		$fullScreenToggler.on('click', fullScreen);
		$playSpeed.on('click', setPlaybackRate);
		
		$(document).on('fullscreenchange', evt => {
			if($(document.fullscreenElement).is(videoContainer)) {
				$(document.fullscreenElement).addClass('fullscreen');
				$(videoContainer).removeClass('fullscreen');
				$fullScreenToggler.removeClass('exit');
			} else {
				$(videoContainer).removeClass('fullscreen');
				$fullScreenToggler.addClass('exit');
			}
		});

	});

})(jQuery);