$.ajax('http://api.wurstmineberg.de/server/level.json', {
    dataType: 'json',
    success: function(data) {
        var rainstatus = -1
        if ('Data' in data) {
            if ('DayTime' in data['Data']) {
                timeticks = data['Data']['DayTime']
            }
        }

        if (timeticks == -1) {
            $('#time-caption').text("???")
            $('#time-text').text("I have no idea. Seriously. Something is broken")
        } else {
            $('#time-text').text($(timeticks).val())
        } 
    }
});