# Check if the current execution policy allows running scripts
$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq "Restricted") {
    Write-Host "Script execution is currently restricted. You need to change the execution policy to run this script."
    Write-Host "To change the execution policy, open PowerShell as an administrator and run:"
    Write-Host "Set-ExecutionPolicy RemoteSigned"
    exit 1
}

# Check if venv folder exists, if not, create the virtual environment
if (-Not (Test-Path venv)) {
    python -m venv venv
}

# Activate the virtual environment (Windows)
$activateScript = ".\venv\Scripts\Activate"
if (Test-Path $activateScript) {
    . $activateScript
} else {
    Write-Host "Virtual environment activation script not found."
    exit 1
}

# Install dependencies from requirements.txt
pip install -r requirements.txt
