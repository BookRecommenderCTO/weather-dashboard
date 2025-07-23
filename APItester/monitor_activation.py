#!/usr/bin/env python3
"""
OpenWeatherMap API Key Activation Monitor
Checks if the API key is activated and ready to use
"""

import requests
import time
from datetime import datetime

# Your confirmed API key from OpenWeatherMap
API_KEY = '47d05f31a987ba26930cfaa7fd83326c'
TEST_URL = f'https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID={API_KEY}'

def check_api_status():
    """Check if the API key is working"""
    try:
        response = requests.get(TEST_URL, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            temp = data['main']['temp'] - 273.15  # Convert from Kelvin to Celsius
            description = data['weather'][0]['description']
            
            print(f"🎉 SUCCESS! API key is now ACTIVE!")
            print(f"   London weather: {temp:.1f}°C, {description}")
            print(f"   Time activated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            return True
            
        elif response.status_code == 401:
            print(f"⏳ Still waiting... API key not activated yet")
            print(f"   Time checked: {datetime.now().strftime('%H:%M:%S')}")
            return False
            
        else:
            print(f"❌ Unexpected error: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

def monitor_activation(check_interval=300):  # Check every 5 minutes
    """Monitor API key activation with periodic checks"""
    
    print("=" * 60)
    print("OpenWeatherMap API Key Activation Monitor")
    print("=" * 60)
    print(f"API Key: {API_KEY[:8]}...{'*' * 24}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Check interval: {check_interval//60} minutes")
    print("-" * 60)
    
    check_count = 0
    
    while True:
        check_count += 1
        print(f"\nCheck #{check_count}:")
        
        if check_api_status():
            print("\n🎉 API key is ready! You can now update your weather dashboard.")
            break
        
        print(f"   Next check in {check_interval//60} minutes...")
        time.sleep(check_interval)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "once":
        # Single check
        check_api_status()
    else:
        # Continuous monitoring
        print("Starting activation monitor...")
        print("Press Ctrl+C to stop monitoring")
        try:
            monitor_activation()
        except KeyboardInterrupt:
            print("\n\n👋 Monitoring stopped by user")
