import os
import sys
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()

# Auto-migrate and seed in production if tables are missing
try:
    from django.db import connection
    from django.core.management import call_command

    tables = connection.introspection.table_names()
    if 'accounts_user' not in tables:
        print("[WSGI AUTO-MIGRATE] Database tables missing. Running manage.py migrate...")
        call_command('migrate', interactive=False)
        print("[WSGI AUTO-MIGRATE] Migrations completed successfully.")

        try:
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            parent_dir = os.path.dirname(backend_dir)
            if parent_dir not in sys.path:
                sys.path.insert(0, parent_dir)
            from seed_demo_data import seed_data
            print("[WSGI AUTO-SEED] Seeding demo data...")
            seed_data()
            print("[WSGI AUTO-SEED] Seeding completed.")
        except Exception as seed_err:
            print("[WSGI AUTO-SEED WARNING] Could not run seed_demo_data:", seed_err)
except Exception as err:
    print("[WSGI AUTO-MIGRATE WARNING] Auto migration check failed:", err)
