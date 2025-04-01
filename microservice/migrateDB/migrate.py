from db_migrate_users import migrateUserDB
from db_migrate_patients import migratePatientDB
from db_migrate_notifications import migrateNotificationDB
from db_migrate_predictions import migratePredictionsDB
from db_migrate_reports import migrateReportDB


migrateUserDB()
migratePatientDB()
migrateNotificationDB()
migrateReportDB()
migratePredictionsDB()