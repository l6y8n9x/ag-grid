var listOfDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

var gridOptions = {
    columnDefs: [
        {
            headerName: 'Days (Values Not Provided)',
            field: 'days',
            filter: 'agSetColumnFilter',
            filterParams: {
                comparator: daysSortComparator
            }
        },
        {
            headerName: 'Days (Values Provided)',
            field: 'days',
            filter: 'agSetColumnFilter',
            filterParams: {
                values: listOfDays,
                comparator: daysSortComparator
            }
        },
    ],
    defaultColDef: {
        flex: 1,
        filter: true,
        resizable: true,
    },
    rowData: getRowData(),
    sideBar: 'filters',
    onGridReady: function(params) {
        params.api.getToolPanelInstance('filters').expandFilters();
    }
};

function getRowData() {
    var weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    var rows = [];
    for (var i = 0; i < 200; i++) {
        var index = Math.floor(Math.random() * 5);
        rows.push({ days: weekdays[index] });
    }

    return rows;
}


function daysSortComparator(a, b) {
    var aIndex = listOfDays.indexOf(a);
    var bIndex = listOfDays.indexOf(b);
    if (aIndex === bIndex) return 0;
    return aIndex > bIndex ? 1 : -1;
}


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});