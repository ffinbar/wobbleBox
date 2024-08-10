import * as THREE from 'three';

class DeviceOrientationControls {
    constructor(camera, paramObject) {
        this.body = paramObject.body;
        this.mesh = paramObject.mesh;
        // this.directionVector = directionVector;

        this.camera = camera;
        this.enabled = true;
        this.sensorDetected = false;
        this.onSensorDetected = () => {};

        try {
            this.sensor = new AbsoluteOrientationSensor({ frequency: 30, referenceFrame: 'screen' });
            this.sensor.onerror = (event) => {
                if (event.error.name === 'NotAllowedError') {
                    console.log('Permission to access sensor was denied.');
                } else if (event.error.name === 'NotReadableError') {
                    console.log('Cannot connect to the sensor.');
                }
            };
            this.sensor.onreading = () => {
                if (!this.sensor) {
                    console.error('Sensor reading called, but no sensor');
                    return;
                }

                if (!this.sensor.quaternion) {
                    console.warn('Reading, but no quaternion.');
                    return;
                }

                if (!this.sensorDetected) {
                    this.sensorDetected = true;
                    this.onSensorDetected();
                }

                if (this.enabled) {

                    //we want to map the sensor orientation to this.sensorData.directionVector
                    
                    // this.directionVector.set(0, 0, -1).applyQuaternion(this.sensor.quaternion);
                    // this.directionVector.normalize();

                    // alert(this.sensorData.directionVector.x + " " + this.sensorData.directionVector.y + " " + this.sensorData.directionVector.z);
                    // // this.camera.quaternion.copy(this.sensor.quaternion);


                    const q1 = new THREE.Quaternion().fromArray(this.sensor.quaternion);
                    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
                    // this.camera.quaternion.multiplyQuaternions(q2, q1);

                    let q = new THREE.Quaternion().multiplyQuaternions(q2, q1);
                    this.q = q;
                    // if(this.body && this.mesh) {
                    //     let meshPos = this.mesh.getWorldPosition(new THREE.Vector3());
                    //     this.body.position.set(meshPos.x, meshPos.y, meshPos.z);
                    //     this.body.velocity.set(0, 0, 0);
                    //     this.body.quaternion.copy(this.camera.quaternion);
                    //     // this.body.world.step(1/120);
                    // }

                }
            };
            this.sensor.start();
        } catch (error) {
            if (error.name === 'SecurityError') {
                console.log('Sensor construction was blocked by the Permissions Policy.');
            } else if (error.name === 'ReferenceError') {
                console.log('Sensor is not supported by the User Agent.');
            } else {
                throw error;
            }
        }

        this.connect();
    }

    connect() {
        this.enabled = true;
        if (this.sensor) {
            this.sensor.start();
        }
    }

    disconnect() {
        this.enabled = false;
        if (this.sensor) {
            this.sensor.stop();
        }
    }

    
}

export { DeviceOrientationControls };
