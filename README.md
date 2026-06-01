# weatherboy



Screen size 800 x 480 (RPi 7" screen)

## To-do
  - edit clouds (too many black ones)

## Sun and Moon
  - calculated locally - does not use APIs (e.g. https://en.wikipedia.org/wiki/Sunrise_equation)

### Metoffice API
  - max daily calls = 360
  - interval to check triggers once per minute
  - uses locally cached data unless
     - daily data is over two hours old (12 calls per day)
     - hourly data is over 15 mins old (96 calls per day)

https://github.com/MetOffice/weather_datahub_utilities/blob/main/site_specific_download/Documentation.md


endpoint: https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/[timeSteps]

timesteps = hourly | three-hourly | daily

headers
    apiKey

query
    excludeParameterMetadata (default false)
    includeLocationName (default true)
    latitude
    longitude




