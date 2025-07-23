#!/usr/bin/env python3
"""
OpenWeatherMap API Key Tester
Test utility to validate OpenWeatherMap API key functionality
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
API_KEY_1 = '47d05f31a987ba26930cfaa7fd83326c'  # Original key
API_KEY_2 = '19ea464a321395e531e1903b76bacf9c'  # New key
BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
TEST_CITIES = ['New York', 'London', 'Tokyo']

def test_both_api_keys():
    """Test both API keys to find the working one"""
    print("=" * 70)
    print("OpenWeatherMap API Key Comparison Test")
    print("=" * 70)
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\nTesting both API keys to find the working one...")
    print("=" * 70)
    
    keys_to_test = [
        {"name": "API Key 1 (Original)", "key": API_KEY_1},
        {"name": "API Key 2 (New)", "key": API_KEY_2}
    ]
    
    working_key = None
    
    for key_info in keys_to_test:
        print(f"\n{'='*50}")
        print(f"Testing {key_info['name']}")
        print(f"Key: {key_info['key'][:8]}...{'*' * 24}")
        print(f"{'='*50}")
        
        success_count = 0
        
        for city in TEST_CITIES:
            print(f"\n  Testing: {city}")
            print(f"  {'-'*25}")
            
            try:
                url = f"{BASE_URL}?q={city}&appid={key_info['key']}&units=metric"
                response = requests.get(url, timeout=10)
                
                print(f"  Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    temp = data['main']['temp']
                    description = data['weather'][0]['description']
                    
                    print(f"  ✅ SUCCESS")
                    print(f"     Temperature: {temp}°C")
                    print(f"     Description: {description}")
                    success_count += 1
                    
                elif response.status_code == 401:
                    print(f"  ❌ UNAUTHORIZED - Invalid API Key")
                    print(f"     Message: {response.json().get('message', 'No message')}")
                    
                else:
                    print(f"  ❌ ERROR - HTTP {response.status_code}")
                    try:
                        error_data = response.json()
                        print(f"     Message: {error_data.get('message', 'No message')}")
                    except:
                        print(f"     Raw Response: {response.text[:50]}...")
                        
            except Exception as e:
                print(f"  ❌ ERROR - {str(e)}")
        
        print(f"\n  Results: {success_count}/{len(TEST_CITIES)} cities successful")
        
        if success_count == len(TEST_CITIES):
            print(f"  🎉 THIS KEY WORKS PERFECTLY!")
            working_key = key_info
        elif success_count > 0:
            print(f"  ⚠️  Partial success")
        else:
            print(f"  🚨 This key failed all tests")
    
    print(f"\n{'='*70}")
    print("FINAL RESULTS")
    print(f"{'='*70}")
    
    if working_key:
        print(f"🎉 WORKING API KEY FOUND: {working_key['name']}")
        print(f"   Key: {working_key['key'][:8]}...{'*' * 24}")
        print(f"\n✅ Use this key in your weather dashboard!")
        return working_key['key']
    else:
        print(f"🚨 NO WORKING API KEYS FOUND")
        print(f"   Both keys failed. Please check:")
        print(f"   - API key activation status")
        print(f"   - Account validity")
        print(f"   - Network connectivity")
        return None

def test_api_key(api_key=None):
    """Test a specific API key with multiple cities"""
    if not api_key:
        api_key = API_KEY_2  # Default to new key
    
    print("=" * 60)
    print("OpenWeatherMap API Key Tester")
    print("=" * 60)
    print(f"API Key: {api_key[:8]}..." + "*" * 24)
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 60)
    
    success_count = 0
    total_tests = len(TEST_CITIES)
    
    for city in TEST_CITIES:
        print(f"\nTesting: {city}")
        print("-" * 30)
        
        try:
            # Construct the API URL
            url = f"{BASE_URL}?q={city}&appid={API_KEY}&units=metric"
            
            # Make the API request
            response = requests.get(url, timeout=10)
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                temp = data['main']['temp']
                description = data['weather'][0]['description']
                humidity = data['main']['humidity']
                
                print(f"✅ SUCCESS")
                print(f"   Temperature: {temp}°C")
                print(f"   Description: {description}")
                print(f"   Humidity: {humidity}%")
                success_count += 1
                
            elif response.status_code == 401:
                print(f"❌ UNAUTHORIZED - Invalid API Key")
                print(f"   Message: {response.json().get('message', 'No message')}")
                
            elif response.status_code == 404:
                print(f"❌ NOT FOUND - City not found")
                print(f"   Message: {response.json().get('message', 'No message')}")
                
            elif response.status_code == 429:
                print(f"❌ RATE LIMITED - Too many requests")
                print(f"   Message: {response.json().get('message', 'No message')}")
                
            else:
                print(f"❌ ERROR - HTTP {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Message: {error_data.get('message', 'No message')}")
                except:
                    print(f"   Raw Response: {response.text[:100]}...")
                    
        except requests.exceptions.Timeout:
            print(f"❌ TIMEOUT - Request timed out after 10 seconds")
            
        except requests.exceptions.ConnectionError:
            print(f"❌ CONNECTION ERROR - Cannot reach API server")
            
        except Exception as e:
            print(f"❌ UNEXPECTED ERROR - {str(e)}")
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total Tests: {total_tests}")
    print(f"Successful: {success_count}")
    print(f"Failed: {total_tests - success_count}")
    print(f"Success Rate: {(success_count/total_tests)*100:.1f}%")
    
    if success_count == total_tests:
        print("\n🎉 ALL TESTS PASSED - Your API key is working correctly!")
        return True
    elif success_count == 0:
        print("\n🚨 ALL TESTS FAILED - Check your API key and network connection")
        print("\nCommon issues:")
        print("- API key not activated (can take up to 2 hours)")
        print("- Invalid API key")
        print("- Network/firewall issues")
        return False
    else:
        print(f"\n⚠️  PARTIAL SUCCESS - {success_count}/{total_tests} tests passed")
        return False

def test_single_city(city_name):
    """Test API with a single city"""
    print(f"Testing single city: {city_name}")
    
    url = f"{BASE_URL}?q={city_name}&appid={API_KEY}&units=metric"
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Full URL: {url.replace(API_KEY, 'API_KEY_HIDDEN')}")
        print(f"Status Code: {response.status_code}")
        print(f"Raw Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Parsed Data: {json.dumps(data, indent=2)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Test single city if provided as argument
        city = " ".join(sys.argv[1:])
        test_single_city(city)
    else:
        # Run comparison test for both API keys
        test_both_api_keys()
