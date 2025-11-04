import Phaser from "phaser";

export default class TrafficLight {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.state = "red";

    this.box = scene.add.rectangle(x - 170, y, 40, 90, 0x444444);
    this.redLight = scene.add.circle(x - 170, y - 30, 10, 0xff0000);
    this.yellowLight = scene.add.circle(x - 170, y, 10, 0x555500);
    this.greenLight = scene.add.circle(x - 170, y + 30, 10, 0x005500);

    this.sensor = scene.matter.add.rectangle(x, y, width, height, {
      isStatic: true,
      isSensor: true,
      label: "trafficSensor",
    });

    scene.time.addEvent({
      delay: 4000,
      loop: true,
      callback: () => this.changeState(),
    });

    this.updateLights();
  }

  updateLights() {
    this.redLight.setFillStyle(this.state === "red" ? 0xff0000 : 0x550000);
    this.yellowLight.setFillStyle(
      this.state === "yellow" ? 0xffff00 : 0x555500
    );
    this.greenLight.setFillStyle(this.state === "green" ? 0x00ff00 : 0x005500);
  }

  changeState() {
    if (this.state === "red") {
      this.state = "green";
    } else if (this.state === "green") {
      this.state = "yellow";
    } else {
      this.state = "red";
    }

    this.updateLights();
  }
}
