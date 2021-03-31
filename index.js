const tztool = require('./timezone.js');
const jsonhelper = require('./json-helper.js');
const ical = require("ical-generator");
const http = require("http");
const moment = require("moment");
const date = require("date-and-time");
var tiny = require("tiny-json-http");
var schedule = require('node-schedule');
var globalCal;
const PORT = process.env.PORT || 5000;
const pattern = date.compile("YYYY-MM-DD[T]HH:mm:ssZ");

async function updateCalendar() {
  
  const cal = ical({
    domain: "byu-broadcast-ical.herokuapp.com",
    name: "BYU Sports Broadcast Schedule"
  });
  cal
    .prodId({
      company: "BYU",
      product: "Sports",
      language: "EN" // optional, defaults to EN
    })
    .url("https://byu-broadcast-ical.herokuapp.com")
    .scale("gregorian")
    .timezone("America/Denver")
    .ttl(60 * 60 * 24);

  var url = "https://byucougars.com/jsonapi/node/sporting_event?filter[event-date-filter][condition][path]=field_event_date&filter[event-date-filter][condition][operator]=%3E&filter[event-date-filter][condition][value]=2021";

  tiny.get({ url }, function _get(err, result) {
    if (err) {
      console.log("ruh roh!", err);
    } else {
      var body = result.body;
      var reducedBody = jsonhelper.dedup(body);
      reducedBody.forEach(item => {
        // console.log(`Adding ${item.title}`);
        var offset = tztool.getTZOffset(item.field_tz);
        var start = date.parse(item.field_event_date+offset, pattern);
        cal.createEvent({
          start: start,
          end: date.addHours(start, 3),
          summary: `${item.title} - ${item.field_sport}`,
          description: `BYU ${item.field_sport} - ${item.title}\n\n${
            item.field_tv != "" ? "TV: " + item.field_tv : ""
          }\n${
            item.field_streaming_video != ""
              ? "Streaming Video: " + item.field_streaming_video
              : ""
          }\n${item.field_radio != "" ? "Radio: " + item.field_radio : ""}\n${
            item.field_live_stats_url != ""
              ? "Live Stats: " + item.field_live_stats_url
              : ""
          }\n\nFull details: http://byucougars.com/schedule/all`.replace(
            /&amp;/g,
            "&"
          ),
          location: `${item.field_venue_name} - ${item.field_city}, ${item.field_state}`,
          url: item.field_tv === "" ? item.field_streaming_video : item.field_tv
        });
      });
      globalCal = cal;
    }
  });
}

updateCalendar();

var j = schedule.scheduleJob('0 * * * *', function(){
  updateCalendar();
  console.log(`Updated iCal at ${date.format(new Date(), 'YYYY/MM/DD HH:MM:SS')}`);
});

http
  .createServer(function(req, res) {
    globalCal.serve(res);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
