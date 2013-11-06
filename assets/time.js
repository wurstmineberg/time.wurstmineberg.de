var timeticks = -1;
var adjusting = true;

// Save the DOM elements for faster access
var dial = $('.dial');
var time = $('#time');
var time_text = $('#time-text');
var ticks_text = $('#ticks-text');
var time_hour = $('#time-hour');
var time_second = $('#time-second');
var time_tick = $('#time-tick')
var date = $('#date');
var date_day = $('#date-day');
var date_month = $('#date-month');
var date_year = $('#date-year');
var moon_phase = $('.moon-phase')

var day_strings = ['Monday', 'Ducksday', 'Cowsday', 'Sheepsday', 'Horseday', 'Squidsday', 'Caturday', 'Pigsday'];
var month_strings = ['Ironary', 'Zombiary', 'Gharch', 'Slimepril', 'Ocely', 'Magmacubust', 'Mooshtober', 'Snowember', 'Enderember'];
var number_strings = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

var current_rotation = 0;
var current_day = -1;
$("abbr").tooltip();

getData();
setInterval(getData, 30000);
setInterval(tickTimer, 50);

function stopAdjusting() {
    adjusting = false;
}

function rotate(degrees) {
    while (degrees < (current_rotation - 360)) {
        degrees += 360;
    };

    while (degrees > (current_rotation + 360)) {
        degrees -= 360;
    };

    current_rotation = degrees;
    dial.css({
        '-webkit-transform' : 'rotate('+degrees+'deg)',
        '-moz-transform' : 'rotate('+degrees+'deg)',
        '-ms-transform' : 'rotate('+degrees+'deg)',
        '-o-transform' : 'rotate('+degrees+'deg)',
        'transform' : 'rotate('+degrees+'deg)',
    });
}

function tickTimer () {
    if (timeticks > 0 && !adjusting) {
        timeticks = Math.floor(timeticks + 1);
        setTicks(timeticks);
    };
}

function padNumber(num, size) {
    var s = num + '';
    while (s.length < size) s = "0" + s;
    return s;
}

function setTicks(ticks) {
    var ticksSinceSunrise = timeticks % 24000;
    var timeProgress = timeticks / 24000;
    
    dg = (timeProgress * 360) - 90;
    rotate(dg);

    var seconds = Math.floor(ticks / 20);
    var secondsSinceHour = seconds % 50;
    var hours = Math.floor(seconds / 50);
    var hoursSinceDay = hours % 24;
    var days = Math.floor(hours / 24);
    var daysSinceMonth = days % 8;
    var months = Math.floor(days / 8);
    var monthsSinceYear = months % 9 ;
    var years = Math.floor(months / 9);

    time_hour.text(padNumber(hoursSinceDay, 2));
    time_second.text(padNumber(secondsSinceHour, 2));
    time_tick.text(ticksSinceSunrise);
    //ticks_text.html(timeStringForTicks(timeticks) + ' (' + timeticks + ' ticks) since the beginning of time');

    date_day.text(day_strings[daysSinceMonth]);
    date_month.text(month_strings[monthsSinceYear]);
    date_year.text(years);

    if (daysSinceMonth != current_day) {
    	date_day.attr('data-original-title', 'One day has 24 hours and starts at sunrise. ' + day_strings[daysSinceMonth] + ' is the ' + number_strings[daysSinceMonth] + ' month.');
    	date_month.attr('data-original-title', 'One month has 8 days and represents a full moon phase. ' + month_strings[monthsSinceYear] + ' is the ' + number_strings[monthsSinceYear] + ' month.');
    	$("abbr").tooltip('fixTitle');
    	current_day = daysSinceMonth;
    };


    var offset_width = Math.floor(daysSinceMonth % 4) * 128;
    var offset_height = Math.floor(daysSinceMonth / 4) * 128;
    moon_phase.css('background-position', '-' + offset_width + 'px ' + '-' + offset_height + 'px');
}

function getData() {
    $.ajax('http://api.wurstmineberg.de/server/level.json', {
        dataType: 'json',
        error: function(request, status, error) {
            $('#time').html("???");
            $('#time-text').html("Could not load level.json");
        },
        success: function(data) {
            adjusting = true;

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
                adjusting = false;
            } 
        }
    });
}
