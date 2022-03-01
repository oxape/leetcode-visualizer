import Two from "two.js"

var two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);

var path; // Used to reference the currently selected path
var domElement = two.renderer.domElement;

var content = two.makeGroup();

path = new Two.Path();
path.linewidth = 2;
path.noFill();
path.automatic = false;

content.add(path)

var anchor = new Two.Anchor(100, 100, 0, 0, 0, 0);
anchor.command = Two.Commands[path.vertices.length > 0 ? 'curve' : 'move'];

path.vertices.push(anchor);

var anchor = new Two.Anchor(200, 200, 0, 0, 0, 0);
anchor.command = Two.Commands[path.vertices.length > 0 ? 'curve' : 'move'];

path.vertices.push(anchor);