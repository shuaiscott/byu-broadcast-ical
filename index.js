const ical = require("ical-generator");
const http = require("http");
const moment = require("moment");
const date = require("date-and-time");
var tiny = require("tiny-json-http");
const cal = ical({
  domain: "byu-broadcast-ical.herokuapp.com",
  name: "BYU Sports Broadcast Events"
});
const PORT = process.env.PORT || 5000;
const pattern = date.compile("YYYY-MM-DD[T]HH:mm:ss");

function retrieveCalendar(res) {
  const cal = ical({
    domain: "byu-broadcast-ical.herokuapp.com",
    name: "BYU Sports Broadcast Events"
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

  var url = "https://byucougars.com/dl/feeds/broadcast-schedule";

  tiny.get({ url }, function _get(err, result) {
    if (err) {
      console.log("ruh roh!", err);
    } else {
      result.body.forEach(item => {
        // console.log(item.title);
        var start = date.parse(item.field_event_date, pattern);
        cal.createEvent({
          uid: item.nid,
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
    }
  });
  console.log("Created new iCal")
  cal.serve(res);
}

http
  .createServer(function(req, res) {
    retrieveCalendar(res);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
