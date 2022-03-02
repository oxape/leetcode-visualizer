import Two from "two.js"

class ElementRangeLine extends Two.Path {
    constructor(x, y, ewidth, n) {
        super()
        this.linewidth = 2;
        this.noFill();
        this.automatic = false;

        var anchor = new Two.Anchor(0-100/2, 50+0, 0, 0, 0, 0);
        anchor.command = Two.Commands[this.vertices.length > 0 ? 'curve' : 'move'];

        this.vertices.push(anchor);

        var anchor = new Two.Anchor(0-100/2, 50+10, 0, 0, 0, 0);
        anchor.command = Two.Commands[this.vertices.length > 0 ? 'curve' : 'move'];
        this.vertices.push(anchor);
    }
}

var two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);

var path; // Used to reference the currently selected path

var content = two.makeGroup();

var rangeLine = new ElementRangeLine();
content.add(rangeLine)

path = new Two.Path();
path.linewidth = 2;
path.noFill();
path.automatic = false;

content.add(path)

const styles = {
    family: 'monospace',
    size: 50,
    leading: 0,
    weight: 900,
  };

var text = new Two.Text("123", 0, 0, styles);
const rect = text.getBoundingClientRect();
console.log(two.width)
console.log(rect)
const textWidth = rect.width;
content.add(text)

var anchor = new Two.Anchor(0-rect.width/2, 50+0, 0, 0, 0, 0);
anchor.command = Two.Commands[path.vertices.length > 0 ? 'curve' : 'move'];

path.vertices.push(anchor);

var anchor = new Two.Anchor(0-rect.width/2, 50+10, 0, 0, 0, 0);
anchor.command = Two.Commands[path.vertices.length > 0 ? 'curve' : 'move'];

path.vertices.push(anchor);

content.position.set(two.width/2, (two.height-rect.height)/2);

// Bind a function to scale and rotate the group to the animation loop.
two.bind('update', update);
// Finally, start the animation loop
two.play();

var width = 100;

var duration = 0.0

function update(frameCount) {
    // This code is called every time two.update() is called.
    duration += two.timeDelta;
    var progress = duration/(3.0*1000);
    if (progress > 1.0) {
        duration = 0;
        progress = duration/3.0;
    }
    // width = textWidth*progress;
    width = rect.width*progress;

    if (path.vertices.length > 2) {
        path.vertices.splice(2, 2);
    }

    var anchor = new Two.Anchor(0-rect.width/2+width, 50+10, 0, 0, 0, 0);
    anchor.command = Two.Commands[path.vertices.length > 0 ? 'curve' : 'move'];
    path.vertices.push(anchor);

    var anchor = new Two.Anchor(0-rect.width/2+width, 50+0, 0, 0, 0, 0);
    anchor.command = Two.Commands[path.vertices.length > 0 ? 'curve' : 'move'];
    path.vertices.push(anchor);
    anchor.trigger(Two.Events.Types.change);
}
