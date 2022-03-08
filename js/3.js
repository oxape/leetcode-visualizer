import Two from "two.js";
import async from "async";
import { ElementRangeLine } from "./visualizer/ElementRangeLine";

var two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);

var path; // Used to reference the currently selected path

var content = two.makeGroup();

const styles = {
    family: 'monospace',
    size: 50,
    leading: 0,
    weight: 900,
    baseline: 'top'
  };

var text = new Two.Text("0", 0, 0, styles);
const textWidth = text.getBoundingClientRect().width;
// text.value = "abcxcdefgh"
text.value = "abcxcib"
// text.value = "abcxcib"
content.add(text)

const rect = text.getBoundingClientRect();
var rangeLine = new ElementRangeLine(rect.left, rect.bottom+4, textWidth, 1);
content.add(rangeLine)

content.position.set(two.width/2, (two.height-rect.height)/2);

two.bind('update', () => {
    rangeLine.update(two.timeDelta)
});

two.play();

console.log('now')

// setTimeout(() => {
//     rangeLine.expandTo(3)
//     // rangeLine.refresh()
//     rangeLine.animateDuring(5.0)
// }, 1000)

// setTimeout(() => {
//     rangeLine.startAt(3)
//     rangeLine.expandTo(1)
//     // rangeLine.refresh()
//     rangeLine.animateDuring(2.0)
// }, 3500)

// for (var index = 0; index < text.value.length; index++) {
//     const c = text.value[index]
//     if (current_dict.hasOwnProperty(c)) {
//         if (nums > max_length) {
//             max_length = nums
//         }
//         const current_character_index = (current_dict[c] + 1)
//         nums = Math.min(index - current_character_index + 1, nums + 1)
//     } else {
//         nums +1
//     }
//     current_dict[c] = index
// }
// if (nums > max_length) {
//     max_length = nums
// }

var current_dict = {}
var nums = 0
var max_length = 0
var index = 0
var start = 0
async.forEachSeries(text.value, function (c, callback) {
    console.log(c)
    if (current_dict.hasOwnProperty(c)) {
        if (nums > max_length) {
            max_length = nums
        }
        const current_character_index = (current_dict[c] + 1)
        if (index-current_character_index+1 < nums+1) {
            start = current_character_index;
        } else {
            start = index-nums;
        }
        current_dict[c] = index
        nums = Math.min(index - current_character_index + 1, nums + 1)
        console.log(`not start = ${start} nums = ${nums}`)
        rangeLine.startAt(start).expandTo(nums).animateDuring(2.5).onComplete(()=>{
            callback();
        })
        index += 1
    } else {
        nums += 1
        current_dict[c] = index
        index += 1
        console.log(`start = ${start} nums = ${nums}`)
        rangeLine.startAt(start).expandTo(nums).animateDuring(2.5).onComplete(()=>{
            callback();
        })
    }
  }, function (err) {
    if (err) console.error(err.message);
  })

  //TODO: startAt加动画
