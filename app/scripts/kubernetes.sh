# we’ll start by creating a cluster with a default node pool that contains only one small node:
PROJECT_ID="lucidfx-playground"
GCP_ZONE="europe-west1-b"
GKE_CLUSTER_NAME="burstable-cluster"
GKE_BURST_POOL="burst-zone"

gcloud container clusters create ${GKE_CLUSTER_NAME} \
       --machine-type=g1-small \
       --num-nodes=1 \
       --zone=${GCP_ZONE} \
       --project=${PROJECT_ID}

# Now, we’ll add the burst node pool using the following parameters:
#
# --machine-type=n1-highmem-96: this is the instance type we want to use for
# our ML training job. As opposed to the default node, which contains only one
# instance of type g1-small. 
#
# --accelerator=nvidia-tesla-v100,8: we want 8
# NVIDIA TESLA V100 GPUs in each node. These GPUs are not available in all
# regions and zones, so we will need to find a zone with enough capacity.
#
# --node-labels=gpu=tesla-v100: we add a label to the nodes in the burst pool
# to allow selecting them in our ML training workload using a node selector.
#
# --node-taints=reserved-pool=true:NoSchedule: we add a taint to the nodes to
# prevent any other workload from accidentally being scheduled in this node
# pool.

gcloud container node-pools create ${GKE_BURST_POOL} \
       --cluster=${GKE_CLUSTER_NAME} \
       --machine-type=n1-standard-1 \
       --accelerator=nvidia-tesla-a100,1 \
       --node-labels=gpu=tesla-a100 \
       --node-taints=reserved-pool=true:NoSchedule  \
       --enable-autoscaling \
       --min-nodes=0 \
       --max-nodes=1 \
       --zone=${GCP_ZONE} \
       --project=${PROJECT_ID}


# To test the configuration, we will create a job that will create 4 pods running
# in parallel during 10 minutes. The pods in our workload will need to have the
# following elements:
#
# A nodeSelector matching the label we have added to our burst node pool:
# gpu=tesla-v100. A podAntiAffinity rule indicating that we do not want two pods
# with the same label app=greedy-job running in the same node. For this we will
# add the appropriate label to our pods, and indicate in the topologyKey that it
# applies at the hostname level (no two such pods in the same node). Finally, we
# need to add a toleration to the taint that we attached to the nodes, so these
# podes are allowed to be scheduled in these nodes.
#


