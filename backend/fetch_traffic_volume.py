import requests
import json

def fetch_traffic_volume():
    url = "https://data.cityofnewyork.us/resource/7ym2-wayt.json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as err:
        print(f"Request error occurred: {err}")
    return None


if __name__ == "__main__":
    volume_data = fetch_traffic_volume()
    if volume_data:
        print(json.dumps(volume_data, indent=4))
    else:
        print("Failed to process data")
