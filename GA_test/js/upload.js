const excel_file = document.getElementById('excel-file');

excel_file.addEventListener('change', (event) => {
  console.log(event);

  if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type)) {
    document.getElementById('alert').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';

    excel_file.value = '';

    return false;
  }

  var reader = new FileReader();

  reader.readAsArrayBuffer(event.target.files[0]);

  reader.onload = function (event) {

    var data = new Uint8Array(reader.result);

    var work_book = XLSX.read(data, { type: 'array' });

    var sheet_name = work_book.SheetNames;

    var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });

    if (sheet_data.length > 0) {
      document.getElementById('table').remove();
      var table_output = '<table id="table">';
      table_output += '<thead class="thead">';

      var row = 0;
      for (var cell = 0; cell < sheet_data[row].length; cell++) {

        table_output += '<th class="table-header">' + sheet_data[row][cell] + '</th>';

      }

      table_output += '</thead>';
      table_output += '<tbody class="tbody">';
      for (var row = 1; row < sheet_data.length; row++) {

        table_output += '<tr>';

        for (var cell = 0; cell < sheet_data[row].length; cell++) {

          table_output += '<td class="table-cell">' + sheet_data[row][cell] + '</td>';

        }

        table_output += '</tr>';

      }

      table_output += '</tbody>';

      table_output += '</table>';

      document.getElementById('excel_data').innerHTML = table_output;
      getAllCells();
    }

    excel_file.value = '';

  }

});

