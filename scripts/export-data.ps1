param(
    [string]$OutputDir = ".\transfer-export",
    [switch]$SkipPostgres,
    [switch]$SkipCouchDb,
    [switch]$IncludeMongo,
    [switch]$IncludeInflux
)

$ErrorActionPreference = "Stop"

function Ensure-Directory {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function Load-EnvFile {
    param([string]$Path)

    $values = @{}
    if (-not (Test-Path $Path)) {
        return $values
    }

    foreach ($line in Get-Content $Path) {
        if ([string]::IsNullOrWhiteSpace($line) -or $line.TrimStart().StartsWith("#")) {
            continue
        }

        $parts = $line -split "=", 2
        if ($parts.Count -ne 2) {
            continue
        }

        $values[$parts[0].Trim()] = $parts[1].Trim()
    }

    return $values
}

function Get-Config {
    param(
        [hashtable]$EnvFile,
        [string]$Name,
        [string]$DefaultValue
    )

    $processValue = [Environment]::GetEnvironmentVariable($Name)
    if ($processValue) {
        return $processValue
    }

    if ($EnvFile.ContainsKey($Name) -and $EnvFile[$Name]) {
        return $EnvFile[$Name]
    }

    return $DefaultValue
}

$envValues = Load-EnvFile (Join-Path $PSScriptRoot "..\.env")

$pgHost = Get-Config $envValues "PG_HOST" "localhost"
$pgPort = Get-Config $envValues "PG_PORT" "5434"
$pgUser = Get-Config $envValues "PG_USER" "postgres"
$pgDb = Get-Config $envValues "PG_DB" "ligeia"
$pgPassword = Get-Config $envValues "PG_PASS" ""

$couchUrl = Get-Config $envValues "COUCHDB_URL" "http://localhost:5984"
$couchUser = Get-Config $envValues "COUCHDB_USER" "admin"
$couchPassword = Get-Config $envValues "COUCHDB_PASSWORD" ""

$mongoUser = Get-Config $envValues "MONGO_USER_NAME" "admin"
$mongoPassword = Get-Config $envValues "MONGO_PASS" ""
$influxUrl = Get-Config $envValues "INFLUX_HOST" "http://localhost:8086"
$influxToken = Get-Config $envValues "INFLUX_DB_TOKEN" ""

Ensure-Directory $OutputDir

if (-not $SkipPostgres) {
    Ensure-Directory (Join-Path $OutputDir "postgres")
    if (Get-Command pg_dump -ErrorAction SilentlyContinue) {
        $env:PGPASSWORD = $pgPassword
        & pg_dump -h $pgHost -p $pgPort -U $pgUser -d $pgDb -F c -f (Join-Path $OutputDir "postgres\ligeia.dump")
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
        Write-Host "PostgreSQL dump created."
    } else {
        Write-Warning "pg_dump not found. Run this on the host with PostgreSQL client tools:"
        Write-Host "pg_dump -h $pgHost -p $pgPort -U $pgUser -d $pgDb -F c -f $OutputDir\postgres\ligeia.dump"
    }
}

if (-not $SkipCouchDb) {
    Ensure-Directory (Join-Path $OutputDir "couchdb")
    if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
        & curl.exe -u "${couchUser}:${couchPassword}" "$couchUrl/_all_dbs" -o (Join-Path $OutputDir "couchdb\all-dbs.json")
        & curl.exe -u "${couchUser}:${couchPassword}" "$couchUrl/treeviewstate" -o (Join-Path $OutputDir "couchdb\treeviewstate.json")
        Write-Host "CouchDB export completed."
    } else {
        Write-Warning "curl.exe not found. Export CouchDB manually from $couchUrl."
    }
}

if ($IncludeMongo) {
    Ensure-Directory (Join-Path $OutputDir "mongo")
    if (Get-Command mongodump -ErrorAction SilentlyContinue) {
        & mongodump --host localhost --port 27017 --username $mongoUser --password $mongoPassword --authenticationDatabase admin --out (Join-Path $OutputDir "mongo")
        Write-Host "MongoDB dump created."
    } else {
        Write-Warning "mongodump not found. Install MongoDB Database Tools or export Mongo manually."
    }
}

if ($IncludeInflux) {
    Ensure-Directory (Join-Path $OutputDir "influx")
    if (Get-Command influx -ErrorAction SilentlyContinue) {
        & influx backup (Join-Path $OutputDir "influx") --host $influxUrl --token $influxToken
        Write-Host "InfluxDB backup created."
    } else {
        Write-Warning "influx CLI not found. Run 'influx backup' on the InfluxDB host."
    }
}
