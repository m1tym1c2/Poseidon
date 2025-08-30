import os
import json
from tqdm import tqdm


keyframes_dir = '../data/keyframes'

json_dir = '../data/jsons'
os.makedirs(json_dir, exist_ok=True)

folders = [folder for folder in os.listdir(keyframes_dir) if os.path.isdir(os.path.join(keyframes_dir, folder))]

for folder_name in tqdm(folders, desc="Processing folders", unit="folder"):
    folder_path = os.path.join(keyframes_dir, folder_name)
    
    images_list = []

    for file_name in os.listdir(folder_path):
        if file_name.endswith('.jpg'):
            image_name = os.path.splitext(file_name)[0]
            images_list.append(image_name)

    json_content = {
        "listImages": images_list
    }

    json_file_path = os.path.join(json_dir, f"{folder_name}.json")

    with open(json_file_path, 'w') as json_file:
        json.dump(json_content, json_file, indent=4)

print("Tạo file JSON thành công!")
