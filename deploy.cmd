@echo off

IF "%SITE_FLAVOR%" == "client" (
  deploy.client.cmd
) ELSE (
  IF "%SITE_FLAVOR%" == "api" (
    deploy.api.cmd
  ) ELSE (
    echo You have to set SITE_FLAVOR setting to either "client" or "api"
    exit /b 1
  )
)
