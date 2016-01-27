##Day 1 (1/25/15)
###Time Frame
Today I worked from 11AM to around 11:30PM with an hour and a half of down time.
That's 11 hours at work.

###Features
- Site
  - Uploading .nc files
  - .nc to JSON conversion
  - Browsing available files
  - Previewing files with THREE.JS
  - Returning raw JSON

###Tomorrows Agenda
- Make real THREEJS viewer with movement, raycasting, and information displayed on screen
- Make it easy to search entries
- Add abilility to get only specified chunks of the JSON file
- Collect metadata after upload and store that in the database
- Put routes in their own file
- Combine redundant templates
- Maybe seporate API from site

###Problems I ran into
- Uploading things is a pain in the ass
- I had to make multiple big design decisions
- True MVC was a little overkill, so I just kept all of the routes/controllers in the main server.js, and that got messy fast.Hopefully I can fix that tomorrow

I really hope I can still read my code tomorrow!


###GREAT IDEA
Unity asks /someinng/:viewnumber/status for a num
when the num is differnet than previous number, reload blocks from api.