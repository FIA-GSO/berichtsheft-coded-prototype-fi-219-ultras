const dayArray = ['all', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

$(document).ready(function() {
    const showDaySelect = $('#show-day');

    showDay(showDaySelect.val());
    enableDisableNewEntryButton(showDaySelect.val());

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

    autoResize({ target: $('#day-activity')})

    function autoResize(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
});

function getSelectedDay() {
    const showDaySelect = $('#show-day');
    const selectedDay = dayArray[showDaySelect.val()];
    console.log(selectedDay);
    return selectedDay;
}

function showDay(day) {
    const selectedDay = dayArray[day];
    
    if (selectedDay == 'all') {
        $('.day-content').show();
        return
    } 
    
    $('.day-content').hide();
    $('.' + selectedDay + '-content').show();
}

function getNextRowNumber() {
    const table = $('#t-' + getSelectedDay());
    const number = table.find('tr').length;
    return number;
}

function addRow() {
    const tableRowTemplate = $('#table-row-template').html();
    const selectedDay = getSelectedDay();
    const number = getNextRowNumber();

    if (number > 10) {
        alert('You can only add up to 10 entries per day');
        return;
    }

    const table = $('#t-' + selectedDay + ' tbody'); // Select tbody instead of table

    const newRow = tableRowTemplate.replace(/DD/g, selectedDay).replace(/number/g, number);

    const mobileRowTemplate = $('#mobile-row-template').html();
    const container = $('.mobile-element .' + selectedDay + '-content');

    const newMobileRow = mobileRowTemplate.replace(/DD/g, selectedDay).replace(/number/g, number).replace(/Day/g, selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1));

    table.append(newRow);
    container.append(newMobileRow);
}

function enableDisableNewEntryButton(day) {
    const selectedDay = dayArray[day];
    const newEntryButtons = document.querySelectorAll('button.new-entry');

    newEntryButtons.forEach(button => {
        button.disabled = (selectedDay === 'all');
    });
}

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
    syncDayRow();
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

    const activity =  dayRow.find('#' + editingDay +'-activity-' + editingNumber).val();
    const hours =  dayRow.find('#' + editingDay +'-work-hours-' + editingNumber).val();
    const department =  dayRow.find('#' + editingDay +'-department-' + editingNumber).val();

    editPopup.find('#day-activity').val(activity);
    editPopup.find('#day-work-hours').val(hours);
    editPopup.find('#day-department').val(department);
}

function syncDayRow() {
    const editPopup = $('#day-edit-popup');
    const mobileContent = $('.mobile-element #' + editingDay + '-content-' + editingNumber);
    const dayRow = $('#' + editingDay + '-row-' + editingNumber);

    const activity = editPopup.find('#day-activity').val();
    const hours = editPopup.find('#day-work-hours').val();
    const department = editPopup.find('#day-department').val();

    dayRow.find('#' + editingDay +'-activity-' + editingNumber).val(activity);
    dayRow.find('#' + editingDay +'-work-hours-' + editingNumber).val(hours);
    dayRow.find('#' + editingDay +'-department-' + editingNumber).val(department);

    mobileContent.find('#' + editingDay +'-activity-span-' + editingNumber).text(activity);
    mobileContent.find('#' + editingDay +'-work-hours-span-' + editingNumber).text(hours);
    mobileContent.find('#' + editingDay +'-department-span-' + editingNumber).text(department); 
}