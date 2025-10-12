#!/bin/bash
# JCS Backup Script - Creates timestamped backup of all important files

BACKUP_DIR="backups/$(date +%Y-%m-%d_%H-%M-%S)"
mkdir -p "$BACKUP_DIR"

# Backup all pages
cp -r src/pages "$BACKUP_DIR/"
cp -r src/components "$BACKUP_DIR/"
cp -r src/layouts "$BACKUP_DIR/"
cp -r public/css "$BACKUP_DIR/"

echo "✅ Backup created at: $BACKUP_DIR"
