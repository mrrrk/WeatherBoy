# weatherboy

## To-do

Data loader - time, cache and throttle calls somehow... (< 1 per 4 mins)
  - get data + store locally with timestamp - DONE
  - error handling
  - display time stamp?
  - refresh periodically (if timestamp < x)

Metoffice day component
Weatherboy component

## metoffice

https://github.com/MetOffice/weather_datahub_utilities/blob/main/site_specific_download/Documentation.md


360 cals per day free = 15 per hour = every 4 mins

https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/daily

url
    timesteps (hourly, three-hourly, daily)

headers
    apiKey

query
    excludeParameterMetadata (default false)
    includeLocationName (default true)
    latitude
    longitude