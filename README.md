# BYU Sports Broadcast Schedule iCal
A simple JSON to iCal mapper for [BYU Athletics Broadcast schedule](https://byucougars.com/schedule/broadcast/)

## [Hosted on Heroku](https://byu-broadcast-ical.herokuapp.com)

This application:

1. Downloads JSON from https://byucougars.com/dl/feeds/broadcast-schedule
2. Dedupes Event JSON objects by nid
3. Extracts the time and timezone and saves it in GMT time
4. Maps Event details and adds links to broadcast media (Live Video, Radio, Live Stats)
5. Generates an iCal with the above information