const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

const targetNamespaceName = 'hipster';
const targetDeploymentName = 'checkoutservice';
const new_image = "ghcr.io/mreider/checkoutservice-2:latest";
const old_image = "ghcr.io/mreider/checkoutservice:latest";

async function changeDeploy(namespace, name, version, image) {
  // find the particular deployment
  const res = await k8sApi.readNamespacedDeployment(name, namespace);
  let deployment = res.body;
  let labels = {}
  labels["app"] = "checkoutservice"
  labels["app.kubernetes.io/version"] = version
  labels["app.kubernetes.io/part-of"] = "OnlineBoutique"
  // edit
  deployment.spec.template.spec.containers[0].image = image;
  deployment.spec.template.metadata.labels = labels
  // replace
  await k8sApi.replaceNamespacedDeployment(name, namespace, deployment);
  console.log("k8s deployment image updated with " + image);
  console.log("k8s deployment version updated with " + version);
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
const rndMinutes = randomIntFromInterval(11, 40);

function tick() {
    //get the mins of the current time
    var mins = new Date().getMinutes();
    if (mins == rndMinutes) {
        changeDeploy(targetNamespaceName, targetDeploymentName, "1.1", new_image);
    }
    if (mins == rndMinutes + 3){
        changeDeploy(targetNamespaceName, targetDeploymentName, "1.0", old_image);
    }
  }
console.log("I am running...");
setInterval(tick, 1000);
