import Two from "two.js"

var two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);
  
  // The cursor, matched with your mouse
  var mouse = new Two.Vector();
  mouse.radius = 4;
  mouse.radiusSquared = Math.pow(mouse.radius, 2);
  mouse.dragging = false;
  mouse.intersection = null;
  mouse.selected = new Two.Circle(0, 0, 2);
  mouse.selected.stroke = '#00AEFF';
  mouse.selected.scale = 2;
  mouse.selected.visible = false;
  
  var content = two.makeGroup(); // Everything that is drawn black
  var interaction = two.makeGroup();  // All the blue / pink interactive elements
  
  // The blue path highlight
  var selection = new Two.Path();
  selection.stroke = '#00AEFF';
  selection.noFill();
  selection.automatic = false;
  selection.visible = false;
  
  interaction.add(selection);
  
  // The pink control handles
  var controls = new Two.Group();
  controls.left = new Two.Circle(0, 0, 2);
  controls.right = new Two.Circle(0, 0, 2);
  controls.line = new Two.Path([
    new Two.Anchor(),
    new Two.Anchor(),
    new Two.Anchor()
  ]);
  controls.left.translation.bind(Two.Events.Types.change, updateControlHandles);
  controls.right.translation.bind(Two.Events.Types.change, updateControlHandles);
  controls.add(controls.line, controls.left, controls.right);
  controls.stroke = '#FF00AE';
  controls.anchor = null;
  interaction.add(controls);
  
  // A list of all the editable anchor points
  var points = new Two.Points();
  points.size = 4;
  points.stroke = '#00AEFF';
  interaction.add(points, mouse.selected);
  
  var path; // Used to reference the currently selected path
  var domElement = two.renderer.domElement;
  
  domElement.addEventListener('mousedown', mousedown, false);
  domElement.addEventListener('dblclick', doubleclick, false);
  domElement.addEventListener('mousemove', mousemove, false);
  
  function create() {
  
    path = new Two.Path();
    path.linewidth = 2;
    path.noFill();
    path.automatic = false;
  
    points.vertices = path.vertices;
    selection.vertices = path.vertices;
  
    content.add(path);
  
  }
  
  function add(x, y) {
  
    var anchor = new Two.Anchor(x, y, 0, 0, 0, 0);
    anchor.command = Two.Commands[path.vertices.length > 0 ? 'curve' : 'move'];
  
    path.vertices.push(anchor);
    controls.anchor = anchor;
    controls.left.translation.copy(anchor);
    controls.right.translation.copy(anchor);
  
    return anchor;
  
  }
  
  function remove(i) {
  
    mouse.selected.visible = false;
    path.vertices.splice(i, 1);
  
  }
  
  function close(x, y) {
  
    controls.anchor = null;
    path.closed = true;
    deselect();
  
    path = null;
  
  }
  
  function select() {
  
    points.visible = true;
    selection.visible = true;
  
  }
  
  function deselect() {
  
    points.visible = false;
    selection.visible = false;
  
  }
  
  function updateControlHandles() {
  
    // Update the pink control handles based on whatever the current
    // path's details are — keeps things in sync
  
    if (!controls.anchor) {
      return;
    }
  
    controls.line.vertices[0].copy(controls.left.translation);
    controls.line.vertices[1].copy(controls.anchor);
    controls.line.vertices[2].copy(controls.right.translation);
  
  }
  
  /**
   * Browser interactions handle below
   */
  
  function mousedown(e) {
  
    if (mouse.intersection) {
      mouse.dragging = true;
      if (mouse.intersection.id === 0) {
        // Hack to emulate closing, but actually using
        // one last point to simulate the left control handle
        // of the first point.
        var spoof = path.vertices[0];
        add(spoof.x, spoof.y);
      }
    } else {
      if (!path) {
        create();
        add(e.clientX, e.clientY);
        select();
      } else {
        add(e.clientX, e.clientY);
      }
    }
  
    window.addEventListener('mousemove', drag, false);
    window.addEventListener('mouseup', mouseup, false);
  
  }
  
  function doubleclick() {
  
    if (!path) {
      return;
    }
  
    var first = path.vertices[0];
  
    if (!first.controls.left.isZero() || !first.controls.right.isZero()) {
      // Hack to emulate closing, but actually using
      // one last point to simulate the left control handle
      // of the first point.
      var last = add(first.x, first.y);
      last.controls.left.copy(first.controls.left);
    }
  
    close();
  
  }
  
  function mousemove(e) {
  
    // Calculate what object is intersecting the mouse
    // only when we're not already doing some other interaction
  
    if (mouse.dragging) {
      return;
    }
  
    var x = mouse.x;
    var y = mouse.y;
  
    mouse.set(e.clientX, e.clientY);
  
    mouse.intersection = null;
  
    for (var i = 0; i < points.vertices.length; i++) {
  
      var point = points.vertices[i];
      var d = point.distanceToSquared(mouse);
  
      if (d <= mouse.radiusSquared) {
        mouse.selected.visible = true;
        mouse.selected.position.copy(point);
        mouse.intersection = {
          object: mouse.selected,
          id: i
        };
      }
  
    }
  
    if (!mouse.intersection) {
      mouse.selected.visible = false;
    }
  
  }
  
  function drag(e) {
  
    mouse.set(e.clientX, e.clientY);
  
    // Like mousemove, but on the window and only occuring when
    // we've called `mousedown` effectively creating a drag event
  
    if (mouse.dragging) {
  
      if (controls.anchor) {
  
        var anchor = selection.vertices[selection.vertices.length - 1];
        anchor.controls.left.copy(mouse).sub(anchor);
        anchor.controls.right.clear();
        anchor.trigger(Two.Events.Types.change);
  
        controls.visible = true;
        controls.left.translation.copy(anchor.controls.left).add(anchor);
        controls.right.translation.copy(anchor.controls.right).add(anchor);
  
      } else {
  
        // Move an existing point
        mouse.dragging = 1;
  
        var object = mouse.intersection.object;
        object.translation.copy(mouse);
  
      }
  
    } else if (controls.anchor) {
  
      // Move a just created anchor point
      var anchor = selection.vertices[selection.vertices.length - 1];
      anchor.controls.right.copy(mouse).sub(anchor);
      anchor.controls.left.copy(anchor.controls.right).rotate(Math.PI);
      anchor.trigger(Two.Events.Types.change);
  
      controls.visible = true;
      controls.left.translation.copy(anchor.controls.left).add(anchor);
      controls.right.translation.copy(anchor.controls.right).add(anchor);
  
    }
  
  }
  
  function mouseup() {
  
    if (mouse.intersection) {
  
      if (mouse.dragging === true) {
  
        // Close or remove a point from a path
  
        if (mouse.intersection.id > 0) {
  
          remove(mouse.intersection.id);
  
        } else {
  
          if (controls.anchor) {
  
            // If there was a modification of control points then
            // update the path accordingly.
  
            var anchor = path.vertices[path.vertices.length - 1];
  
            anchor.controls.left.copy(controls.left.translation).sub(anchor);
            anchor.controls.right.copy(controls.right.translation).sub(anchor);
  
            anchor.trigger(Two.Events.Types.change);
  
          }
  
          close();
  
        }
  
      }
  
    } else if (controls.anchor) {
  
      // Set the control point from the anchor to the corresponding path
      var anchor = path.vertices[path.vertices.length - 1];
      anchor.controls.left.copy(controls.left.translation).sub(anchor);
      anchor.controls.right.copy(controls.right.translation).sub(anchor);
      anchor.trigger(Two.Events.Types.change);
  
    }
  
    // Reset listeners and context aware variables.
  
    window.removeEventListener('mousemove', drag, false);
    window.removeEventListener('mouseup', mouseup, false);
  
    mouse.dragging = false;
    mouse.intersection = null;
  
    selection.closed = false;
    controls.visible = false;
  
  }