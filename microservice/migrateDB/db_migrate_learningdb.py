import os
import time
import subprocess
import psycopg2
import schedule

# Source Database Credentials
SRC_HOST = "pg-hackathons-atharvabholework-d81c.h.aivencloud.com"
SRC_PORT = "11956"
SRC_USER = "avnadmin"
SRC_PASSWORD = "AVNS_xAfTfm_JvMUo3agCECr"
SRC_DB = "learning_db"

# Target Database Credentials
TARGET_HOST = "pg-1abc488-sampatil2601-cf28.f.aivencloud.com"
TARGET_PORT = "23863"
TARGET_USER = "avnadmin"
TARGET_PASSWORD = "AVNS_gu48I4dXfSDlGi4P_h-"
TARGET_DB = "defaultdb"

# Set environment variables for PostgreSQL authentication
os.environ["PGPASSWORD"] = SRC_PASSWORD


def replicate_db():
    """Function to replicate the database using pg_dump and pg_restore."""
    print("\n🔄 Starting database replication...")

    dump_file = "db_dump.dump"

    dump_command = (
        f"pg_dump -h {SRC_HOST} -p {SRC_PORT} -U {SRC_USER} -d {SRC_DB} -Fc -f {dump_file}"
    )

    restore_command = (
        f"PGPASSWORD={TARGET_PASSWORD} pg_restore -h {TARGET_HOST} -p {TARGET_PORT} -U {TARGET_USER} -d {TARGET_DB} --clean --if-exists {dump_file}"
    )

    try:
        print("📤 Dumping source database...")
        dump_result = subprocess.run(dump_command, shell=True, capture_output=True, text=True)
        if dump_result.returncode != 0:
            print("❌ Error dumping database:", dump_result.stderr)
            return

        print("📥 Restoring to target database...")
        restore_result = subprocess.run(restore_command, shell=True, capture_output=True, text=True)
        if restore_result.returncode != 0:
            print("❌ Error restoring database:", restore_result.stderr)
            return

        print("✅ Database replication completed successfully!")

    except Exception as e:
        print(f"⚠️ Error during replication: {e}")


def monitor_database():
    """Monitor changes in the entire database using row updates and inserts."""
    try:
        conn = psycopg2.connect(
            dbname=SRC_DB, user=SRC_USER, password=SRC_PASSWORD, host=SRC_HOST, port=SRC_PORT
        )
        cursor = conn.cursor()

        # Check total inserts, updates, and deletes from all user tables
        cursor.execute("""
            SELECT SUM(n_tup_ins + n_tup_upd + n_tup_del) AS total_changes
            FROM pg_stat_user_tables;
        """)

        result = cursor.fetchone()
        total_changes = result[0] if result and result[0] else 0

        global last_changes
        if "last_changes" not in globals():
            last_changes = total_changes
        print("Coming to debug block")
        # If there is a change in inserted, updated, or deleted rows, trigger replication
        if total_changes > last_changes:
            print("🔄 Database activity detected! Starting replication...")
            replicate_db()
            last_changes = total_changes  # Update last known count

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"⚠️ Error monitoring database changes: {e}")


# Schedule the monitoring and replication every 10 seconds
schedule.every(1).seconds.do(monitor_database)

print("📡 Database live replication started... Press Ctrl+C to stop.")
def migrateLearningDB():
    while True:
        schedule.run_pending()
        time.sleep(1)
