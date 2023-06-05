import numpy as np
from PIL import Image
from ISR.models import RDN

img = Image.open('../data/input/sample/baboon.png')
lr_img = np.array(img)


rdn = RDN(weights='psnr-small')
sr_img = rdn.predict(lr_img)
image = Image.fromarray(sr_img)
