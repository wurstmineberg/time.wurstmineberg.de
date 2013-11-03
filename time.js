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
            var secondsSinceSunrise = Math.floor(ticksSinceSunrise / 20);
            var hoursSinceSunrise = Math.floor(secondsSinceSunrise / 50);
            var secondsSinceHour = secondsSinceSunrise % 50;
            hoursSinceSunrise = (hoursSinceSunrise < 10 ? '0' : '') + hoursSinceSunrise;
            secondsSinceHour = (secondsSinceHour < 10 ? '0' : '') + secondsSinceHour;
            $('#time-caption').append(hoursSinceSunrise + ':' + secondsSinceHour);
            $('#time-text').html(ticksSinceSunrise + ' ticks');
            $('#ticks-text').html(timeticks + ' ticks since the beginning of time');
        } 
    }
});
