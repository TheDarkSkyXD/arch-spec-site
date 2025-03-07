#!/bin/bash
# Script to run tech data synchronization and correction tools

echo "========== Tech Stack Data Synchronization Tools =========="
echo ""

# Create scripts directory if it doesn't exist
mkdir -p backend/app/scripts

# Make Python scripts executable
chmod +x backend/app/scripts/sync_tech_data.py
chmod +x backend/app/scripts/correct_tech_data.py

echo "Running tech data analysis script..."
cd backend
python -m app.scripts.sync_tech_data

echo ""
echo "Running tech data correction script..."
python -m app.scripts.correct_tech_data

echo ""
echo "========== Process completed =========="
echo "Check the 'corrected_data' directory for corrected files"
echo "Review the suggested changes before replacing the original files" 