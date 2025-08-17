import requests
import json

def test_login():
    url = "http://localhost:8000/api/users/login/"
    data = {
        "username": "sherry",
        "password": "test123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"Access Token: {response_data.get('access', 'Not found')}")
            print(f"User Data: {response_data.get('user', 'Not found')}")
        else:
            print("Login failed!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login() 