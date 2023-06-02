import os
from PIL import Image

def halve_resolution(image_path, output_path):
    # Open an image file
    with Image.open(image_path) as img:
        # Halve the image size
        half_size = tuple([x // 2 for x in img.size])
        half_img = img.resize(half_size, Image.ANTIALIAS)

        # Save the new image
        half_img.save(output_path)

# Directory where the images are stored
input_dir = './000_0_0'
output_dir = './000_0_0_half'

for filename in os.listdir(input_dir):
    if filename.endswith('.png'):
        image_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        halve_resolution(image_path, output_path)

