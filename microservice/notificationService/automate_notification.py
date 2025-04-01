import psycopg2
import requests
import schedule
import time
from datetime import datetime

DB_CONFIG = {
    "dbname": "patientservice",  
    "user": "avnadmin",          
    "password": "AVNS_xAfTfm_JvMUo3agCECr",      
    "host": "pg-hackathons-atharvabholework-d81c.h.aivencloud.com",
    "port": "11956"             
}

USER_DB_CONFIG = {
    "dbname": "userservice",    
    "user": "avnadmin",          
    "password": "AVNS_xAfTfm_JvMUo3agCECr",      
    "host": "pg-hackathons-atharvabholework-d81c.h.aivencloud.com",              
    "port": "11956"                    
}

NOTIFICATION_API_URL = "http://localhost:5454/notifications/api/email/send-email"

RISK_THRESHOLD = 70  

def connect_db():
    """Connect to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        user_conn = psycopg2.connect(**USER_DB_CONFIG)
        return conn, user_conn
    except psycopg2.Error as e:
        print(f"Failed to connect to database: {e}")
        return None

def check_risk_scores():
    """Check risk scores from the patients table and send notifications if needed."""
    conn, user_conn = connect_db()
    if not conn and user_conn:
        return

    try:
        cursor = conn.cursor()
        user_cursor = user_conn.cursor()
        
        cursor.execute('''SELECT id, name, "riskScore" FROM patients''')
        user_cursor.execute("SELECT email FROM users LIMIT 1")
        user = user_cursor.fetchone()
        patients = cursor.fetchall()
        print(patients)
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Checking risk scores...")

        for patient in patients:
            patient_id, name, risk_score = patient
            print(f"Patient ID: {patient_id}, Name: {name}, Risk Score: {risk_score}")

            if risk_score >= RISK_THRESHOLD:
                
                payload = {
                    "patientId": patient_id,
                    "patientName": name,
                    "sepsisRisk": float(risk_score),  
                    "doctorEmail" : user
                }
                try:
                    response = requests.post(NOTIFICATION_API_URL, json=payload, timeout=5)
                    if response.status_code == 200:
                        print(f"Notification sent for {name} (ID: {patient_id}): {response.json()}")
                    else:
                        print(f"Failed to send notification for {name} (ID: {patient_id}): {response.status_code} - {response.text}")
                except requests.RequestException as e:
                    print(f"Error sending notification for {name} (ID: {patient_id}): {e}")

        cursor.close()
        conn[0].close()
        conn[1].close()

    except psycopg2.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        if conn and not conn.closed:
            conn.close()

def main():
    """Main function to schedule and run the risk score checker."""
    
    schedule.every(5).seconds.do(check_risk_scores)

    print("Starting risk score monitoring. Checks will run every 5 minutes.")
    
    while True:
        schedule.run_pending()
        time.sleep(1)  

if __name__ == "__main__":
    conn = connect_db()
    if conn:
        print("Successfully connected to the PostgreSQL database.")
        conn[0].close()
        conn[1].close()
    else:
        print("Exiting due to database connection failure.")
        exit(1)
    
    main()