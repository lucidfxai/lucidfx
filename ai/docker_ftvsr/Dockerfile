# Start from a base image with Python, CUDA and PyTorch
FROM pytorch/pytorch:1.9.0-cuda10.2-cudnn7-runtime

# Set the working directory in the Docker container
WORKDIR /workspace

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    git

# Install Python dependencies
RUN pip install opencv-python==4.5.3.56
RUN pip install mmcv-full==1.3.9
RUN pip install scipy==1.7.3
RUN pip install scikit-image==0.19.0
RUN pip install lmdb==1.2.1
RUN pip install yapf==0.31.0
RUN pip install tensorboard==2.6.0

# Clone and install FTVSR project
RUN git clone https://github.com/researchmm/FTVSR.git
WORKDIR /workspace/FTVSR

# Assume that you have a 'requirements.txt' file in the root of your repository
RUN pip install -r requirements.txt

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    git
