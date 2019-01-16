import {Component, ElementRef, EventEmitter, forwardRef, OnInit, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'ngx-message-editor',
    templateUrl: 'message-editor.component.html',
    styleUrls: ['message-editor.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NgxMessageEditorComponent),
        multi: true
    }]
})
export class NgxMessageEditorComponent implements OnInit, ControlValueAccessor {

    @ViewChild('editor')
    editor: ElementRef;

    @Output()
    enterEvent = new EventEmitter<any>();

    @Output()
    ctrlEnterEvent = new EventEmitter<any>();

    propagateChange = (_: any) => { };

    constructor() {
    }

    ngOnInit() {
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
        this.editor.nativeElement.innerHTML = obj === null ? '' : obj;
    }

    input(event: Event) {
        this.propagateChange(event.srcElement.innerHTML);
    }

    enter() {
        this.enterEvent.emit();
    }

    ctrlEnter() {
        this.ctrlEnterEvent.emit();
    }


    paste(event: ClipboardEvent) {
        event.preventDefault();
        const cbd = event.clipboardData;
        const ua = window.navigator.userAgent;
        // 如果是 Safari 直接 return
        if (!(cbd && cbd.items)) {
            return;
        }
        // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
        if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === 'string' && cbd.items[1].kind === 'file' &&
            cbd.types && cbd.types.length === 2 && cbd.types[0] === 'text/plain' && cbd.types[1] === 'Files' &&
            ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
            return;
        }
        for (let i = 0; i < cbd.items.length; i++) {
            const item = cbd.items[i];
            if (item.kind === 'file') {
                const blob = item.getAsFile();
                if (blob.size === 0) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent) => {
                    const image = new Image();
                    image.src = <any>(<FileReader>e.target).result;
                    this.insertNode(image);
                    // this.content += `<img src="${(<FileReader>e.target).result}">`;
                };
                reader.readAsDataURL(blob);
            } else if (item.type === 'text/plain') {
                item.getAsString(str => {
                    console.log(str);
                    this.insertNode(new Text(str));
                });
            } else if (item.type === 'text/html') {
                item.getAsString(str => {
                    this.insertNode(new Text(str.replace(/<\/?.+?>/g, '')
                        .replace(/ /g, '').replace(/\n/g, '')
                        .replace(/&lt;/g, '<')
                        .replace(/&lt;/g, '>')));
                });
            }
        }
        this.input(event);
    }

    private insertNode(node: Node) {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        range.deleteContents();
        let container = range.startContainer;
        const pos = range.startOffset;
        let offset;
        // 如是一个TextNode
        if (container.nodeType === 3) {
            if (node.nodeType === 3) {
                (<Text>container).insertData(pos, node.nodeValue);
                offset = pos + node.nodeValue.length;
            } else {
                (<Text>container).splitText(pos);
                let ele = container;
                let afternodeIndex = 1;
                while (ele = ele.previousSibling) {
                    afternodeIndex++;
                }
                container = container.parentNode;
                const afternode = container.childNodes[afternodeIndex];
                container.insertBefore(node, afternode);
                offset = afternodeIndex + 1;
            }
        } else {
            const afternode = container.childNodes[pos];
            container.insertBefore(node, afternode);
            offset = pos + 1;
        }
        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStart(container, offset);
        newRange.setEnd(container, offset);
        sel.addRange(newRange);
        container.normalize();
    }
}
