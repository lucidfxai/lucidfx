ARG PYTORCH="2.0.1"
ARG CUDA="11.7"
ARG CUDA_ALIAS="117"
ARG CUDNN="8"

FROM pytorch/pytorch:${PYTORCH}-cuda${CUDA}-cudnn${CUDNN}-devel

ENV TORCH_CUDA_ARCH_LIST="6.0 6.1 7.0+PTX"
ENV TORCH_NVCC_FLAGS="-Xfatbin -compress-all"
ENV CMAKE_PREFIX_PATH="$(dirname $(which conda))/../"
ARG MMCV="2.0.0rc4"


RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub && \
    apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/7fa2af80.pub

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y --no-install-recommends git ninja-build libglib2.0-0 libsm6 libxrender-dev libxext6 libgl1-mesa-glx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install mmagic
RUN conda clean --all
RUN python --version
RUN git clone https://github.com/lucidfxai/mmagic.git /mmagic
WORKDIR /mmagic
ENV FORCE_CUDA="1"
RUN pip install openmim
RUN mim install mmcv==${MMCV}
RUN pip install PyQt5==5.15.6
RUN pip install -r requirements.txt
RUN pip install --no-cache-dir -e .
