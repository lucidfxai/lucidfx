wget https://developer.download.nvidia.com/compute/cuda/12.1.1/local_installers/cuda-repo-debian11-12-1-local_12.1.1-530.30.02-1_amd64.deb
sudo dpkg -i cuda-repo-debian11-12-1-local_12.1.1-530.30.02-1_amd64.deb
sudo cp /var/cuda-repo-debian11-12-1-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo add-apt-repository contrib
sudo apt-get update
sudo apt-get -y install cuda



Even with those commands, the issue wasn’t solved.
Eventually, the fastest way to fix 2 machines with a package manager is to purge all Nvidia & Cuda,did it by:

sudo apt-get remove --purge '^nvidia-.*'
sudo apt-get remove --purge '^libnvidia-.*'
sudo apt-get remove --purge '^cuda-.*'
Then after it’s clean ran that:
sudo apt-get install linux-headers-$(uname -r)

From here - it’s the same for all VMs:
Download latest run 2.7k file from Nvidia site, and run it, accept if needed to upgrade current, or install from scratch.
The driver is back to work.

The issue was started after did some updates, and the Linux kernel was changed.
