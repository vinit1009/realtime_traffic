import requests
import json

def fetch_traffic_speeds():
    url = "https://data.cityofnewyork.us/resource/i4gi-tjb9.json"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises an HTTPError for bad requests
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as err:
        print(f"Request error occurred: {err}")
    return []

if __name__ == "__main__":
    traffic_speeds_data = fetch_traffic_speeds()
    print(json.dumps(traffic_speeds_data, indent = 4))
