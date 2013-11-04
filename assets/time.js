var timeticks = -1;

// Save the DOM elements for faster access
var dial = $('.dial');
var time = $('#time');
var time_text = $('#time-text');
var ticks_text = $('#ticks-text');

getData();
setInterval(getData, 30000);
setInterval(tickTimer, 50);

function rotate(degrees) {
    dial.css({
        '-webkit-transform' : 'rotate('+degrees+'deg)',
        '-moz-transform' : 'rotate('+degrees+'deg)',
        '-ms-transform' : 'rotate('+degrees+'deg)',
        '-o-transform' : 'rotate('+degrees+'deg)',
        'transform' : 'rotate('+degrees+'deg)',
    });
}

function tickTimer () {
	if (timeticks > 0) {
		timeticks = Math.floor(timeticks + 1);
		setTicks(timeticks);
	};
}

function setTicks(ticks) {
    var ticksSinceSunrise = timeticks % 24000;
    var timeProgress = ticksSinceSunrise / 24000;
    var secondsSinceSunrise = Math.floor(ticksSinceSunrise / 20);
    var hoursSinceSunrise = Math.floor(secondsSinceSunrise / 50);
    var secondsSinceHour = secondsSinceSunrise % 50;
    hoursSinceSunrise = (hoursSinceSunrise < 10 ? '0' : '') + hoursSinceSunrise;
    secondsSinceHour = (secondsSinceHour < 10 ? '0' : '') + secondsSinceHour;
    
    dg = (timeProgress * 360) - 90;
    rotate(dg);
    time.html(hoursSinceSunrise + ':' + secondsSinceHour);
    time_text.html(ticksSinceSunrise + ' ticks');
    ticks_text.html(timeticks + ' ticks since the beginning of time');
}

function getData() {
    $.ajax('http://api.wurstmineberg.de/server/level.json', {
        dataType: 'json',
        error: function(request, status, error) {
            $('#time').html("???");
            $('#time-text').html("Could not load level.json");
        },
        success: function(data) {
            if ('Data' in data) {
                if ('DayTime' in data['Data']) {
                    timeticks = data['Data']['DayTime'];
                }
            }

            if (timeticks == -1) {
                $('#time-caption').html("???");
                $('#time-text').html("I have no idea. Seriously. Something is broken");
            } else {
            	var tickOffset = 0;

            	if ('api-time-last-modified' in data &&
            		'api-time-result-fetched' in data) {
            		var secondOffset = data['api-time-result-fetched'] - data['api-time-last-modified'];
            		tickOffset = secondOffset * 20;
            	};

            	timeticks = Math.floor(timeticks + tickOffset)

            	setTicks(timeticks);
            } 
        }
    });
}
