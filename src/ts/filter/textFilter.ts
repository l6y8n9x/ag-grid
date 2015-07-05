/// <reference path="../utils.ts" />

module awk {

    var utils = awk.Utils;

    var template =
            '<div>'+
                '<div>'+
                    '<select class="ag-filter-select" id="filterType">'+
                        '<option value="1">[CONTAINS]</option>'+
                        '<option value="2">[EQUALS]</option>'+
                        '<option value="3">[STARTS WITH]</option>'+
                        '<option value="4">[ENDS WITH]</option>'+
                    '</select>'+
                '</div>'+
                '<div>'+
                    '<input class="ag-filter-filter" id="filterText" type="text" placeholder="[FILTER...]"/>'+
                '</div>'+
            '</div>';

    var CONTAINS = 1;
    var EQUALS = 2;
    var STARTS_WITH = 3;
    var ENDS_WITH = 4;

    export class TextFilter {

        filterParams: any;
        filterChangedCallback: any;
        localeTextFunc: any;
        valueGetter: any;
        filterText: any;
        filterType: any;
        api: any;

        eGui: any;
        eFilterTextField: any;
        eTypeSelect: any;

        constructor(params: any) {
            this.filterParams = params.filterParams;
            this.filterChangedCallback = params.filterChangedCallback;
            this.localeTextFunc = params.localeTextFunc;
            this.valueGetter = params.valueGetter;
            this.createGui();
            this.filterText = null;
            this.filterType = CONTAINS;
            this.createApi();
        }

        /* public */
        onNewRowsLoaded() {
            var keepSelection = this.filterParams && this.filterParams.newRowsAction === 'keep';
            if (!keepSelection) {
                this.api.setType(CONTAINS);
                this.api.setFilter(null);
            }
        }

        /* public */
        afterGuiAttached() {
            this.eFilterTextField.focus();
        }

        /* public */
        doesFilterPass(node: any) {
            if (!this.filterText) {
                return true;
            }
            var value = this.valueGetter(node);
            if (!value) {
                return false;
            }
            var valueLowerCase = value.toString().toLowerCase();
            switch (this.filterType) {
                case CONTAINS:
                    return valueLowerCase.indexOf(this.filterText) >= 0;
                case EQUALS:
                    return valueLowerCase === this.filterText;
                case STARTS_WITH:
                    return valueLowerCase.indexOf(this.filterText) === 0;
                case ENDS_WITH:
                    var index = valueLowerCase.indexOf(this.filterText);
                    return index >= 0 && index === (valueLowerCase.length - this.filterText.length);
                default:
                    // should never happen
                    console.warn('invalid filter type ' + this.filterType);
                    return false;
            }
        }

        /* public */
        getGui() {
            return this.eGui;
        }

        /* public */
        isFilterActive() {
            return this.filterText !== null;
        }

        createTemplate() {
            return template
                .replace('[FILTER...]', this.localeTextFunc('filterOoo', 'Filter...'))
                .replace('[EQUALS]', this.localeTextFunc('equals', 'Equals'))
                .replace('[CONTAINS]', this.localeTextFunc('contains', 'Contains'))
                .replace('[STARTS WITH]', this.localeTextFunc('startsWith', 'Starts with'))
                .replace('[ENDS WITH]', this.localeTextFunc('endsWith', 'Ends with'))
                ;
        }


        createGui() {
            this.eGui = utils.loadTemplate(this.createTemplate());
            this.eFilterTextField = this.eGui.querySelector("#filterText");
            this.eTypeSelect = this.eGui.querySelector("#filterType");

            utils.addChangeListener(this.eFilterTextField, this.onFilterChanged.bind(this));
            this.eTypeSelect.addEventListener("change", this.onTypeChanged.bind(this));
        }

        onTypeChanged() {
            this.filterType = parseInt(this.eTypeSelect.value);
            this.filterChangedCallback();
        }

        onFilterChanged() {
            var filterText = utils.makeNull(this.eFilterTextField.value);
            if (filterText && filterText.trim() === '') {
                filterText = null;
            }
            if (filterText) {
                this.filterText = filterText.toLowerCase();
            } else {
                this.filterText = null;
            }
            this.filterChangedCallback();
        }

        createApi() {
            var that = this;
            this.api = {
                EQUALS: EQUALS,
                CONTAINS: CONTAINS,
                STARTS_WITH: STARTS_WITH,
                ENDS_WITH: ENDS_WITH,
                setType: function (type: any) {
                    that.filterType = type;
                    that.eTypeSelect.value = type;
                },
                setFilter: function (filter: any) {
                    filter = utils.makeNull(filter);

                    if (filter) {
                        that.filterText = filter.toLowerCase();
                        that.eFilterTextField.value = filter;
                    } else {
                        that.filterText = null;
                        that.eFilterTextField.value = null;
                    }
                },
                getType: function () {
                    return that.filterType;
                },
                getFilter: function () {
                    return that.filterText;
                },
                getModel: function () {
                    if (that.isFilterActive()) {
                        return {
                            type: that.filterType,
                            filter: that.filterText
                        };
                    } else {
                        return null;
                    }
                },
                setModel: function (dataModel: any) {
                    if (dataModel) {
                        this.setType(dataModel.type);
                        this.setFilter(dataModel.filter);
                    } else {
                        this.setFilter(null);
                    }
                }
            };
        }

        getApi() {
            return this.api;
        }
    }
}

