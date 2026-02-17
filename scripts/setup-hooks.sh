#!/bin/bash

source_dir="git-hooks"
dest_dir=".git/hooks"

if [ "$#" -eq 0 ]; then
    echo "Usage: $0 file1 [file2 ...] | all"
    exit 1
fi

if [ ! -d "$source_dir" ]; then
    echo "Error: Directory '$source_dir' does not exist."
    exit 1
fi

if [ ! -d "$dest_dir" ]; then
    echo "Error: Directory '$dest_dir' does not exist."
    exit 1
fi

if [ "$1" == "all" ]; then
    for file in "$source_dir"/*; do
        if [ -f "$file" ]; then
            cp "$file" "$dest_dir"
            chmod +x "$dest_dir/$(basename "$file")"
            echo "Copied $(basename "$file") to $dest_dir"
        fi
    done
else
    for file in "$@"; do
        if [ -f "$source_dir/$file" ]; then
            cp "$source_dir/$file" "$dest_dir"
            chmod +x "$dest_dir/$file"
            echo "Copied $file to $dest_dir"
        else
            echo "Warning: File $file does not exist in $source_dir"
        fi
    done
fi

echo "Git hooks installed."
