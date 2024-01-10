from flask import Flask, request, jsonify
from fetch_traffic_speeds import fetch_traffic_speeds
from fetch_traffic_volume import fetch_traffic_volume
from flask_cors import CORS
from datetime import datetime
import dateutil.parser



app = Flask(__name__)
CORS(app)

# also I want to eid speedsdisplay.js and volumesdisplay.js to show only most recent 10 entries in a good tabular form, so give code for that too

def iso_to_naive(iso_str):
    dt = dateutil.parser.isoparse(iso_str)
    return dt.replace(tzinfo=None)

@app.route('/traffic_speeds')
def traffic_speeds():
    data = fetch_traffic_speeds()
    processed_data = process_traffic_speeds(data)
    return jsonify(processed_data)

@app.route('/traffic_volume')
def traffic_volume():
    data = fetch_traffic_volume()
    processed_data = process_traffic_volume(data)
    return jsonify(processed_data)

@app.route('/traffic_data/time_series')
def traffic_time_series():
    raw_data = fetch_traffic_speeds()
    # Process raw_data to create time series data
    time_series_data = aggregate_time_series(raw_data)
    return jsonify(time_series_data)

@app.route('/traffic_data/heatmap')
def traffic_heatmap():
    raw_data = fetch_traffic_speeds()
    heatmap_data = process_for_heatmap(raw_data)
    return jsonify(heatmap_data)

@app.route('/traffic_data/conditions')
def traffic_conditions():
    raw_data = fetch_traffic_speeds()
    conditions_count = categorize_traffic_conditions(raw_data)
    return jsonify(conditions_count)

@app.route('/traffic_data')
def get_traffic_data():
    # Retrieve query parameters
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')
    # Convert to offset-naive datetime objects
    start_date = iso_to_naive(start_date_str) if start_date_str else None
    end_date = iso_to_naive(end_date_str) if end_date_str else None
    condition = request.args.get('condition', 'All')  # Default to 'All' if not specified

    # Convert string dates to datetime objects
    start_date = datetime.fromisoformat(start_date_str) if start_date_str else None
    end_date = datetime.fromisoformat(end_date_str) if end_date_str else None

    # Fetch and filter data based on parameters
    traffic_data = fetch_traffic_speeds()
    filtered_data = filter_traffic_data(traffic_data, start_date, end_date, condition)

    return jsonify(filtered_data)

def filter_traffic_data(data, start_date, end_date, condition):
    # Implement filtering logic here
    # Example: Filter by date range and condition
    filtered = [item for item in data if is_within_date_range(item, start_date, end_date)]
    if condition != 'All':
        filtered = [item for item in filtered if matches_condition(item, condition)]
    return filtered

def is_within_date_range(item, start_date, end_date):
    # Compare item's date with the provided range
    item_date = datetime.fromisoformat(item['data_as_of'])
    return (not start_date or item_date >= start_date) and (not end_date or item_date <= end_date)

def matches_condition(item, condition):
    # Determine if the item matches the specified traffic condition
    # Example: Based on item's speed
    speed = float(item.get('speed', 0))
    if condition == 'Congested' and speed < 20:
        return True
    if condition == 'Slow-moving' and 20 <= speed < 40:
        return True
    if condition == 'Free-flowing' and speed >= 40:
        return True
    return False

def categorize_traffic_conditions(raw_data):
    # Define speed thresholds for each condition
    thresholds = {
        "Congested": 20,     # Speed less than 20
        "Slow-moving": 40,   # Speed between 20 and 40
        "Free-flowing": float('inf')  # Speed greater than 40
    }

    # Initialize counters for each traffic condition
    conditions = { "Congested": 0, "Slow-moving": 0, "Free-flowing": 0 }

    for item in raw_data:
        speed = float(item.get('speed', 0))
        if speed < thresholds["Congested"]:
            conditions["Congested"] += 1
        elif speed < thresholds["Slow-moving"]:
            conditions["Slow-moving"] += 1
        else:
            conditions["Free-flowing"] += 1

    return conditions

def process_for_heatmap(raw_data):
    heatmap_data = []
    for item in raw_data:
        link_points = item.get('link_points', '').split()
        for point in link_points:
            coords = point.split(',')
            if len(coords) == 2:
                try:
                    lat, lon = map(float, coords)
                    intensity = float(item.get('speed', 0))
                    heatmap_data.append([lat, lon, intensity])
                except ValueError:
                    # Handle the case where conversion to float fails
                    continue
    return heatmap_data





def aggregate_time_series(raw_data):
    # Example aggregation logic - modify according to your data structure
    # This is a placeholder for demonstration purposes
    aggregated_data = {}
    for data_point in raw_data:
        timestamp = data_point.get("data_as_of")
        speed = float(data_point.get("speed", 0))
        if timestamp in aggregated_data:
            aggregated_data[timestamp].append(speed)
        else:
            aggregated_data[timestamp] = [speed]

    # Calculating average speed for each timestamp
    time_series_result = []
    for timestamp, speeds in aggregated_data.items():
        avg_speed = sum(speeds) / len(speeds) if speeds else 0
        time_series_result.append({"timestamp": timestamp, "average_speed": avg_speed})

    return time_series_result

def process_traffic_speeds(data):
    processed_data = []
    for item in data:
        # Extracting relevant fields and location data
        link_points = item.get('link_points', '')
        points = link_points.split(' ')
        lat, lon = (None, None)
        if points:
            lat, lon = map(float, points[0].split(','))  # Assumes the first point is the location

        processed_data.append({
            'id': item.get('id'),
            'speed': item.get('speed'),
            'travel_time': item.get('travel_time'),
            'status': item.get('status'),
            'data_as_of': item.get('data_as_of'),
            'link_name': item.get('link_name'),
            'location': {'latitude': lat, 'longitude': lon} if lat and lon else None
        })
    return processed_data

def process_traffic_volume(data):
    processed_data = []
    for item in data:
        # Extracting location from wktgeom
        geom = item.get('wktgeom', '')
        coords = geom.replace('POINT (', '').replace(')', '').split(' ')
        lat, lon = (None, None)
        if len(coords) == 2:
            lat, lon = map(float, coords)

        processed_data.append({
            'requestid': item.get('requestid'),
            'volume': item.get('vol'),
            'street': item.get('street'),
            'fromst': item.get('fromst'),
            'tost': item.get('tost'),
            'direction': item.get('direction'),
            'location': {'latitude': lat, 'longitude': lon} if lat and lon else None
        })
    return processed_data

if __name__ == '__main__':
    app.run(debug=True)
