import { IInputs, IOutputs } from "./generated/ManifestTypes";

var Xrm: any;

export class Tags implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
     * Variables for HTML element
     */
    private tagsElement: HTMLElement;
    private spaceElement: HTMLElement;
    private refreshButton: HTMLElement;
    private divElement: HTMLElement;

    /**
     * Variables for Properties
     */
    private tagsString: string;

    /**
     * Variables for Event Listener
     */
    private refreshClicked: EventListenerOrEventListenerObject;

    /**
     * Local Variables
     */
    private localContext: ComponentFramework.Context<IInputs>;
    private localNotifyOutputChanged: () => void;
    private localContainer: HTMLDivElement;

	/**
	 * Empty constructor.
	 */
    constructor() {

    }

    /**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        // Init local variables
        this.localContext = context;
        this.localNotifyOutputChanged = notifyOutputChanged;
        this.localContainer = container;

        // Register EventHandler
        this.refreshClicked = this.refreshClick.bind(this);

        // Refresh button
        this.refreshButton = document.createElement("button");
        this.refreshButton.setAttribute("type", "button");
        this.refreshButton.setAttribute("value", "Refresh");
        this.refreshButton.setAttribute("class", "btn btn-default btn-sm glyphicon glyphicon-refresh");
        this.refreshButton.addEventListener("click", this.refreshClick);

        // Add elements to container
        this.localContainer.appendChild(this.refreshButton);

        // CRM attributes bound to the control properties. 
        // @ts-ignore
        var crmTagStringsAttributeValue = Xrm.Page.getAttribute(crmTagStringsAttribute).getValue();
        var data = crmTagStringsAttributeValue.split(",");

        for (var i in data) {
            // Create controls
            // Tag element
            this.tagsElement = document.createElement("span");
            this.tagsElement.setAttribute("class", "badge badge-pill badge-primary");
            var ele = this.localContainer.appendChild(this.tagsElement);
            ele.innerHTML = data[i];

            // Space element
            this.spaceElement = document.createElement("span");
            var space = this.localContainer.appendChild(this.spaceElement);
            space.innerHTML = "  ";
        }
    }


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view

        // CRM attributes bound to the control properties. 
        // @ts-ignore 
        var crmTagStringsAttribute = this._context.parameters.Tags.attributes.LogicalName;

        // @ts-ignore 
        var crmTagStringsAttributeValue = window.parent.Xrm.Page.getAttribute(crmTagStringsAttribute).getValue();
        var data = crmTagStringsAttributeValue.split(",");

        // Delete all elements first
        var tagCollection = document.getElementsByTagName("span");
        for (var tagIndex in tagCollection) {
            this.localContainer.removeChild(tagCollection[tagIndex]);
        }

        // Add new tags
        for (var i in data) {
            // Create controls
            // Tag element
            this.tagsElement = document.createElement("span");
            this.tagsElement.setAttribute("class", "badge badge-pill badge-primary");

            var ele = this.localContainer.appendChild(this.tagsElement);
            ele.innerHTML = data[i];

            // Space element
            this.spaceElement = document.createElement("span");

            var space = this.localContainer.appendChild(this.spaceElement);
            space.innerHTML = "  ";
        }
    }

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
    public getOutputs(): IOutputs {
        return {
            Tags: this.tagsString
        };
    }

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
    public destroy(): void {
        // remove the event handlers. 
        this.refreshButton.removeEventListener("click", this.refreshClick);
    }

    /**
     * Custom Event Handlers
     */
    public refreshClick(evnt: Event): void {
        this.localNotifyOutputChanged();
    }
}