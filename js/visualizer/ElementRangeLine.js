import Two from "two.js"

class AnimParam extends Object {
    constructor() {
        super()
        this.time = 0.0
        this.duration = 0.0
        this.progress = 0.0
        this.from = 0.0
        this.to = 0.0
        this.current = 0.0
        this.animating = false
    }

    onComplete(completion) {
        this.completion = completion
        if (!(!!this.duration) || this.duration < 0.001) {
            this.progress = 1.0
            if (this.animating) {
                if (!!this.completion) {
                    console.log('completion')
                    this.completion()
                }
                this.animating = false
                this.duration = 0.0
                this.progress = 1.0
            }
            return this
        }
    }

    animate(from, to, duration) {
        this.animating = true
        this.from = from
        this.to = to
        this.duration = duration
        this.time = 0.0
        this.progress = 0.0
        return this
    }

    advance(frameDelta) {
        if (!this.animating) {
            return this;
        }
        if (!(!!this.duration) || this.duration < 0.001) {
            this.progress = 1.0
            return this
        }
        if (this.time > this.duration*1000) {
            if (!!this.completion) {
                console.log('completion')
                this.completion()
            }
            this.animating = false
            this.duration = 0.0
            this.progress = 1.0
            return this
        }
        this.time += frameDelta;
        this.progress = this.time/(this.duration*1000);
        if (this.progress > 1.0) {
            this.progress = 1.0;
        }
        return this
    }

    getValue() {
        this.current = this.from + (this.to-this.from)*this.progress
        console.log(this.current)
        return this.current
    }
}

export class ElementRangeLine extends Two.Group {

    constructor(x=0, y=0, widthOfElement, numberOfElement) {
        super()

        this.startX = x
        this.x = x
        this.y = y
        this.startNumber = 0
        this.widthOfElement = widthOfElement
        this.numberOfElement = numberOfElement
        this.height = 15
        this.startAnimParam = new AnimParam()
        this.expandAnimParam = new AnimParam()

        var path = new Two.Path()
        path.linewidth = 2;
        path.noFill();
        path.automatic = false;
        this.add(path)
        this.path = path

        const styles = {
            family: 'monospace',
            size: 24,
            leading: 0,
            weight: 900,
            baseline: 'top'
          };
        
        var text = new Two.Text("X", this.x, this.y+this.height, styles);
        this.text = text
        this.add(text)

        this.addAnchor(this.x, this.y)
        this.addAnchor(this.x, this.y+this.height)

        this.addAnchor(this.x, this.y+this.height)
        this.addAnchor(this.x, this.y)

        this.refresh()
    }

    addAnchor(x, y) {
        var anchor = new Two.Anchor(x, y, 0, 0, 0, 0);
        anchor.command = Two.Commands[this.path.vertices.length > 0 ? 'curve' : 'move'];
        this.path.vertices.push(anchor);
    }

    refresh() {
        if (this.path.vertices.length > 0) {
            this.path.vertices.pop()
            this.path.vertices.pop()
            this.path.vertices.pop()
            this.path.vertices.pop()
        }

        this.addAnchor(this.x, this.y)
        this.addAnchor(this.x, this.y+this.height)

        if (!this.widthOfElement || !this.numberOfElement || this.widthOfElement < 0 || this.numberOfElement < 0) {
            this.addAnchor(this.x, this.y+this.height)
            this.addAnchor(this.x, this.y)

            this.text.value = `0`
            this.text.translation.x = this.x
            this.text.translation.y = this.y+this.height+18
        } else {
            if (this.expandAnimParam.animating) {
                const width = this.widthOfElement*this.expandAnimParam.getValue()
                this.addAnchor(this.x+width, this.y+this.height)
                this.addAnchor(this.x+width, this.y)
                
                this.text.value = `${Math.ceil((0.01+width)/this.widthOfElement)}`
                this.text.translation.x = this.x+width*0.5
                this.text.translation.y = this.y+this.height+18
            } else {
                const width = this.widthOfElement*this.numberOfElement
                this.addAnchor(this.x+width, this.y+this.height)
                this.addAnchor(this.x+width, this.y)

                this.text.value = `${this.numberOfElement}`
                this.text.translation.x = this.x+this.widthOfElement*this.numberOfElement*0.5
                this.text.translation.y = this.y+this.height+18
            }
        }
        return this
    }

    startAt(n) {
        this.lastStartNumber = this.startNumber
        this.x = this.startX+n*this.widthOfElement
        return this
    }

    expandTo(n) {
        this.lastNumberOfElement = this.numberOfElement
        this.numberOfElement = n
        return this
    }

    animateDuring(total) {
        //TODO: 这里不加延时forEach跑不完，需要研究
        this.expandAnimParam.animate(this.lastNumberOfElement, this.numberOfElement, Math.abs(this.numberOfElement-this.lastNumberOfElement)*total).onComplete(() => {
            this.lastNumberOfElement = this.numberOfElement
            this.completion()
        })
        return this
    }
    
    update(frameDelta) {
        this.expandAnimParam.advance(frameDelta)
        this.refresh()
        return this
    }

    onComplete(completion) {
        this.completion = completion;
    }
}
