import Phaser from "phaser";

export default class TrafficLight {
  preload() {
    this.load.image("traffic-go", "./assets/images/traffic-go.png");
    this.load.image("traffic-wait", "./assets/images/traffic-wait.png");
    this.load.image("traffic-stop", "./assets/images/traffic-stop.png");
  }

  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.state = "red";

    this.redLight = scene.add.image(x - 100, y, "traffic-stop").setVisible(true);
    this.yellowLight = scene.add.image(x - 100, y, "traffic-wait").setVisible(false);
    this.greenLight = scene.add.image(x - 100, y, "traffic-go").setVisible(false);

    this.redLight.setScale(0.3);
    this.yellowLight.setScale(0.3);
    this.greenLight.setScale(0.3);

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
    this.redLight.setVisible(this.state === "red");
    this.yellowLight.setVisible(this.state === "yellow");
    this.greenLight.setVisible(this.state === "green");
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
