# Docker Image

We provide a [Dockerfile](Dockerfile) to build an image.

```shell
# build an image with PyTorch 1.6, CUDA 10.1
sudo docker build -t ai .
```

Run it with

```shell
sudo docker run --gpus all --shm-size=8g -it -v {DATA_DIR}:/{MOUNTED_DIR_IN_CONTAINER} ai
```


```DEV
sudo docker run --gpus all --shm-size=8g -it -v ./:/MOUNTED/FTVSR ai
```



''''
root@07b45cc78c1d:/MOUNTED/FTVSR/FTVSR# CUDA_VISIBLE_DEVICES=0 ./tools/dist_test.sh configs/FTVSR_reds4.py checkpoint/FTVSR_REDS.pth 1 --save-path '/MOUNTED'
