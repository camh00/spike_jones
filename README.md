
Spike Jones Deployment
=======================================

-----------------
QUICK START
-----------------

To start the project:

  docker compose up -d

  docker compose up //to view running logs

-----------------
SERVICE INFO
-----------------

  Web Interface: http://localhost:8080
  Container Name: project-app


-----------------
DATA STORAGE
-----------------

All project data is stored in the ./data directory as a bind mount.


-----------------
MIGRATION
-----------------

When migrating this application:

1. Stop the running containers:
   
   docker compose down

2. Copy the data directory (IMPORTANT: Maintain the exact directory structure):
   
   Copy the entire parent directory to maintain state:
   
   cp -r /path/to/spike_jones /new/location

3. Start the application in the new location:
   
   cd /new/location
   docker compose up -d


-----------------
PRODUCTION DEPLOYMENT
-----------------

For production deployment, an HTTPS proxy is required:
- Configure Apache or Nginx as a reverse proxy in front of the application
- Ensure SSL/TLS certificates are properly installed and configured
- Point the proxy to the application running on port 8080
-   Example Apache configuration:
  
  <VirtualHost *:443>
      ServerName your-domain.com
      
      SSLEngine on
      SSLCertificateFile /path/to/cert.pem
      SSLCertificateKeyFile /path/to/key.pem
      
      ProxyPreserveHost On
      ProxyPass / http://localhost:8080/
      ProxyPassReverse / http://localhost:8080/
      
      RequestHeader set X-Forwarded-Proto "https"
      RequestHeader set X-Forwarded-Port "443"
  </VirtualHost>


-----------------
TROUBLESHOOTING
-----------------

If the service doesn't start properly:
- Check docker logs: docker logs project-app
- Verify data directory permissions: ls -la ./data
- Ensure port 8080 is not already in use: netstat -tuln | grep 8080

=======================================
