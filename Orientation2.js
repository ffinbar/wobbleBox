class DeviceOrientationControls {
    constructor() {
        this.quaternion = new THREE.Quaternion();
        this.deviceOrientation = {};
        this.screenOrientation = window.orientation || 0;

        this.onDeviceOrientationChangeEvent = this.onDeviceOrientationChangeEvent.bind(this);
        this.onScreenOrientationChangeEvent = this.onScreenOrientationChangeEvent.bind(this);

        window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);

        this.onScreenOrientationChangeEvent(); // Initialize screen orientation
    }

    onDeviceOrientationChangeEvent(event) {
        this.deviceOrientation = event;
        this.updateQuaternion();
    }

    onScreenOrientationChangeEvent() {
        this.screenOrientation = window.orientation || 0;
    }

    updateQuaternion() {

        const alpha = this.deviceOrientation.alpha ? THREE.Math.degToRad(this.deviceOrientation.alpha) : 0; // Z
        const beta = this.deviceOrientation.beta ? THREE.Math.degToRad(this.deviceOrientation.beta) : 0; // X'
        const gamma = this.deviceOrientation.gamma ? THREE.Math.degToRad(this.deviceOrientation.gamma) : 0; // Y''
        const orient = this.screenOrientation ? THREE.Math.degToRad(this.screenOrientation) : 0; // O

        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(beta, alpha, -gamma, 'YXZ')); // 'YXZ' for device, 'ZXY' for screen

        const orientQuaternion = new THREE.Quaternion();
        orientQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -orient);

        quaternion.multiply(orientQuaternion);

        this.quaternion.copy(quaternion);
    }

    getQuaternion() {
        return this.quaternion;
    }

    dispose() {
        window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
    }
}

// Usage
const customControls = new CustomDeviceOrientationControls();
const quaternion = customControls.getQuaternion();
console.log(quaternion);