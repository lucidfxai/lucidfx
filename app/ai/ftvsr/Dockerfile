# Start from a base image with Python and CUDA
FROM pytorch/pytorch:1.9.1-cuda11.1-cudnn8-devel

RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub && \
    apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/7fa2af80.pub

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y --no-install-recommends git ninja-build libglib2.0-0 libsm6 libxrender-dev libxext6 libgl1-mesa-glx && \

    rm -rf /var/lib/apt/lists/*

# Update pip
RUN pip install --upgrade pip

# Install the necessary software
RUN pip install \
    opencv-python==4.5.3.56 \
    mmcv-full==1.3.9 \
    scipy==1.7.3 \
    scikit-image==0.19.0 \
    lmdb==1.2.1 \
    yapf==0.31.0 \
    tensorboard==2.6.0

# Set the working directory
WORKDIR /workspace
