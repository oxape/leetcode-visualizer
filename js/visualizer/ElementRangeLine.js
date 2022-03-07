import Two from "two.js"

export class ElementRangeLine extends Two.Group {

    constructor(x=0, y=0, widthOfElement, numberOfElement) {
        super()

        this.startX = x
        this.x = x
        this.y = y
        this.widthOfElement = widthOfElement
        this.numberOfElement = numberOfElement
        this.height = 15
        this.duration = 0.0
        this.progress = 1.0

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
            if (this.progress < 0.999) {
                const width = this.widthOfElement*this.lastNumberOfElement
                const extraWidth = (this.numberOfElement-this.lastNumberOfElement)*this.widthOfElement*this.progress
                this.addAnchor(this.x+width+extraWidth*this.progress, this.y+this.height)
                this.addAnchor(this.x+width+extraWidth*this.progress, this.y)
                
                this.text.value = `${Math.ceil((0.01+this.widthOfElement*this.lastNumberOfElement+extraWidth*this.progress)/this.widthOfElement)}`
                this.text.translation.x = this.x+(this.widthOfElement*this.lastNumberOfElement+extraWidth*this.progress)*0.5
                this.text.translation.y = this.y+this.height+18
            } else {
                const width = this.widthOfElement*this.numberOfElement
                this.addAnchor(this.x+width, this.y+this.height)
                this.addAnchor(this.x+width, this.y)

                this.text.value = `${this.numberOfElement}`
                this.text.translation.x = this.x+this.widthOfElement*this.numberOfElement*0.5
                this.text.translation.y = this.y+this.height+18

                this.lastNumberOfElement = this.numberOfElement
            }
        }
        return this
    }

    startAt(n) {
        this.x = this.startX+n*this.widthOfElement
        return this
    }

    expandTo(n) {
        this.lastNumberOfElement = this.numberOfElement
        this.numberOfElement = n
        return this
    }

    animateDuring(total) {
        this.total = total
        this.progress = 0.0
        this.duration = 0.0
        return this
    }
    
    update(frameDelta) {
        if (this.duration > this.total*1000) {
            return this
        }
        this.duration += frameDelta;
        this.progress = this.duration/(this.total*1000);
        if (this.progress > 1.0) {
            this.progress = 1.0;
        }
        this.refresh()
        return this
    }
}