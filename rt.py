import os

TARGET_FOLDERS = [
    "src",
    "public",
    "src",
    "scripts",
]

def print_tree(path, prefix=""):
    items = sorted(os.listdir(path))

    for i, item in enumerate(items):
        full_path = os.path.join(path, item)
        connector = "└── " if i == len(items) - 1 else "├── "

        print(prefix + connector + item)

        if os.path.isdir(full_path):
            extension = "    " if i == len(items) - 1 else "│   "
            print_tree(full_path, prefix + extension)


for folder in TARGET_FOLDERS:
    if os.path.exists(folder):
        print(f"\n📁 {folder}")
        print_tree(folder)
    else:
        print(f"\n❌ Folder '{folder}' tidak ditemukan.")