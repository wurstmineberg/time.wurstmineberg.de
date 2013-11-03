$.ajax('http://api.wurstmineberg.de/server/level.json', {
    dataType: 'json',
    error: function(request, status, error) {
        $('#time-caption').html("???");
        $('#time-text').html("Could not load level.json");
    },
    success: function(data) {
        var timeticks = -1;
        if ('Data' in data) {
            if ('DayTime' in data['Data']) {
                timeticks = data['Data']['DayTime'];
            }
        }

        if (timeticks == -1) {
            $('#time-caption').html("???");
            $('#time-text').html("I have no idea. Seriously. Something is broken");
        } else {
            var ticksSinceSunrise = timeticks % 24000;
            var secondsSinceSunrise = ticksSinceSunrise / 20;
            var hoursSinceSunrise = secondsSinceSunrise / 50;
            var secondsSinceHour = secondsSinceSunrise % 50;
            $('#time-caption').append(hoursSinceSunrise + ':' + secondsSinceHour);
            $('#time-text').html(timeticks + ' ticks');
        } 
    }
});
