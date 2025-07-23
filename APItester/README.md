# OpenWeatherMap API Tester

This utility tests the OpenWeatherMap API key used in the weather dashboard to help diagnose issues.

## Requirements

- Python 3.x
- `requests` library (install with: `pip install requests`)

## Usage

### Test All Cities (Full Test Suite)
```bash
python test_api.py
```

This will test the API key with multiple cities (New York, London, Tokyo, Paris, Sydney) and provide a comprehensive report.

### Test Single City
```bash
python test_api.py "New York"
python test_api.py "London"
python test_api.py "Any City Name"
```

## What It Tests

1. **API Key Validity** - Checks if the API key is valid and activated
2. **Network Connectivity** - Verifies connection to OpenWeatherMap servers
3. **Response Parsing** - Tests if the API returns expected data format
4. **Multiple Cities** - Tests with different city names to ensure consistency

## Common Error Codes

- **200**: Success - API key working correctly
- **401**: Unauthorized - Invalid or inactive API key
- **404**: Not Found - City name not recognized
- **429**: Rate Limited - Too many API calls (free plan limit: 1000/day)

## Troubleshooting

If you see **401 Unauthorized** errors:
1. Check your API key at https://openweathermap.org/api_keys
2. Wait up to 2 hours for new API keys to activate
3. Verify you're using the correct API key

If you see **Connection** errors:
1. Check your internet connection
2. Verify firewall settings allow HTTPS requests
3. Try running the test from a different network

## Output Example

```
============================================================
OpenWeatherMap API Key Tester
============================================================
API Key: 47d05f31...************************
Test Time: 2025-07-20 13:16:00
------------------------------------------------------------

Testing: New York
------------------------------
Status Code: 200
✅ SUCCESS
   Temperature: 22.5°C
   Description: clear sky
   Humidity: 65%
```
