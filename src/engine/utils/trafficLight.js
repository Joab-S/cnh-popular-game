import Phaser from "phaser";

export default class TrafficLight {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.state = "red";

    this.light = scene.add.circle(x, y - 80, 20, 0xff0000);

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
  }

  changeState() {
    if (this.state === "red") {
      this.state = "green";
      this.light.setFillStyle(0x00ff00);
    } else if (this.state === "green") {
      this.state = "yellow";
      this.light.setFillStyle(0xffff00);
    } else {
      this.state = "red";
      this.light.setFillStyle(0xff0000);
    }
  }
}
