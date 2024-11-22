const dayArray = ['all', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

$(document).ready(function() {
    const showDaySelect = $('#show-day');

    // Initial setup
    showDay(showDaySelect.val());
    enableDisableNewEntryButton(showDaySelect.val());

    // Event listeners
    showDaySelect.on('change', function() {
        const selectedDay = $(this).val();
        showDay(selectedDay);
        enableDisableNewEntryButton(selectedDay);
    });

    $('button.new-entry').on('click', function() {
        if (showDaySelect.val() !== 0) { 
            addRow();
        }
    });

    // Event delegation for auto-resize textareas within .day-row
    $(document).on('input', '.day-row textarea, #day-activity', function() {
        autoResize({ target: this });
    });

    // Initial resize for existing textareas
    $('.day-row textarea').each(function() {
        autoResize({ target: this });
    });

    autoResize({ target: $('#day-activity') });
});

$(document).ready(function() {
    // Sync desktop view with mobile view
    $(document).on('input', '.day-row td input, .day-row td textarea', function() {
        // Get id of the input/textarea element and add 'span' before number
        const id = $(this).attr('id');
        const value = $(this).val();
        const idArray = id.split('-');
        const day = idArray[0];

        let type, number;
        if (idArray.length === 4) {
            type = idArray[1] + '-' + idArray[2];
            number = idArray[3];
        } else {
            type = idArray[1];
            number = idArray[2];
        }

        const mobileContent = $('.mobile-element #' + day + '-content-' + number);
        const mobileElement = mobileContent.find('#' + day + '-' + type + '-span-' + number);
        mobileElement.text(value);

        console.log('#' + day + '-' + type + '-span-' + number)
        console.log(mobileElement.attr('id'));
    });
});

// Utility functions
function autoResize(event) {
    const textarea = event.target;
    const textareaID = textarea.id;
    const idArray = textareaID.split('-');
    const day = idArray[0];

    let number;
    if (idArray.length === 4) {
        number = idArray[3];
    } else {
        number = idArray[2];
    }

    const workHoursElement = $('#' + day + '-work-hours-' + number);
    const departmentElement = $('#' + day + '-department-' + number);

    textarea.style.height = 'auto';
    const height = textarea.scrollHeight;
    textarea.style.height = height + 'px';
    workHoursElement.css('height', height + 'px');
    departmentElement.css('height', height + 'px');
}

function getSelectedDay() {
    const showDaySelect = $('#show-day');
    const selectedDay = dayArray[showDaySelect.val()];
    return selectedDay;
}

function getNextRowNumber() {
    const table = $('#t-' + getSelectedDay());
    const number = table.find('tr').length;
    return number;
}

function enableDisableNewEntryButton(day) {
    const selectedDay = dayArray[day];
    const newEntryButtons = document.querySelectorAll('button.new-entry');

    newEntryButtons.forEach(button => {
        button.disabled = (selectedDay === 'all');
    });
}

// Show/hide day content
function showDay(day) {
    const selectedDay = dayArray[day];
    
    if (selectedDay == 'all') {
        $('.day-content').show();
        return;
    } 
    
    $('.day-content').hide();
    $('.' + selectedDay + '-content').show();
}

// Add new row
function addRow() {
    const tableRowTemplate = $('#table-row-template').html();
    const selectedDay = getSelectedDay();
    const number = getNextRowNumber();

    if (number > 10) {
        alert('Sie können nur bis zu 10 Einträge für jeden Tag hinzufügen.');
        return;
    }

    const table = $('#t-' + selectedDay + ' tbody'); // Select tbody instead of table

    const newRow = tableRowTemplate.replace(/DD/g, selectedDay).replace(/integer/g, number);

    const mobileRowTemplate = $('#mobile-row-template').html();
    const container = $('.mobile-element .' + selectedDay + '-content');

    const dayNames = {
        monday: 'Montag',
        tuesday: 'Dienstag',
        wednesday: 'Mittwoch',
        thursday: 'Donnerstag',
        friday: 'Freitag',
        saturday: 'Samstag',
        sunday: 'Sonntag'
    };

    const newMobileRow = mobileRowTemplate.replace(/DD/g, selectedDay).replace(/integer/g, number).replace(/Day/g, dayNames[selectedDay]);

    table.append(newRow);
    container.append(newMobileRow);
}

// Edit popup functions
var editingDay = null;
var editingNumber = null;

$(document).on('click', '.mobile-element .day-content > div', function() {
    const id = $(this).attr('id');
    const day = id.split('-')[0];
    const number = id.split('-')[2];

    setEditingValues(day, number);
    fetchDayRow();
    openEditPopup();
});

$('#close-day-edit-popup').on('click', function() {
    closeEditPopup();
    resetEditingValues();
});

$('#save-day-edit').on('click', function() {
    saveDayRow();
    closeEditPopup();
    resetEditingValues();
});

function openEditPopup() {
    $('#day-edit-popup').show();
}

function closeEditPopup() {
    $('#day-edit-popup').hide();
}

function setEditingValues(day, number) {
    editingDay = day;
    editingNumber = number;
}

function resetEditingValues() {
    editingDay = null;
    editingNumber = null;
}

function fetchDayRow() {
    const editPopup = $('#day-edit-popup');
    const dayRow = $('#' + editingDay + '-row-' + editingNumber);

    const activity = dayRow.find('#' + editingDay + '-activity-' + editingNumber).val();
    const hours = dayRow.find('#' + editingDay + '-work-hours-' + editingNumber).val();
    const department = dayRow.find('#' + editingDay + '-department-' + editingNumber).val();

    editPopup.find('#day-activity').val(activity);
    editPopup.find('#day-work-hours').val(hours);
    editPopup.find('#day-department').val(department);
}

function saveDayRow() {
    const editPopup = $('#day-edit-popup');
    const mobileContent = $('.mobile-element #' + editingDay + '-content-' + editingNumber);
    const dayRow = $('#' + editingDay + '-row-' + editingNumber);

    const activity = editPopup.find('#day-activity').val();
    const hours = editPopup.find('#day-work-hours').val();
    const department = editPopup.find('#day-department').val();

    dayRow.find('#' + editingDay + '-activity-' + editingNumber).val(activity);
    dayRow.find('#' + editingDay + '-work-hours-' + editingNumber).val(hours);
    dayRow.find('#' + editingDay + '-department-' + editingNumber).val(department);

    mobileContent.find('#' + editingDay + '-activity-span-' + editingNumber).text(activity);
    mobileContent.find('#' + editingDay + '-work-hours-span-' + editingNumber).text(hours);
    mobileContent.find('#' + editingDay + '-department-span-' + editingNumber).text(department);
}

function openNav() {
    document.getElementById("nav-overlay").style.width = "100%";
}

function closeNav() {
    document.getElementById("nav-overlay").style.width = "0%";
}