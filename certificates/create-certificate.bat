
SET dir=%cd%

rem cd %GLOBAL_BUILD_CONFIGURATION%

rem git pull origin master

rem cd %dir%

%GLOBAL_BUILD_CONFIGURATION%\Certificates\mkcert -install

%GLOBAL_BUILD_CONFIGURATION%\Certificates\mkcert -p12-file %dir%\cert.pfx -pkcs12 localhost api.local.enumis.co.uk account.local.enumis.co.uk admin.local.enumis.co.uk 127.0.0.1 ::1

%GLOBAL_BUILD_CONFIGURATION%\Certificates\mkcert -cert-file %dir%\cert.pem -key-file %dir%\cert-key.pem localhost api.local.enumis.co.uk account.local.enumis.co.uk admin.local.enumis.co.uk 127.0.0.1 ::1

dotnet dev-certs https --trust

exit