import { LitElement, html, css } from 'lit';
import 'echarts/dist/echarts.min.js';
import { themeState } from 'theme-state';

/**
 * This is an abstract components used as a base for all echarts components
 */
class EchartsAbstractCanvas extends LitElement {
    static get styles() {
        return css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
      `;
    }

    static properties = {
        _width: {state: true},
        _height: {state: true},
    };

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this._rh = (e) => this._handleResize(e);
        window.addEventListener('resize', this._rh);

        this.themeStateObserver = () => this.reload();
        themeState.addObserver(this.themeStateObserver);
    }
      
    disconnectedCallback() {
        window.removeEventListener('resize', this._rh);
        themeState.removeObserver(this.themeStateObserver);
        super.disconnectedCallback();      
    }

    render() {
        if(!this._height){
            this._height = parseFloat(getComputedStyle(this).getPropertyValue('height'), 10) - 20;
        }
        if(!this._width){
            this._width = parseFloat(getComputedStyle(this).getPropertyValue('width'), 10) - 20;
        }
        return html`<div class="canvasContainer" style="width:${this._width}px;height:${this._height}px;"></div>`;
    }

    _handleResize(e){
        this._width = parseFloat(getComputedStyle(this).getPropertyValue('width'), 10) - 20;
        this._height = parseFloat(getComputedStyle(this).getPropertyValue('height'), 10) - 20;

        this._chart.resize();
    }

    firstUpdated(){
        super.firstUpdated();
        let canvasContainer = this.shadowRoot.querySelector('.canvasContainer');
        this._chart = echarts.init(canvasContainer);
        var option = this.getOption();
        this._chart.setOption(option);
    }

    getOption(){
        throw new Error("Method 'getOption()' must be implemented.");
    }

    reload(){
        var option = this.getOption();
        this._chart.setOption(option);
        this.requestUpdate();
    }

}

export { EchartsAbstractCanvas };
