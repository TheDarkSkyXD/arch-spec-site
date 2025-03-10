#!/bin/bash
# Script to run tech data synchronization and correction tools

echo "========== Tech Stack Data Synchronization Tools =========="
echo ""

# Create scripts directory if it doesn't exist
mkdir -p backend/app/scripts

# Make Python scripts executable
chmod +x backend/app/scripts/correct_templates.py

echo ""
echo "Running tech data correction script..."
python -m app.scripts.correct_templates

echo ""
echo "========== Process completed =========="
echo "Check the 'corrected_templates.py' file for corrected templates"
echo "Review the suggested changes before replacing the original files" 