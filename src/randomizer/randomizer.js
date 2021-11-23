const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

var targetNamespaceName = 'hipster';
var targetDeploymentName = 'loadgenerator';
var numberOfTargetReplicas = 9;
var rndMinutes = randomIntFromInterval(11, 40);
var rndMoreMinutes = randomIntFromInterval(41, 55);
var lastHour = 0;

async function scale(namespace, name, replicas) {
  // find the particular deployment
  const res = await k8sApi.readNamespacedDeployment(name, namespace);
  let deployment = res.body;

  // edit
  deployment.spec.replicas = replicas;

  // replace
  await k8sApi.replaceNamespacedDeployment(name, namespace, deployment);
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function tick() {
    //get the mins and hour of the current time
    const d = new Date();
    var mins = d.getMinutes();
    var hours = d.getHours();

    if ((mins == rndMinutes) && (hours % 3 == 0) && (hours != lastHour)) {
        scale(targetNamespaceName, targetDeploymentName, numberOfTargetReplicas);
    }
    if ((mins == rndMoreMinutes) && (hours % 3 == 0 ) && (hours != lastHour)) {
        scale(targetNamespaceName, targetDeploymentName, 1);
        lastHour = hours;
        rndMinutes = randomIntFromInterval(11, 40);
        rndMoreMinutes = randomIntFromInterval(41, 55);
    }

  }
  
setInterval(tick, 1000);


